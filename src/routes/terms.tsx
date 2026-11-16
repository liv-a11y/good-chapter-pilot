import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/site/legal-page";

const description =
  "The terms for using goodchaptercollective.com and requesting an invitation to the Good Chapter pilot.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use. Good Chapter, Co." },
      { name: "description", content: description },
      { property: "og:title", content: "Terms of Use. Good Chapter, Co." },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage
      title="Terms of Use"
      intro={`These terms cover your use of goodchaptercollective.com, operated by Good Chapter, Co. ("Good Chapter," "we," "us"). By using the site, you agree to them.`}
      sections={[
        {
          heading: "The pilot",
          paragraphs: [
            "The site lets you request an invitation to our private pilot. Requesting one does not guarantee access, and we may change, pause, or end the pilot at any time. Nothing on the site is an offer to sell securities, a solicitation of investment, or a commitment to provide a product or service.",
          ],
        },
        {
          heading: "Who can use the site",
          paragraphs: [
            "You must be at least 18. You agree to give accurate information and to use the site lawfully.",
          ],
        },
        {
          heading: "What you submit",
          paragraphs: [
            "You keep ownership of anything you send us, such as comments. You give us permission to use it to run and improve the pilot, as described in our Privacy Policy. Do not submit information about other people or sensitive personal information, including health information.",
          ],
        },
        {
          heading: "Our content",
          paragraphs: [
            "The site, the Good Chapter name and branding, and our original text and design belong to us or our licensors. Historical images are public domain and credited on the page. You may share links to the site, but may not copy our content or use our name or marks without written permission.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "Do not interfere with the site, attempt unauthorized access, scrape it, or submit false or harmful content.",
          ],
        },
        {
          heading: "No warranties",
          paragraphs: [
            `The site is provided "as is" and "as available." We make no warranties of any kind, to the extent the law allows.`,
          ],
        },
        {
          heading: "Limit of liability",
          paragraphs: [
            "To the extent the law allows, Good Chapter is not liable for indirect, incidental, or consequential damages arising from your use of the site, and our total liability for any claim is limited to $100.",
          ],
        },
        {
          heading: "Changes and termination",
          paragraphs: [
            "We may update these terms or suspend access at any time. Continued use after an update means you accept it.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws of Indiana, without regard to conflict-of-law rules. Disputes will be handled in the courts located in Marion County, Indiana.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Good Chapter, Co., 358 Terrace Ave, Indianapolis, IN 46225. Email: info@goodchaptercollective.com.",
          ],
        },
      ]}
    />
  ),
});
