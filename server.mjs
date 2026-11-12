import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { db, atomic, token, digest } from './store.mjs';
import { demo, validateConfig, catalog, checkout, authenticWebhook, claimProperty } from './shopify.mjs';
import { suggestGifts } from './recommend.mjs';
import { merchantView, releaseClaim } from './merchant.mjs';
import { sendGuestInvites, sendReview, validateMail } from './mail.mjs';
import { layout, chapterHero, field, area, checks, esc } from './view.mjs';

validateConfig();
validateMail();
const query = sql => db.prepare(sql);
const brandLogo = await readFile(new URL('./brand-logo.png', import.meta.url));
const idPattern = '[A-Za-z0-9_-]{32}';

function fail(status, message, code) {
  throw Object.assign(new Error(message), { status, code });
}

function authorizedKey(value, key = process.env.GC_ORGANIZER_KEY) {
  return Boolean(key) && timingSafeEqual(Buffer.from(digest(value ?? '')), Buffer.from(digest(key)));
}

const organizerSessionSeconds = 8 * 60 * 60;
const organizerCookie = '__Secure-gc-organizer';

function organizerSignature(expires) {
  return createHmac('sha256', process.env.GC_ORGANIZER_KEY)
    .update('good-chapter-organizer-session:' + expires).digest('hex');
}

function organizerSession(request) {
  if (demo) return false;
  const cookie = request.headers.cookie?.split(/;\s*/).find(value => value.startsWith(organizerCookie + '='));
  const match = cookie?.slice(organizerCookie.length + 1).match(/^(\d{10})\.([a-f0-9]{64})$/);
  return Boolean(match && Number(match[1]) > Date.now() / 1000
    && timingSafeEqual(Buffer.from(match[2]), Buffer.from(organizerSignature(match[1]))));
}

function organizerLinkPage(response) {
  const nonce = randomBytes(18).toString('base64');
  response.setHeader('Content-Security-Policy', response.getHeader('Content-Security-Policy')
    + "; script-src 'nonce-" + nonce + "'");
  return page(response, 'Private organizer access', `<h1>Private organizer access</h1>
    <p>Use your organizer key to make a private link for yourself or a trusted organizer. Anyone with the link can start a chapter.</p>
    <form method="post" action="/organizer">
      ${field('Organizer access key', 'key', '', 'type="password" required autocomplete="off"')}
      <button type="button" id="make-link">Make private link</button>
      <button>Open chapter form</button>
    </form>
    <p id="link-result" hidden><label>Private organizer link <input id="private-link" readonly></label></p>
    <script nonce="${nonce}">
      const form = document.querySelector('form[action="/organizer"]');
      const key = form.elements.namedItem('key');
      const link = new URL(form.action);
      const fragment = location.hash.slice(1);
      if (fragment) {
        history.replaceState(null, '', link.pathname);
        key.value = new URLSearchParams(fragment).get('key') || '';
        if (key.value) form.requestSubmit();
      }
      document.getElementById('make-link').addEventListener('click', () => {
        if (!form.reportValidity()) return;
        link.hash = new URLSearchParams({ key: key.value }).toString();
        const output = document.getElementById('private-link');
        output.value = link.href;
        document.getElementById('link-result').hidden = false;
        output.select();
        key.value = '';
      });
    </script>`);
}

function required(form, key, limit) {
  const value = (form.get(key) ?? '').trim();
  if (!value || value.length > limit) fail(400, 'Check the required fields and try again.');
  return value;
}

async function readBody(request, limit) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > limit) fail(413, 'Request is too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function page(response, title, content, status = 200) {
  response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(layout(title, content, demo));
}

function redirect(response, location) {
  response.writeHead(303, { Location: location });
  response.end();
}

function setGuestToken(chapter, guest) {
  const guestToken = token();
  query('UPDATE guests SET token_hash = ? WHERE chapter = ? AND id = ? AND approved = 1')
    .run(digest(guestToken), chapter, guest);
  return guestToken;
}

