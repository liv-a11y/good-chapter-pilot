import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors | Good Chapter" },
      {
        name: "description",
        content: "Good Chapter is building a new category around meaningful, friend-led support.",
      },
      { property: "og:title", content: "Investors | Good Chapter" },
      {
        property: "og:description",
        content: "Good Chapter is building a new category around meaningful, friend-led support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Investors"
      title="Backing the chapters life forgot"
      copy="Good Chapter is building a new category around meaningful, friend-led support."
    />
  ),
});
