import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/site-shell";
import { HistoryArticleBody } from "@/components/site/history-article";

const TITLE = "You shouldn't need a wedding to get a toaster";
const DESC =
  "In 1924 a department store invented the registry for brides. A century later, everyone else is still buying their own toaster.";
const OG = "https://chapter-gift-studio.lovable.app/og-history.jpg";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { property: "og:image", content: OG },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <SiteShell>
      <HistoryArticleBody eager />
    </SiteShell>
  );
}
