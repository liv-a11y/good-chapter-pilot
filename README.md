# Good Chapter for Shopify

A single-store pilot for a friend-started, recipient-approved registry. The person who starts a chapter suggests up to eight gifts and a guest list. The recipient privately edits the title and note, approves gifts and guests, or declines. In Shopify mode, the review link goes directly to the recipient’s email. After approval, the recipient can email individual invitations in one batch or copy links to share manually. Each invitation credits the organizer. They can revoke an individual link and remove an unclaimed gift. A guest reserves one gift at a time and checks out through Shopify. The recipient can see whether each gift is available, reserved, or purchased.

## Suggest gifts from private notes

In **Start a chapter**, open **Get gift ideas**. Enter interests or practical needs, items to skip, a guest budget, and an optional organizer budget. Use the store currency. Good Chapter matches the notes against the titles, product types and tags of purchasable variants. It moves matching gifts to the top, explains the suggestions, and leaves every choice to the organizer and recipient. Notes and budgets stay in the organizer’s draft form. They are not persisted, emailed, or included in recipient or guest views. The pilot uses local matching rules and does not call an AI service or retain a recipient profile.

## Run the demo

Requires Node.js 24. There are no npm dependencies.

```sh
node server.mjs
```

Open http://127.0.0.1:3000. Start a chapter, open the review link, approve selected gifts and guests, then open a guest invitation. Choose a gift and select **Simulate payment**. Refresh the recipient page to see the purchase. The app creates a local SQLite database.

## Connect one Shopify development store

1. Host this service at an HTTPS URL with a persistent disk. Set `HOST=0.0.0.0` if the host requires it and set `GC_DB` to a database path on the persistent disk. Run a single instance for the pilot. Use a fresh database for the store.
2. Create a Storefront API public access token with product listing and cart permissions. Make the selected variants available to that storefront. Supply their GraphQL variant IDs, separated by commas.
3. Create an **Order payment** webhook (topic `orders/paid`) using Shopify Admin's webhook settings or an app-owned subscription with order access. Send JSON to `https://YOUR-APP/webhooks/orders-paid`. Use the signing secret for the method you chose. Use Shopify API version 2026-10.
4. Start the service with the following environment variables.

| Variable | Value |
| --- | --- |
| `SHOPIFY_SHOP` | Your store's canonical `example.myshopify.com` domain |
| `SHOPIFY_STOREFRONT_TOKEN` | Public Storefront API access token |
| `SHOPIFY_WEBHOOK_SECRET` | Signing secret for the webhook you configured |
| `GC_VARIANTS` | Comma-separated variant GIDs such as `gid://shopify/ProductVariant/123` |
| `GC_ORGANIZER_KEY` | A random, private key of at least 24 characters for trusted organizers |
| `GC_MERCHANT_KEY` | A different random key of at least 24 characters for merchant staff |
| `GC_PUBLIC_ORIGIN` | Public HTTPS origin with no path, such as `https://chapters.example.com` |
| `RESEND_API_KEY` | Server-side Resend sending key |
| `GC_EMAIL_FROM` | An address on a verified Resend sending domain |
| `GC_DB` | Persistent SQLite path |
| `PORT`, `HOST` | Hosting provider's port and bind address |

