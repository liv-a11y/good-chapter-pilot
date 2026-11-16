import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";

export const Route = createFileRoute("/sample")({
  head: () => ({
    meta: [
      { title: "A sample chapter. Good Chapter" },
      {
        name: "description",
        content:
          "Walk through Maya’s First Place chapter: a friend curates eight gifts, Maya reviews privately, and her circle gives.",
      },
      { property: "og:title", content: "A sample chapter. Good Chapter" },
      {
        property: "og:description",
        content:
          "Walk through a sample Good Chapter: a friend starts it, the person approves it, and the circle claims gifts privately.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FirstPlaceJourney />,
});
