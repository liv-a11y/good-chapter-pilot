type Invitation = { title: string; starter: string; path: string; email: string };

function configuration() {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["GC_EMAIL_FROM"];
  const originValue = process.env["GC_PUBLIC_ORIGIN"];
  if (!apiKey || !from || !originValue) return null;

  const origin = new URL(originValue);
  if (
    origin.protocol !== "https:" ||
    origin.href !== `${origin.origin}/` ||
    origin.username ||
    origin.password ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)
  ) {
    throw new Error(
      "Email settings must use a verified sender and an HTTPS origin without a path.",
    );
  }
  return { apiKey, from, origin: origin.origin };
}

export function isGuestEmailConfigured(): boolean {
  return configuration() !== null;
}

export async function sendGuestInvitations(
  invitations: Invitation[],
): Promise<"sent" | "not_configured" | "rejected"> {
  const config = configuration();
  if (!config) return "not_configured";

  const messages = invitations.map(({ title, starter, path, email }) => ({
    from: config.from,
    to: [email],
    subject: "You’re invited to a Good Chapter",
    text: `${title}\n\nStarted by ${starter}.\n\nOpen your private invitation: ${new URL(path, config.origin).href}`,
  }));
  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status >= 400 && response.status < 500) return "rejected";
  if (!response.ok) throw new Error("Invitation delivery could not be confirmed.");

  const result = await response.json();
  if (
    result.data?.length !== messages.length ||
    result.data.some((item: { id?: string }) => !item?.id)
  ) {
    throw new Error("Invitation delivery could not be confirmed.");
  }
  return "sent";
}
