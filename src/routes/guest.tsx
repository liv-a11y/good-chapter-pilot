import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";
export const Route = createFileRoute("/guest")({
  head: () => ({
    meta: [
      { title: "A chapter for Maya | Good Chapter" },
      {
        name: "description",
        content: "Choose one thoughtful gift for Maya’s first home in a private, five-minute flow.",
      },
      { property: "og:title", content: "A chapter for Maya | Good Chapter" },
      {
        property: "og:description",
        content: "Choose one thoughtful gift for Maya’s first home in a private, five-minute flow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FirstPlaceJourney initialStep={4} />,
});