async function emailGuests(chapter, form) {
  const approved = query('SELECT id FROM guests WHERE chapter = ? AND approved = 1').all(chapter.id);
  const entered = approved.map(guest => ({ id: guest.id, email: (form.get('email_' + guest.id) ?? '').trim() }))
    .filter(guest => guest.email);
  if (!entered.length) return 'Enter at least one guest email address.';
  if (entered.some(({ email }) => email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return 'Check the guest email addresses and try again.';
  }
  if (new Set(entered.map(({ email }) => email.toLowerCase())).size !== entered.length) {
    return 'Use a different email address for each guest.';
  }
  const invites = atomic(() => {
    if (query('SELECT status FROM chapters WHERE id = ?').get(chapter.id).status !== 'approved') return [];
    const reserve = query('UPDATE guests SET token_hash = ? WHERE chapter = ? AND id = ? AND approved = 1 AND token_hash IS NULL');
    return entered.flatMap(guest => {
      const guestToken = token();
      const hash = digest(guestToken);
      return reserve.run(hash, chapter.id, guest.id).changes
        ? [{ ...guest, hash, path: '/invite/' + guestToken }] : [];
    });
  });
  if (!invites.length) return 'Those guests already have links or the chapter was closed.';
  let accepted;
  try {
    accepted = await sendGuestInvites(chapter, invites);
  } catch {
    return 'We couldn’t confirm the email send. Check with your guests before replacing or revoking their links.';
  }
  if (!accepted) {
    atomic(() => {
      const release = query('UPDATE guests SET token_hash = NULL WHERE chapter = ? AND id = ? AND token_hash = ?');
      for (const invite of invites) release.run(chapter.id, invite.id, invite.hash);
    });
    return 'The email provider rejected the send. Check the addresses and sending settings, then try again.';
  }
  const count = invites.length;
  return count === 1 ? '1 invitation submitted for delivery.' : `${count} invitations submitted for delivery.`;
}

function paidWebhook(order) {
  if (!/^\d+$/.test(String(order.id))) fail(400, 'Invalid order.');
  const orderId = order.admin_graphql_api_id ?? String(order.id);
  atomic(() => {
    const quantities = new Map();
    for (const line of order.line_items ?? []) {
      const claimId = line.properties?.find(property => property.name === claimProperty)?.value;
      if (!claimId) continue;
      const claim = query(`SELECT claims.*, gifts.variant FROM claims JOIN gifts ON gifts.id = claims.gift
        WHERE claims.id = ?`).get(String(claimId));
      if (!claim) {
        const released = query(`SELECT released_claims.order_id, gifts.variant FROM released_claims
          JOIN gifts ON gifts.id = released_claims.gift WHERE released_claims.id = ?`).get(String(claimId));
        if (released && released.order_id !== orderId && released.variant === `gid://shopify/ProductVariant/${line.variant_id}`) {
          query('INSERT OR IGNORE INTO payment_conflicts VALUES (?, ?, ?)').run(orderId, String(claimId), Number(line.quantity));
        }
        continue;
      }
      if (claim.variant !== `gid://shopify/ProductVariant/${line.variant_id}`) continue;
      quantities.set(claim.id, (quantities.get(claim.id) ?? 0) + Number(line.quantity));
    }
    for (const [claimId, quantity] of quantities) {
      const claim = query('SELECT order_id FROM claims WHERE id = ?').get(claimId);
      if (quantity !== 1 || order.line_items.length !== 1 || (claim.order_id && claim.order_id !== orderId)) {
        query('INSERT OR IGNORE INTO payment_conflicts VALUES (?, ?, ?)').run(orderId, claimId, quantity);
      }
      if (!claim.order_id && quantity === 1 && order.line_items.length === 1
        && Number(order.line_items[0].quantity) === 1) {
        query("UPDATE claims SET state = 'paid', order_id = ?, checkout_url = NULL WHERE id = ?").run(orderId, claimId);
      }
    }
  });
}

function budget(form, name) {
  const value = (form.get(name) ?? '').trim();
  if (!value) return null;
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
    fail(400, 'Enter a positive budget in the store’s currency.');
  }
  return Number(value);
}

