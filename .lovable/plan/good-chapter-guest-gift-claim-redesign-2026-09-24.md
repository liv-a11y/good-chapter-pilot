# Good Chapter guest gift-claim redesign

## What will change
- Make **Guest** open on a private Chapter introduction for Sam, with starter note, privacy cue, honoree approval, claim status, and clear non-commerce explanation.
- Add a mobile-first browse view with useful filters, 8 editorial gift ideas, gentle price guidance, and Available / Claimed / Gifted states.
- Replace checkout with a focused claim form collecting coordination details and fulfillment preference; claiming updates the item immediately.
- Add an equal-weight off-list path that creates an anonymous “Off-list gift” claim without asking for price.
- Add calm claim and gifted confirmations, with optional address/message actions and no purchase-completion pressure.
- Include explicit loading, empty, error, and claimed-state previews for presentation and concierge review.

## Visual direction
- Apply the Good Chapter palette: plaster, ink, cobalt actions, and clay emphasis.
- Use Young Serif, Satoshi, and DM Mono; 2px ink rules, hard corners, no gradients or shadows.
- Keep one clear cobalt action per screen and avoid retail logos, carts, totals, urgency, or campaign language.

## Scope
- Preserve the existing Friend and Maya prototype journeys.
- Keep this as presentation-ready local prototype behavior: no payments, ordering, retailer relationships, accounts, or saved personal data.

## Technical notes
- Extend the existing single-page React prototype state for landing, browse, claim, off-list, confirmation, and presentation states.
- Update shared typography and semantic color tokens, then verify the guest flow at mobile and desktop sizes.
