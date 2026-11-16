# Good Chapter Prompt 0: global shell and routing

## What will change
- Move the existing product demo from the home page into three direct routes: `/new` for the friend flow, `/approve` for Maya’s private review, and `/guest` for guest claiming.
- Replace the current prototype switcher with route-based entry points so each demo journey has a stable URL and none appears in the main navigation.
- Add the requested public route structure for `/`, `/partners`, `/partners/employers`, `/partners/real-estate`, `/partners/brands`, and `/investors`.
- Keep this phase focused on architecture: public routes will use concise holding content until their dedicated page prompts are implemented.

## Shared navigation and footer
- Add one shared public-site header with the Good Chapter mark, How it works, Chapters, Partners, Investors, and the cobalt “Start one for a friend” action.
- Make How it works and Chapters link to the matching home-page anchors.
- On mobile, keep the primary action visible and place the remaining links in an accessible menu.
- Add the shared footer with the supplied positioning line, links to every public page, and `liv@goodchapter.com`; remove the prototype disclaimer.
- Keep the product-demo routes visually focused and outside the public-site navigation shell.

## Global visual rules
- Normalize the shared design system to flat plaster, ink, cobalt, clay, and coral-only-in-the-logo usage.
- Enforce the supplied headline, body, and mono-label sizing; 2px borders; 4px corners; 1200px content width; responsive side padding; and section spacing.
- Remove gradients, shadows, photo overlays, undersized secondary copy, and excess tilted elements.
- Use 160–180ms linear transitions, with the requested card lift and subtle primary-button rotation.

## Validation
- Check every new URL directly, including refresh behavior and route-specific page metadata.
- Verify desktop and mobile header behavior, footer links, home anchors, and all three preserved demo entry flows.
- Confirm the final build and browser console are clean.
