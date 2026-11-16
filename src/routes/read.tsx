import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { Unlearning } from "@/components/site/unlearning";

const TITLE = "Read. The rules we are unlearning. Good Chapter";
const DESC =
  "Essays on the cultural rules that keep people from being celebrated, and how a friend can start it instead.";

export const Route = createFileRoute("/read")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteShell>
      <Unlearning headingLevel="h1" />
    </SiteShell>
  ),
});
