import { createFileRoute } from "@tanstack/react-router";
import { isAuthenticPaidOrderWebhook } from "@/lib/pilot-shopify.server";

type ShopifyLine = {
  variant_id?: string | number | null;
  quantity?: number;
  properties?: { name?: string; value?: string }[] | null;
};

type PaidOrder = {
  id?: string | number;
  admin_graphql_api_id?: string;
  line_items?: ShopifyLine[];
};

export const Route = createFileRoute("/api/webhooks/orders-paid")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        if (Buffer.byteLength(body, "utf8") > 2_000_000) {
          return Response.json({ error: "Request is too large." }, { status: 413 });
        }
        if (!isAuthenticPaidOrderWebhook(request, body)) {
          return Response.json({ error: "Invalid webhook." }, { status: 401 });
        }

        let order: PaidOrder;
        try {
          order = JSON.parse(body) as PaidOrder;
        } catch {
          return Response.json({ error: "Invalid order payload." }, { status: 400 });
        }
        if (!/^\d+$/.test(String(order.id ?? "")) || !Array.isArray(order.line_items)) {
          return Response.json({ error: "Invalid order payload." }, { status: 400 });
        }

        const quantities = new Map<
          string,
          { claim_id: string; variant_id: string; quantity: number }
        >();
        for (const line of order.line_items) {
          const claimId = line.properties?.find(
            (property) => property.name === "good_chapter_claim",
          )?.value;
          if (!claimId) continue;
          const variantId = String(line.variant_id ?? "");
          const quantity = Number(line.quantity);
          if (!Number.isSafeInteger(quantity) || quantity < 1) {
            return Response.json({ error: "Invalid order line." }, { status: 400 });
          }
          const existing = quantities.get(claimId);
          if (existing) {
            existing.quantity += quantity;
            if (existing.variant_id !== variantId) existing.variant_id = "";
          } else {
            quantities.set(claimId, { claim_id: claimId, variant_id: variantId, quantity });
          }
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const orderId = order.admin_graphql_api_id ?? String(order.id);
        const { error } = await supabaseAdmin.rpc("record_good_chapter_paid_order", {
          p_order_id: orderId,
          p_lines: [...quantities.values()],
          p_order_valid: order.line_items.length === 1 && order.line_items[0]?.quantity === 1,
        });
        if (error) {
          console.error("orders-paid webhook", error);
          return Response.json({ error: "Order reconciliation failed." }, { status: 500 });
        }

        return new Response(null, { status: 204 });
      },
    },
  },
});
