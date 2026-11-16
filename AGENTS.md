<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public marketing routes use `SiteShell`; `/new`, `/approve`, and `/guest` render the focused shared demo component without the marketing shell, keeping product demos isolated while avoiding duplicated flow code.
- Public product displays share `sample-products` so uploaded photos remain paired with literal object names instead of unrelated branded catalog entries.
- Keep the waitlist UI in the shared `WaitlistForm` component so public story routes can place the same privacy-safe signup without duplicating submission logic.
- The homepage uses the pilot variant of `SiteShell` and `WaitlistForm`, while `/story` preserves the full narrative; the intake variant stores its predefined inquiry category in the existing optional waitlist context field to reuse the privacy-safe signup path.
- Keep Lovable AI provider setup and run correlation in server-only modules, while client code imports only `*.functions.ts` wrappers, to protect credentials and preserve server boundaries.
- The gift idea generator uses Anthropic Claude (`anthropic/claude-haiku-4-5`) via the gateway's native `/v1/messages` endpoint with `@ai-sdk/anthropic`, per user request; keep the exact `anthropic/` model id and stream with `streamText`.

- Shopify Storefront checkout lives in `src/lib/shopify.ts`; sample gifts map to Shopify variants there, and guests buy one gift at a time via cartCreate so checkout stays on Shopify, not Good Chapter.
- The `/start` flow collects only structured choices (no honoree identity or free text) and issues private person and guest links instead of storing emails, to honor the privacy rules while reusing the existing chapter tables.
