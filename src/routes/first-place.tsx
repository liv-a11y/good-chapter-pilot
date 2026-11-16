import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";

const title = "First Place. A sample chapter from Good Chapter, Co.";
const description =
  "Walk through Maya’s First Place chapter: a friend curates eight gifts, Maya reviews privately, and her circle gives.";

export const Route = createFileRoute("/first-place")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FirstPlaceJourney />,
});
