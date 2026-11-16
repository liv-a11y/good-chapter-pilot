import { db, atomic } from './store.mjs';
import { esc, field, area } from './view.mjs';

export function releaseClaim(id, reason) {
  return atomic(() => {
    const claim = db.prepare('SELECT id, gift, order_id FROM claims WHERE id = ?').get(id);
    if (!claim) return false;
    db.prepare('INSERT INTO released_claims (id, gift, order_id, reason) VALUES (?, ?, ?, ?)')
      .run(claim.id, claim.gift, claim.order_id, reason);
    db.prepare('DELETE FROM claims WHERE id = ?').run(id);
    return true;
  });
}

export function merchantView(result = '') {
  const claims = db.prepare(`SELECT claims.id, claims.state, claims.order_id, gifts.title, chapters.title AS chapter
    FROM claims JOIN gifts ON gifts.id = claims.gift JOIN chapters ON chapters.id = gifts.chapter
    ORDER BY chapters.title, gifts.title LIMIT 200`).all();
  const conflicts = db.prepare('SELECT order_id, claim_id, quantity FROM payment_conflicts ORDER BY rowid DESC LIMIT 50').all();
  return `<h1>Gift claims</h1>
    ${result ? '<p role="status">' + esc(result) + '</p>' : ''}
    <p>Before reopening a gift, verify in Shopify that the checkout cannot still be paid or that the paid order was resolved.</p>
    ${claims.length ? `<ul>${claims.map(claim => `<li>${esc(claim.chapter)} · ${esc(claim.title)} · ${esc(claim.state)}
      · Claim <code>${esc(claim.id)}</code>${claim.order_id ? ' · Order ' + esc(claim.order_id) : ''}</li>`).join('')}</ul>` : '<p>No active claims.</p>'}
    <form method="post">
      ${field('Merchant access key', 'key', '', 'type="password" required autocomplete="off"')}
      ${field('Claim ID', 'claim', '', 'required maxlength="32"')}
      ${area('Reconciliation note', 'reason', '', 'required maxlength="500"')}
      <label><input type="checkbox" name="confirmed" value="yes" required> I verified the checkout or order in Shopify.</label>
      <button name="action" value="release">Reopen gift</button>
    </form>
    <h2>Payment exceptions</h2>
    ${conflicts.length ? `<ul>${conflicts.map(conflict => `<li>Order ${esc(conflict.order_id)} · Claim ${esc(conflict.claim_id)}
      · Quantity ${esc(conflict.quantity)}</li>`).join('')}</ul>` : '<p>No payment exceptions recorded.</p>'}`;
}
