import { createHmac, timingSafeEqual } from "node:crypto";
import { sampleProducts } from "./sample-products";
import { shopifyVariants, SHOPIFY_STOREFRONT_TOKEN } from "./shopify";

const API_VERSION = process.env["SHOPIFY_API_VERSION"] ?? "2026-10";
const SHOP = process.env["SHOPIFY_SHOP"] ?? "good-chapter-she2du76.myshopify.com";
const TOKEN = process.env["SHOPIFY_STOREFRONT_TOKEN"] ?? SHOPIFY_STOREFRONT_TOKEN;
const CLAIM_PROPERTY = "good_chapter_claim";

export async function createClaimCheckout(
  productName: string,
  claimId: string,
  from: string,
): Promise<{ checkoutUrl: string; variant: string }> {
  const product = sampleProducts.find((item) => item.name === productName);
  const variant = product ? shopifyVariants[product.id] : undefined;
  if (!variant) {
    throw Object.assign(new Error("This gift is not available for checkout."), {
      code: "GIFT_UNAVAILABLE",
    });
  }

  const response = await fetch(`https://${SHOP}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({
      query: `mutation CreateGiftCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
            totalQuantity
            lines(first: 2) {
              nodes {
                quantity
                merchandise { ... on ProductVariant { id } }
              }
            }
          }
          userErrors { message }
        }
      }`,
      variables: {
        input: {
          lines: [
            {
              merchandiseId: variant,
              quantity: 1,
              attributes: [
                { key: CLAIM_PROPERTY, value: claimId },
                { key: "From", value: from },
              ],
            },
          ],
        },
      },
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error("Shopify checkout is temporarily unavailable.");

  const result = await response.json();
  const cart = result?.data?.cartCreate?.cart;
  const lines = cart?.lines?.nodes;
  if (
    result?.errors?.length ||
    result?.data?.cartCreate?.userErrors?.length ||
    !cart?.checkoutUrl ||
    cart.totalQuantity !== 1 ||
    lines?.length !== 1 ||
    lines[0]?.quantity !== 1 ||
    lines[0]?.merchandise?.id !== variant
  ) {
    throw Object.assign(new Error("This gift is currently unavailable for checkout."), {
      code: "GIFT_UNAVAILABLE",
    });
  }

  const checkoutUrl = new URL(cart.checkoutUrl);
  checkoutUrl.searchParams.set("channel", "online_store");
  return { checkoutUrl: checkoutUrl.toString(), variant };
}

export function isAuthenticPaidOrderWebhook(request: Request, body: string): boolean {
  const secret = process.env["SHOPIFY_WEBHOOK_SECRET"];
  const shop = process.env["SHOPIFY_SHOP"] ?? SHOP;
  const signature = request.headers.get("x-shopify-hmac-sha256");
  if (
    !secret ||
    request.headers.get("x-shopify-shop-domain") !== shop ||
    request.headers.get("x-shopify-topic") !== "orders/paid" ||
    !signature
  ) {
    return false;
  }

  const supplied = Buffer.from(signature, "base64");
  const expected = createHmac("sha256", secret).update(body).digest();
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
