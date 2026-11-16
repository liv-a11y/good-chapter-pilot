import { createFileRoute } from "@tanstack/react-router";
import { FirstPlaceJourney } from "@/components/site/first-place-journey";
export const Route = createFileRoute("/approve")({
  head: () => ({
    meta: [
      { title: "Private Chapter Approval | Good Chapter" },
      { name: "description", content: "Privately review and approve a Good Chapter made for you." },
      { property: "og:title", content: "Private Chapter Approval | Good Chapter" },
      {
        property: "og:description",
        content: "Privately review and approve a Good Chapter made for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <FirstPlaceJourney initialStep={3} />,
});
