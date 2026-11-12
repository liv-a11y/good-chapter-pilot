import { demo } from './shopify.mjs';

export function validateMail() {
  if (demo) return;
  const origin = new URL(process.env.GC_PUBLIC_ORIGIN ?? 'http://localhost');
  if (origin.protocol !== 'https:' || origin.href !== origin.origin + '/'
    || origin.username || origin.password || !process.env.RESEND_API_KEY || !process.env.GC_EMAIL_FROM) {
    throw new Error('Configure an HTTPS GC_PUBLIC_ORIGIN, RESEND_API_KEY and GC_EMAIL_FROM.');
  }
}

export async function sendReview(email, path) {
  const reviewUrl = new URL(path, process.env.GC_PUBLIC_ORIGIN).href;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.GC_EMAIL_FROM,
      to: [email],
      subject: 'Someone started a Good Chapter for you',
      text: 'Review your chapter privately. You decide whether to approve it and what to share. Keep this link private.\n\n' + reviewUrl,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Email delivery failed.');
}

export async function sendGuestInvites(chapter, invites) {
  const messages = invites.map(({ email, path }) => ({
    from: process.env.GC_EMAIL_FROM,
    to: [email],
    subject: 'You’re invited to a Good Chapter',
    text: [
      chapter.title,
      'Started by ' + chapter.organizer,
      chapter.message,
      'Open your private invitation: ' + new URL(path, process.env.GC_PUBLIC_ORIGIN).href,
    ].join('\n\n'),
  }));
  const response = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
    signal: AbortSignal.timeout(10000),
  });
  if (response.status >= 400 && response.status < 500) return false;
  if (!response.ok) throw new Error('Invitation delivery could not be confirmed.');
  const result = await response.json();
  if (result.data?.length !== messages.length || result.data.some(item => !item?.id)) {
    throw new Error('Invitation delivery could not be confirmed.');
  }
  return true;
}
