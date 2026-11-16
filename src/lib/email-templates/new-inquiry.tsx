/* eslint-disable react-refresh/only-export-components */
import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  email?: string;
  inquiry?: string;
  comments?: string;
  contactName?: string;
  organization?: string;
  roleTitle?: string;
  teamSize?: string;
}

const NewInquiry = ({
  email,
  inquiry,
  comments,
  contactName,
  organization,
  roleTitle,
  teamSize,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New invitation request from {email ?? "someone"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>NEW INVITATION REQUEST</Text>
        <Heading style={h1}>Someone wants in.</Heading>
        <Section style={box}>
          <Text style={label}>EMAIL</Text>
          <Text style={value}>{email ?? "Not given"}</Text>
          <Text style={label}>HERE AS</Text>
          <Text style={value}>{inquiry ?? "Not chosen"}</Text>
          {contactName ? (
            <>
              <Text style={label}>NAME</Text>
              <Text style={value}>{contactName}</Text>
            </>
          ) : null}
          {organization ? (
            <>
              <Text style={label}>ORGANIZATION</Text>
              <Text style={value}>{organization}</Text>
            </>
          ) : null}
          {roleTitle ? (
            <>
              <Text style={label}>ROLE</Text>
              <Text style={value}>{roleTitle}</Text>
            </>
          ) : null}
          {teamSize ? (
            <>
              <Text style={label}>TEAM SIZE</Text>
              <Text style={value}>{teamSize}</Text>
            </>
          ) : null}
          <Text style={label}>COMMENTS</Text>
          <Text style={value}>{comments || "No comments."}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: NewInquiry,
  subject: (d: Props) => {
    const inquiry = typeof d.inquiry === "string" && d.inquiry ? d.inquiry : "General inquiry";
    const organization =
      typeof d.organization === "string" && d.organization ? d.organization : undefined;
    return `New request: ${inquiry}${organization ? `, ${organization}` : ""}`;
  },
  displayName: "New invitation request (to Liv)",
  to: "liv@goodchaptercollective.com",
  previewData: {
    email: "friend@example.com",
    inquiry: "Investor",
    comments: "Loved the toaster line.",
  },
} satisfies TemplateEntry<Props>;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", color: "#0E2A21" };
const container = { padding: "24px 28px", maxWidth: "560px" };
const eyebrow = {
  fontFamily: "monospace",
  fontSize: "12px",
  letterSpacing: "0.14em",
  color: "#C2402F",
};
const h1 = {
  fontFamily: "Georgia, serif",
  fontWeight: 400,
  fontSize: "28px",
  margin: "8px 0 20px",
};
const box = {
  border: "2px solid #0E2A21",
  borderRadius: "4px",
  padding: "16px 20px",
  backgroundColor: "#F4E8DC",
};
const label = {
  fontFamily: "monospace",
  fontSize: "11px",
  letterSpacing: "0.14em",
  margin: "12px 0 2px",
  color: "#284CD6",
};
const value = { fontSize: "16px", margin: "0", whiteSpace: "pre-wrap" as const };
