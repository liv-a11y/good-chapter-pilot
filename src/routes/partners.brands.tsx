import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/site/placeholder-page";

export const Route = createFileRoute("/partners/brands")({
  head: () => ({
    meta: [
      { title: "Brands & collaborations. Good Chapter" },
      {
        name: "description",
        content: "Collaborate with Good Chapter on useful, human-centered gifting moments.",
      },
      { property: "og:title", content: "Brands & collaborations. Good Chapter" },
      {
        property: "og:description",
        content: "Collaborate with Good Chapter on useful, human-centered gifting moments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <PlaceholderPage
      eyebrow="Brands & collaborations"
      title="Thoughtful products for real-life chapters"
      copy="Collaborate with Good Chapter on useful, human-centered gifting moments."
    />
  ),
});
