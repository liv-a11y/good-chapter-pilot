# Good Chapter

Good Chapter helps friends show up for life moments that never came with a registry. A friend starts a chapter, the person reviews it privately, and their circle gives without duplicate gifts.

## First Place investor preview

Open `/first-place` (also available at `/sample`) for the presentation walkthrough:

1. Jordan chooses Maya Ellison’s First Place chapter and curates eight illustrative gifts across four price bands.
2. Jordan adds Maya’s circle and a personal note.
3. Maya privately keeps or cuts gifts, enters sample delivery details, and approves in two clicks.
4. Guests see Jordan as the sender, the approved gift ideas and reasons, and a short giving flow.

The preview uses illustrative product artwork and prices. It does not send invitations, save delivery details, reserve gifts, or place orders. The focused `/new`, `/approve`, and `/guest` routes open at the corresponding sample screens.

## Local development

Use Node.js and pnpm:

```sh
pnpm install
pnpm dev
```

Useful checks:

```sh
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec eslint src
node pilot-legacy/verify.mjs
```

## Live workflows

The database-backed chapter flow starts at `/start`. The creator shares the private `/chapter/:token` link with the recipient; guests use their own `/guest/:token` links after approval. The `/merchant` page is an internal reconciliation tool and should not be linked publicly.

Before enabling live workflows:

1. Configure Supabase server credentials `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The browser app also needs `SUPABASE_PUBLISHABLE_KEY`; set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` when the deployment needs explicit Vite client configuration.
2. Apply `drizzle/migrations/0006_shopify_claim_lifecycle.sql` to the Supabase Postgres database after the earlier chapter migrations.
3. Configure Shopify `SHOPIFY_SHOP`, `SHOPIFY_API_VERSION`, `SHOPIFY_STOREFRONT_TOKEN`, and `SHOPIFY_WEBHOOK_SECRET`. Register an `orders/paid` webhook at `/api/webhooks/orders-paid`.
4. To send guest invitations, set `RESEND_API_KEY`, a verified `GC_EMAIL_FROM`, and the HTTPS site origin in `GC_PUBLIC_ORIGIN`.
5. To use `/merchant`, set `GC_MERCHANT_KEY` to a strong secret of at least 24 characters.
6. To enable the chapter recommender, configure `LOVABLE_API_KEY`.

The live Shopify checkout mapping currently uses the sample catalog in `src/lib/sample-products.ts` and `src/lib/shopify.ts`; the First Place investor preview’s brand examples are not live retailer listings. No live Supabase migration, Shopify checkout/webhook, or email delivery has been verified as part of local development.

`pilot-legacy/` preserves the original standalone Node/SQLite pilot for reference and verification.
