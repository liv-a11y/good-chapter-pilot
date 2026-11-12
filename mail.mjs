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
