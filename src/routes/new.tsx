import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";
export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "Start a First Place Chapter | Good Chapter" },
      {
        name: "description",
        content: "Start and tailor a private First Place chapter for a friend.",
      },
      { property: "og:title", content: "Start a First Place Chapter | Good Chapter" },
      {
        property: "og:description",
        content: "Start and tailor a private First Place chapter for a friend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FirstPlaceJourney initialStep={1} />,
});