function startPage(response, gifts, form = new URLSearchParams(), suggested = null, signedIn = false) {
  const value = name => form.get(name) ?? '';
  const selected = new Set(form.getAll('gift'));
  const suggestions = new Map((suggested ?? []).map(gift => [gift.id, gift.reason]));
  const sorted = [...(suggested ?? []), ...gifts.filter(gift => !suggestions.has(gift.id))];
  const choices = sorted.map(gift => `<label><input type="checkbox" name="gift" value="${esc(gift.id)}"
    ${selected.has(gift.id) ? 'checked' : ''}> ${esc(gift.title)} · ${esc(gift.price)}
    ${suggestions.has(gift.id) ? '<br><small>' + esc(suggestions.get(gift.id)) + '</small>' : ''}</label>`).join('');
  return page(response, 'Start a chapter', `${chapterHero('', 'we believe you shouldn’t have to get married to get a fking toaster.', 'Let your people show up for you, whatever chapter you’re in.')}
    <h2>Start a chapter</h2>
    <form method="post">
    ${demo || signedIn ? '' : field('Organizer access key', 'key', '', 'type="password" required autocomplete="off"')}
    ${field('Your name', 'organizer', value('organizer'), 'required maxlength="80"')}
    ${field('Who’s this for?', 'recipient', value('recipient'), 'required maxlength="80"')}
    ${demo ? '' : field('Recipient email', 'email', value('email'), 'type="email" required maxlength="254" autocomplete="off"')}
    ${field('Chapter title', 'title', value('title'), 'required maxlength="100" placeholder="Maya’s first place"')}
    ${area('A note from you', 'message', value('message'), 'required maxlength="1600"')}
    <details ${suggested !== null ? 'open' : ''}><summary>Get gift ideas</summary>
      <p>Keep addresses and private details out of the invitation note.</p>
      <p>These shopping notes are only used to suggest gifts. They stay out of the chapter and invitations.</p>
      ${area('What would they use or love?', 'notes', value('notes'), 'maxlength="1200" placeholder="Loves cooking, already has a toaster, keeps borrowing my tools."')}
      ${field('What should we skip?', 'avoid', value('avoid'), 'maxlength="300"')}
      ${field('Guest budget per gift (store currency)', 'budget', value('budget'), 'type="number" min="0.01" step="0.01"')}
      ${field('Organizer gift budget (optional)', 'anchor', value('anchor'), 'type="number" min="0.01" step="0.01"')}
      <button class="quiet" name="action" value="suggest" formnovalidate>Find gift ideas</button>
    </details>
    ${suggested?.length === 0 ? '<p role="status">No gift ideas matched. Try a different detail or budget, or pick from the catalog.</p>' : ''}
    <fieldset><legend>Choose up to eight gifts</legend>${choices}</fieldset>
    ${area('Who might want to help? One name per line.', 'guests', value('guests'), 'required maxlength="2000"')}
    <button>${demo ? 'Make private review link' : 'Send private review'}</button></form>`);
}