5. In the development store, start a chapter using an inbox you can test. Verify the organizer never sees the review URL and the recipient can use the emailed link. Disable email click tracking for review links and redact private URL paths from server access logs. Earlier live drafts created with organizer-visible links must be recreated for recipient-only review.
6. Use [Shopify test payments](https://help.shopify.com/en/manual/checkout-settings/test-orders) on the development store. Claim one gift and confirm a second invite cannot claim it. Pay, then verify Shopify sends the signed webhook and the correct gift becomes Purchased. Check checkout shipping and pickup. Verify a replay leaves the same state.
7. Visit `/merchant` with the merchant key. Inspect claims and payment exceptions. For an abandoned, cancelled, or refunded purchase, verify the Shopify checkout or order before reopening the gift. Enter the claim ID and a reconciliation note. Confirm the gift is available again and a later payment on the old claim is flagged for investigation.

## Pilot choices and limits

- On Share your chapter, the recipient can enter addresses for approved guests who do not already have a link and use Send invitations. Each guest gets an individual email and revocable link. Good Chapter does not store guest email addresses in its database. Manual sharing remains available. Batch sending to multiple inboxes requires a verified Resend sending domain and a matching GC_EMAIL_FROM. The Resend test sender is limited to the account email. The live review link goes only to the email address the organizer provides. It verifies access to that inbox through possession of a private link, so the recipient should keep it private. Demo mode exposes a sample link for testing. Guests receive individual bearer links.
- The purchaser can ship to themselves or use store pickup when available. The recipient's address stays out of the app. Merchant-controlled recipient delivery is a later integration decision.
- A unique database claim prevents separate guest links from opening checkout for the same gift. A guest can resume their checkout. Once issued, a live checkout can outlast the chapter or guest link, so reservations are held for manual reconciliation. Investigate an abandoned or interrupted checkout in Shopify before changing any claim. Repeated payments and changed quantities are recorded in the `payment_conflicts` table for merchant follow-up. Refunds and cancellations are reconciled in the merchant view. Reopening a gift does not cancel an existing Shopify checkout or refund an order. Merchant staff handle those actions in Shopify.
- This is a standalone service connected to one store through Storefront API and a signed webhook. A merchant can link to it from their storefront. It does not include Shopify Admin embedding, OAuth installation, a theme extension, or App Store distribution.
- A live Shopify development-store test is still required. The included demo uses simulated payments. The test in this package exercises live-mode app logic using mocked Resend and Shopify responses.

## Verify locally

Run `node verify.mjs` from the project folder. The test uses an in-memory database and mocked HTTP responses. It sends no email and places no orders.

## Shopify references

- [Create a cart and get a checkout URL](https://shopify.dev/docs/api/storefront/2026-10/mutations/cartCreate)
- [Storefront API access scopes](https://shopify.dev/docs/api/usage/access-scopes)
- [Events and webhooks](https://shopify.dev/docs/apps/build/events-webhooks)
- [App distribution](https://shopify.dev/docs/apps/launch/distribution)

## Deployment decisions and release checklist

- [ ] Create a US Basic **Dev** store in Shopify's [Dev Dashboard](https://dev.shopify.com/dashboard). Use test data and an inbox controlled by the tester. Keep the eventual production store separate and confirm its identity with Good Chapter.
- [ ] In the dev store, install the [Headless sales channel](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started), create a storefront, and publish 10–15 active First Place variants to Headless. Use the storefront's public token for this code. Include product listing, product tag, and cart access. Imported supplier products follow the same rules. Confirm each variant is available to purchase through the storefront and deliverable in the test market.
- [ ] After approval to host, use one paid Render Node web service in a workspace without HTTP request URL logging. Use a private source repository, Node 24, start command `node server.mjs`, `HOST=0.0.0.0`, Render's `PORT`, and a persistent disk at `/var/data` with `GC_DB=/var/data/good-chapter.sqlite`. Use Render HTTPS and put secrets directly in the service's Environment settings. Keep analytics, session replay, request URL/body logging, and email link tracking off. Confirm with a synthetic link that the token does not appear in accessible logs. If URL logging cannot be controlled, move bearer secrets out of the URL request before enabling invitations.
- [ ] Confirm Render daily disk snapshots. Take a consistent SQLite backup before releases and regularly during testing, using Node's `node:sqlite` online backup API or SQLite's `.backup` command. Keep a separately encrypted copy with restricted access, and restore it to a scratch database to confirm readability. Copying the main database file alone while WAL mode is active is insufficient.
- [ ] Verify a Resend sending domain. Enter its API key and sender address in Render Environment. Turn click tracking off on that domain. In Shopify Admin, go to Settings → Notifications → Webhooks, create a JSON **Order payment** webhook for `/webhooks/orders-paid` on the HTTPS host, and enter the webhook signing secret in Render Environment. Keep the production settings and database separate from development.
- [ ] Run `node verify.mjs`, then run the same scenarios in the hosted dev store with Shopify test payments. Test approval and decline, forwarding and revocation, notes and budget privacy, out-of-stock products, competing claims, paid order attribution, webhook replay, abandoned claims, and late payment after reopening. Test whether Shopify allows adding an item or changing quantity. If it does, ship a Shopify-side checkout validation before treating one gift per checkout as enforced.
- [ ] Home delivery supersedes the purchaser-handoff instructions above for the intended launch. The current build has no address collection or routing. Validate a merchant-managed fulfillment flow in the dev store first: recipient privately supplies and approves their address, purchaser pays in Shopify, and the merchant uses the address privately after payment. Use a merchant-controlled checkout destination or delivery method only after verifying pricing, order handling, and that the real address stays out of buyer checkout, confirmation, order-status pages, and tracking. Use synthetic addresses until that verification passes. Keep individual guest links revocable whether emailed in a batch or shared manually.
- [ ] For production, identify the Good Chapter Shopify store explicitly, publish the approved catalog there, repeat the checkout and fulfillment verification on the intended plan, configure separate live secrets and webhook, and start with an empty live database. Obtain approval before connecting the live store, enabling real invitations, or making real charges.