async function route(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const path = url.pathname;
  const post = request.method === 'POST';

  if (post && path === '/webhooks/orders-paid') {
    const body = await readBody(request, 2_000_000);
    if (!authenticWebhook(request.headers, body) || request.headers['x-shopify-topic'] !== 'orders/paid') {
      fail(401, 'Invalid webhook.');
    }
    paidWebhook(JSON.parse(body));
    response.writeHead(204).end();
    return;
  }
  if (!post && request.method !== 'GET') fail(405, 'Method unavailable.');
  const origin = request.headers.origin;
  const fetchSite = request.headers['sec-fetch-site'];
  if (post && (fetchSite === 'cross-site'
    || (!demo && origin && origin !== new URL(process.env.GC_PUBLIC_ORIGIN).origin
      && !(origin === 'null' && fetchSite === 'same-origin'))
    || !request.headers['content-type']?.startsWith('application/x-www-form-urlencoded'))) {
    fail(403, 'Open the Good Chapter page and try again.');
  }
  const form = post ? new URLSearchParams((await readBody(request, 16_384)).toString()) : null;

  if (path === '/brand-logo.png' && !post) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(brandLogo);
    return;
  }

  if (path === '/' && !post) {
    return page(response, 'Good Chapter', `<h1>we believe you shouldn’t have to get married to get a fking toaster.</h1>
      <p>Let your people show up for you, whatever chapter you’re in.</p>
      <a class="button" href="/start">Start a chapter</a>`);
  }

  if (path === '/merchant') {
    if (!post) return page(response, 'Merchant access', `<h1>Merchant access</h1><form method="post">
      ${field('Merchant access key', 'key', '', 'type="password" required autocomplete="off"')}
      <button name="action" value="view">View gift claims</button></form>`);
    if (!authorizedKey(form.get('key'), process.env.GC_MERCHANT_KEY ?? '')) fail(403, 'The merchant key is incorrect.');
    if (form.get('action') === 'view') return page(response, 'Gift claims', merchantView());
    if (form.get('action') !== 'release' || form.get('confirmed') !== 'yes') fail(400, 'Confirm the Shopify reconciliation first.');
    const claimId = required(form, 'claim', 32);
    const reason = required(form, 'reason', 500);
    if (!releaseClaim(claimId, reason)) fail(404, 'That active claim could not be found.');
    return page(response, 'Gift claims', merchantView('Gift reopened. The prior claim is retained in the reconciliation history.'));
  }

  if (path === '/organizer' && !demo) {
    if (!post) return organizerLinkPage(response);
    if (!authorizedKey(form.get('key'))) fail(403, 'The organizer key is incorrect.');
    const expires = Math.floor(Date.now() / 1000) + organizerSessionSeconds;
    response.setHeader('Set-Cookie', `${organizerCookie}=${expires}.${organizerSignature(expires)}; Path=/start; Max-Age=${organizerSessionSeconds}; HttpOnly; Secure; SameSite=Strict`);
    return redirect(response, '/start');
  }

  if (path === '/start') {
    const signedIn = organizerSession(request);
    if (!post) return startPage(response, await catalog(), undefined, null, signedIn);
    if (!demo && !signedIn && !authorizedKey(form.get('key'))) {
      fail(403, 'The organizer key is incorrect.');
    }
    if (form.get('action') === 'suggest') {
      const notes = (form.get('notes') ?? '').trim();
      const avoid = (form.get('avoid') ?? '').trim();
      if (notes.length > 1200 || avoid.length > 300) fail(400, 'Shorten the private shopping notes and try again.');
      const guestBudget = budget(form, 'budget');
      const anchorBudget = budget(form, 'anchor');
      const gifts = await catalog();
      return startPage(response, gifts, form, suggestGifts(gifts, { notes, avoid, guestBudget, anchorBudget }), signedIn);
    }
    const organizer = required(form, 'organizer', 80);
    const recipient = required(form, 'recipient', 80);
    const email = demo ? null : required(form, 'email', 254);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Enter a valid recipient email.');
    const title = required(form, 'title', 100);
    const message = required(form, 'message', 1600);
    const guestNames = required(form, 'guests', 2000).split(/\r?\n/).map(name => name.trim()).filter(Boolean);
    if (guestNames.length > 24 || guestNames.some(name => name.length > 80)) fail(400, 'Enter up to 24 guest names, up to 80 characters each.');
    const selected = new Set(form.getAll('gift'));
    if (!selected.size || selected.size > 8) fail(400, 'Choose between one and eight gifts.');
    const gifts = (await catalog()).filter(gift => selected.has(gift.id));
    if (gifts.length !== selected.size) fail(409, 'A selected gift is unavailable. Go back and refresh the catalog.');
    const chapterId = token();
    const reviewToken = token();
    atomic(() => {
      query('INSERT INTO chapters (id, review_hash, organizer, recipient, title, message) VALUES (?, ?, ?, ?, ?, ?)')
        .run(chapterId, digest(reviewToken), organizer, recipient, title, message);
      if (email) query('INSERT INTO recipient_delivery (chapter) VALUES (?)').run(chapterId);
      for (const name of guestNames) query('INSERT INTO guests (id, chapter, name) VALUES (?, ?, ?)').run(token(), chapterId, name);
      for (const gift of gifts) query('INSERT INTO gifts (id, chapter, variant, title) VALUES (?, ?, ?, ?)').run(token(), chapterId, gift.id, gift.title);
    });
    if (email) {
      try {
        await sendReview(email, '/review/' + reviewToken);
      } catch {
        fail(502, 'We could not confirm email delivery. Check the address and try again.');
      }
      query('UPDATE recipient_delivery SET email_delivered = 1 WHERE chapter = ?').run(chapterId);
      return page(response, 'Private review sent', `<h1>Sent privately to ${esc(recipient)}.</h1>
        <p>They’ll get their own review link and decide whether to share the chapter.</p>`, 201);
    }
    return page(response, 'Private review link', `<h1>Ready for ${esc(recipient)}.</h1>
      <p>Send this private link directly to ${esc(recipient)}. Anyone with this link can review and manage the chapter.</p>
      <label for="review">Private review link</label><input id="review" readonly value="/review/${reviewToken}">
      <p>Copy the full URL from the address bar after opening the link.</p><a class="button" href="/review/${reviewToken}">Open private review link</a>`, 201);
  }

  const review = path.match(new RegExp(`^/review/(${idPattern})$`));
  if (review) {
    const chapter = query('SELECT * FROM chapters WHERE review_hash = ?').get(digest(review[1]));
    if (!chapter || (!demo && !query('SELECT email_delivered FROM recipient_delivery WHERE chapter = ?').get(chapter.id)?.email_delivered)) {
      fail(404, 'This review link is unavailable.');
    }
    if (post && chapter.status === 'draft') {
      atomic(() => {
        if (query('SELECT status FROM chapters WHERE id = ?').get(chapter.id).status !== 'draft') fail(409, 'This chapter was already reviewed.');
        if (form.get('action') === 'decline') {
          query("UPDATE chapters SET status = 'declined' WHERE id = ?").run(chapter.id);
          return;
        }
        if (form.get('action') !== 'approve') fail(400, 'Choose whether to approve or decline.');
        const message = required(form, 'message', 1600);
        const title = required(form, 'title', 100);
        const gifts = query('SELECT id FROM gifts WHERE chapter = ?').all(chapter.id).filter(gift => form.getAll('gift').includes(gift.id));
        const guests = query('SELECT id FROM guests WHERE chapter = ?').all(chapter.id).filter(guest => form.getAll('guest').includes(guest.id));
        if (!gifts.length || !guests.length) fail(400, 'Approve at least one gift and one guest.');
        for (const gift of gifts) query('UPDATE gifts SET approved = 1 WHERE id = ?').run(gift.id);
        for (const guest of guests) query('UPDATE guests SET approved = 1 WHERE id = ?').run(guest.id);
        query("UPDATE chapters SET status = 'approved', title = ?, message = ? WHERE id = ?").run(title, message, chapter.id);
      });
      return redirect(response, path);
    }
    if (chapter.status === 'draft') {
      return page(response, 'Private review', `${chapterHero('Private review', 'make it yours.', `${chapter.organizer} started this for you, ${chapter.recipient}. Choose who’s invited, what’s on the list, and what they’ll read.`)}
        <form method="post" class="panel">
        ${field('Chapter title', 'title', chapter.title, 'required maxlength="100"')}
        <p>Guests will see the invitation note. Keep addresses and private details out of it.</p>
        ${area('Invitation note', 'message', chapter.message, 'required maxlength="1600"')}
        <fieldset><legend>Gifts you’d welcome</legend>${checks(query('SELECT id, title FROM gifts WHERE chapter = ?').all(chapter.id), 'gift', 'id')}</fieldset>
        <fieldset><legend>People you’d like to invite</legend>${checks(query('SELECT id, name FROM guests WHERE chapter = ?').all(chapter.id), 'guest', 'id')}</fieldset>
        <button name="action" value="approve">Approve chapter</button>
        <button class="quiet" name="action" value="decline" formnovalidate>Decline privately</button>
        </form>`);
    }
    if (chapter.status !== 'approved') return page(response, 'Chapter closed', '<h1>This chapter is closed.</h1>');
    let invitation = '';
    let emailStatus = '';
    if (post) {
      if (form.get('action') === 'close') {
        query("UPDATE chapters SET status = 'closed' WHERE id = ?").run(chapter.id);
        return redirect(response, path);
      }
      if (form.get('action') === 'revoke') {
        query('UPDATE guests SET token_hash = NULL WHERE chapter = ? AND id = ? AND approved = 1')
          .run(chapter.id, form.get('guest'));
        return redirect(response, path);
      }
      if (form.get('action') === 'remove') {
        const result = query(`UPDATE gifts SET approved = 0 WHERE chapter = ? AND id = ? AND approved = 1
          AND NOT EXISTS (SELECT 1 FROM claims WHERE claims.gift = gifts.id)`).run(chapter.id, form.get('gift'));
        if (!result.changes) fail(409, 'This gift can’t be removed because it is reserved, purchased, or already removed.');
        return redirect(response, path);
      }
      if (form.get('action') === 'email-guests' && !demo) {
        emailStatus = await emailGuests(chapter, form);
      } else if (form.get('action') === 'invite') {
        const guest = query('SELECT id, name FROM guests WHERE chapter = ? AND id = ? AND approved = 1').get(chapter.id, form.get('guest'));
        if (!guest) fail(404, 'This guest was not approved.');
        const link = '/invite/' + setGuestToken(chapter.id, guest.id);
        invitation = `<section class="gift"><h2>Invitation for ${esc(guest.name)}</h2>
          <p class="message">An invitation from ${esc(chapter.organizer)}\n\n${esc(chapter.message)}</p>
          <p>Open the invitation and copy the full URL to forward it.</p><a class="button" href="${link}">Open invitation</a></section>`;
      } else {
        fail(400, 'Choose an invitation action.');
      }
    }
    const guests = query('SELECT id, name, token_hash FROM guests WHERE chapter = ? AND approved = 1').all(chapter.id);
    const emailGuestsAvailable = guests.filter(guest => !guest.token_hash);
    const gifts = query(`SELECT gifts.id, gifts.title, claims.state FROM gifts LEFT JOIN claims ON claims.gift = gifts.id
      WHERE gifts.chapter = ? AND gifts.approved = 1`).all(chapter.id);
    return page(response, 'Share your chapter', `${chapterHero('Approved chapter', 'share your chapter.', `Email an invitation or share an individual link with each approved guest. The invitation credits ${chapter.organizer} for starting your chapter.`)}
      ${emailStatus ? '<p role="status">' + esc(emailStatus) + '</p>' : ''}
      ${!demo && emailGuestsAvailable.length ? `<form method="post">
        <fieldset><legend>Email invitations</legend>
          <p>Enter an email for each approved guest you’d like to invite now. Each person gets their own link.</p>
          ${emailGuestsAvailable.map(guest => field(guest.name + '’s email', 'email_' + guest.id, '', 'type="email" maxlength="254"')).join('')}
          <button name="action" value="email-guests">Send invitations</button>
        </fieldset></form>` : ''}
      ${invitation}
      <h2>Share links manually</h2>
      ${guests.map(guest => `<form method="post"><input type="hidden" name="guest" value="${guest.id}">
        <button name="action" value="invite">${guest.token_hash ? 'Replace link for' : 'Make link for'} ${esc(guest.name)}</button>
        ${guest.token_hash ? '<button class="quiet" name="action" value="revoke">Revoke access</button>' : ''}</form>`).join('')}
      <h2>Gift status</h2><ul>${gifts.map(gift => `<li>${esc(gift.title)} · ${gift.state === 'paid' ? 'Purchased' : gift.state ? 'Reserved' : 'Available'}
        ${gift.state ? '' : `<form method="post"><input type="hidden" name="gift" value="${gift.id}">
          <button class="quiet" name="action" value="remove">Remove gift</button></form>`}</li>`).join('')}</ul>
      <details><summary>Close this chapter</summary><p>Closing disables guest links. Checkouts guests already opened may still be completed.</p>
      <form method="post"><button class="quiet" name="action" value="close">Close chapter</button></form></details>`);
  }

  const invite = path.match(new RegExp(`^/invite/(${idPattern})$`));
  if (invite) {
    const guest = query(`SELECT guests.id AS guest_id, chapters.* FROM guests JOIN chapters ON chapters.id = guests.chapter
      WHERE guests.token_hash = ? AND guests.approved = 1 AND chapters.status = 'approved'`).get(digest(invite[1]));
    if (!guest) fail(404, 'This invitation is unavailable. Ask the person who shared it for a current link.', 'INVITE_UNAVAILABLE');
    if (post) {
      const gift = query('SELECT id, variant FROM gifts WHERE id = ? AND chapter = ? AND approved = 1').get(form.get('gift'), guest.id);
      if (!gift) fail(404, 'This gift is unavailable.');
      const action = form.get('action');
      if (demo && action === 'pay') {
        query("UPDATE claims SET state = 'paid' WHERE gift = ? AND guest = ? AND state = 'checkout'").run(gift.id, guest.guest_id);
        return redirect(response, path);
      }
      if (action !== 'checkout') fail(400, 'Choose a gift to continue.');
      const claim = atomic(() => {
        const authorized = query(`SELECT 1 FROM guests JOIN chapters ON chapters.id = guests.chapter
          WHERE guests.id = ? AND guests.token_hash = ? AND chapters.status = 'approved'
          AND EXISTS (SELECT 1 FROM gifts WHERE id = ? AND approved = 1)`)
          .get(guest.guest_id, digest(invite[1]), gift.id);
        if (!authorized) fail(404, 'This invitation is unavailable. Ask the person who shared it for a current link.', 'INVITE_UNAVAILABLE');
        const existing = query('SELECT * FROM claims WHERE gift = ?').get(gift.id);
        if (existing) {
          if (existing.guest !== guest.guest_id || existing.state !== 'checkout') fail(409, 'Someone has reserved or purchased this gift. Go back and choose another.', 'GIFT_ALREADY_CLAIMED');
          return existing;
        }
        const claimId = token();
        query("INSERT INTO claims (id, gift, guest, state) VALUES (?, ?, ?, 'creating')").run(claimId, gift.id, guest.guest_id);
        return { id: claimId };
      });
      if (claim.checkout_url) return redirect(response, claim.checkout_url);
      try {
        if (!demo && !(await catalog()).some(item => item.id === gift.variant)) {
          fail(409, 'This gift is unavailable. Go back and choose another.', 'GIFT_UNAVAILABLE');
        }
        const checkoutUrl = demo ? path : await checkout(gift.variant, claim.id);
        const stillAuthorized = query(`SELECT 1 FROM guests JOIN chapters ON chapters.id = guests.chapter
          WHERE guests.id = ? AND guests.token_hash = ? AND chapters.status = 'approved'`)
          .get(guest.guest_id, digest(invite[1]));
        if (!stillAuthorized) fail(404, 'This invitation is unavailable. Ask the person who shared it for a current link.', 'INVITE_UNAVAILABLE');
        const result = query("UPDATE claims SET state = 'checkout', checkout_url = ? WHERE id = ? AND state = 'creating'").run(checkoutUrl, claim.id);
        if (!result.changes) fail(409, 'This claim changed. Go back and refresh the gift list.', 'CLAIM_CHANGED');
        return redirect(response, checkoutUrl);
      } catch (error) {
        query("DELETE FROM claims WHERE id = ? AND state = 'creating'").run(claim.id);
        if (error.status) throw error;
        if (error.code === 'GIFT_UNAVAILABLE') fail(409, 'This gift is unavailable. Go back and choose another.', 'GIFT_UNAVAILABLE');
        fail(502, 'Shopify checkout is temporarily unavailable. Go back and try again shortly.', 'CHECKOUT_UNAVAILABLE');
      }
    }
    const gifts = query(`SELECT gifts.id, gifts.title, gifts.variant, claims.state, claims.guest FROM gifts
      LEFT JOIN claims ON claims.gift = gifts.id WHERE gifts.chapter = ? AND gifts.approved = 1`).all(guest.id);
    let currentCatalog;
    try {
      currentCatalog = new Map((await catalog()).map(gift => [gift.id, gift]));
    } catch {
      currentCatalog = null;
    }
    return page(response, guest.title, `${chapterHero('You’re invited', guest.title, `Started by ${guest.organizer}`)}
      <p class="message">${esc(guest.message)}</p>
      <p class="muted">${demo ? 'Choose a gift to try the checkout flow.' : 'Ship to yourself or use store pickup if offered, then give the gift directly.'}</p>
      <div class="gift-grid">${gifts.map(gift => {
        const ownCheckout = gift.state === 'checkout' && gift.guest === guest.guest_id;
        const label = ownCheckout ? (demo ? 'Simulate payment' : 'Resume checkout') : 'Choose this gift';
        const action = ownCheckout && demo ? 'pay' : 'checkout';
        const current = currentCatalog?.get(gift.variant);
        const availability = currentCatalog ? 'Currently unavailable' : 'Availability will be checked at checkout';
        return `<section class="gift"><h2>${esc(gift.title)}</h2>
          ${current && !gift.state ? '<p>' + esc(current.price) + '</p>' : ''}
          ${!currentCatalog && !gift.state ? '<p>' + availability + '</p>' : ''}
          ${gift.state === 'paid' ? '<p>Purchased</p>' : !gift.state && currentCatalog && !current ? '<p>' + availability + '</p>'
            : !gift.state || ownCheckout
            ? `<form method="post"><input type="hidden" name="gift" value="${gift.id}"><button name="action" value="${action}">${label}</button></form>`
            : '<p>Reserved</p>'}</section>`;
      }).join('')}</div>`);
  }
  fail(404, 'This page is unavailable.');
}

export async function handleRequest(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; form-action 'self' https:; base-uri 'none'; frame-ancestors 'none'");
  try {
    await route(request, response);
  } catch (error) {
    if (error.code) response.setHeader('X-Good-Chapter-Error', error.code);
    if (error.status === undefined) console.error('Request failed:', error.name);
    page(response, 'Good Chapter', `<h1>${esc(error.status ? error.message : 'Something went wrong.')}</h1>`, error.status ?? 500);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  createServer(handleRequest).listen(port, process.env.HOST ?? '127.0.0.1', () => {
    console.log(`Good Chapter running in ${demo ? 'demo' : 'Shopify'} mode on port ${port}.`);
  });
}
