import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createHmac } from 'node:crypto';
Object.assign(process.env, {
  GC_DB: ':memory:', GC_ORGANIZER_KEY: 'organizer-key-1234567890-secret',
  GC_MERCHANT_KEY: 'merchant-key-1234567890-secret', SHOPIFY_SHOP: 'demo.myshopify.com',
  SHOPIFY_WEBHOOK_SECRET: 'webhook-mock-secret', SHOPIFY_STOREFRONT_TOKEN: 'mock',
  GC_VARIANTS: 'gid://shopify/ProductVariant/123,gid://shopify/ProductVariant/456,gid://shopify/ProductVariant/789',
  GC_PUBLIC_ORIGIN: 'https://gc.example', GC_EMAIL_FROM: 'good@gc.example', RESEND_API_KEY: 'mock',
});
const { handleRequest } = await import('./server.mjs');
let emailLink, claim, soldOut = false, shopDown = false;
let guestEmails = [], rejectGuestEmails = false;
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  if (url === 'https://api.resend.com/emails/batch') {
    guestEmails.push(body);
    if (rejectGuestEmails) return Response.json({ name: 'validation_error' }, { status: 403 });
    return Response.json({ data: body.map((_, index) => ({ id: 'email-' + index })) });
  }
  if (url.includes('resend.com')) {
    assert.deepEqual(body.to, ['maya@example.com']);
    emailLink = new URL(body.text.match(/https:[^\s]+/)[0]).pathname;
    return Response.json({ id: 'mock' });
  }
  if (shopDown) return new Response('', { status: 503 });
  if (body.query.includes('GiftCatalog')) return Response.json({ data: { nodes: body.variables.ids.map((id, index) => ({
    id, title: 'Default Title', availableForSale: !(soldOut && index === 0),
    product: { title: ['Toaster','Toolbox','Mugs'][index] }, price: { amount: '24.99', currencyCode: 'USD' },
  })) } });
  const line = body.variables.input.lines[0];
  claim = line.attributes[0].value;
  return Response.json({ data: { cartCreate: soldOut ? { userErrors: [{ message: 'unavailable' }] } : {
    userErrors: [], cart: { totalQuantity: 1, checkoutUrl: 'https://demo.myshopify.com/checkouts/mock', lines: { nodes: [{ quantity: 1, merchandise: { id: line.merchandiseId } }] } },
  } } });
};
async function req(url, fields, webhook, overrides = {}) {
  const data = new URLSearchParams();
  for (const [key, value] of Object.entries(fields ?? {})) for (const item of [value].flat()) data.append(key, item);
  const body = Buffer.from(webhook ? JSON.stringify(webhook) : data.toString());
  const headers = webhook ? {
    'x-shopify-shop-domain': process.env.SHOPIFY_SHOP, 'x-shopify-topic': 'orders/paid',
    'x-shopify-hmac-sha256': createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET).update(body).digest('base64'),
  } : { 'content-type': 'application/x-www-form-urlencoded' };
  const request = Object.assign(Readable.from([body]), { url, method: fields || webhook ? 'POST' : 'GET', headers: { ...headers, ...overrides } });
  const result = { headers: {}, setHeader(k,v){this.headers[k]=v;}, writeHead(status, headers){this.status=status;Object.assign(this.headers,headers);return this;}, end(body){this.body=body;} };
  await handleRequest(request, result);
  return result;
}
const ids = (body, name) => [...body.matchAll(new RegExp('name="' + name + '" value="([A-Za-z0-9_-]{32})"', 'g'))].map(m => m[1]);
const draftFields = { key:process.env.GC_ORGANIZER_KEY, organizer:'Sarah',recipient:'Maya',email:'maya@example.com',title:'First Place',message:'Hi',guests:'Avery\nJamie',gift:process.env.GC_VARIANTS.split(',') };
const notes = 'Already has a toaster. Keeps borrowing my tools. Private marker.';
const ideas = await req('/start', { ...draftFields, action:'suggest', notes, avoid:'mugs', budget:'30' });
assert.equal(ideas.status, 200);
assert.match(ideas.body, /Toolbox · \$24\.99[\s\S]*?Matches your note about tools and home projects/);
assert.equal([...ideas.body.matchAll(/Matches your note|Fits the budget/g)].length, 1);
assert.equal(emailLink, undefined);
assert.equal((await req('/start', draftFields, null, { origin:'null', 'sec-fetch-site':'cross-site' })).status,403);
assert.equal((await req('/start', draftFields, null, { origin:'null' })).status,403);
const declinedDraft = await req('/start', draftFields, null, { origin:'null', 'sec-fetch-site':'same-origin' });
assert.equal(declinedDraft.status,201);
const declineLink = emailLink;
assert.equal((await req(declineLink,{action:'decline'})).status,303);
assert.match((await req(declineLink)).body,/chapter is closed/);
assert(!(await req(declineLink,{action:'invite',guest:'fake'})).body.includes('/invite/'));
const draft = await req('/start', { ...draftFields, notes });
assert.equal(draft.status, 201);
assert(emailLink && !draft.body.includes(emailLink));
const review = (await req(emailLink)).body;
assert(!review.includes('Private marker'));
const [gift, removed, spare] = ids(review,'gift');
const guests = ids(review,'guest');
assert.equal((await req(emailLink,{action:'approve',title:'First Place',message:'Approved',gift:[gift,removed,spare],guest:guests})).status,303);
const invite = async guest => (await req(emailLink,{action:'invite',guest})).body.match(/href="(\/invite\/[^"]+)"/)[1];
const first = await invite(guests[0]), second = await invite(guests[1]);
assert.equal((await req(emailLink,{action:'remove',gift:removed})).status,303);
assert(!((await req(first)).body.includes('Toolbox')));
assert.match((await req(first)).body,/\$24\.99/);
soldOut = true;
assert.match((await req(first)).body,/Currently unavailable/);
assert.equal((await req(first,{action:'checkout',gift})).headers['X-Good-Chapter-Error'],'GIFT_UNAVAILABLE');
soldOut = false; shopDown = true;
assert.equal((await req(first,{action:'checkout',gift})).headers['X-Good-Chapter-Error'],'CHECKOUT_UNAVAILABLE');
shopDown = false;
assert.equal((await req(first,{action:'checkout',gift})).status,303);
assert.equal((await req(second,{action:'checkout',gift})).status,409);
assert.equal((await req(emailLink,{action:'remove',gift})).status,409);
assert.equal((await req(emailLink,{action:'revoke',guest:guests[1]})).status,303);
assert.equal((await req(second)).status,404);
const release = {key:process.env.GC_MERCHANT_KEY,action:'release',claim,reason:'Verified checkout',confirmed:'yes'};
assert.equal((await req('/merchant',{...release,key:process.env.GC_ORGANIZER_KEY})).status,403);
assert.equal((await req('/merchant',release)).status,200);
const lateClaim=claim;
const order = (id, claim) => ({id,line_items:[{variant_id:123,quantity:1,properties:[{name:'good_chapter_claim',value:claim}]}]});
assert.equal((await req('/webhooks/orders-paid',null,order(55,lateClaim))).status,204);
assert.match((await req('/merchant',{key:process.env.GC_MERCHANT_KEY,action:'view'})).body,/Order 55/);
assert.equal((await req(first,{action:'checkout',gift})).status,303);
assert.notEqual(claim,lateClaim);
const invalid = order(57,claim);
invalid.line_items.push({variant_id:456,quantity:1});
assert.equal((await req('/webhooks/orders-paid',null,invalid,{'x-shopify-hmac-sha256':'invalid'})).status,401);
assert.equal((await req('/webhooks/orders-paid',null,invalid)).status,204);
assert.doesNotMatch((await req(first)).body,/<p>Purchased<\/p>/);
assert.match((await req('/merchant',{key:process.env.GC_MERCHANT_KEY,action:'view'})).body,/Order 57/);
for(let i=0;i<2;i++) assert.equal((await req('/webhooks/orders-paid',null,order(56,claim))).status,204);
assert.match((await req(first)).body,/Purchased/);
console.log('Passed mocked live-mode recommendations, email, consent, guest controls, inventory, checkout, release, late payment, and webhook replay.');

await req('/start', { ...draftFields, guests:'Avery\nJamie\nTaylor', notes });
const batchReview = (await req(emailLink)).body;
const [batchGift] = ids(batchReview, 'gift');
const [avery, jamie, taylor] = ids(batchReview, 'guest');
const fields = { action:'email-guests', ['email_' + avery]:'avery@example.com', ['email_' + jamie]:'jamie@example.com', ['email_' + taylor]:'taylor@example.com' };
await req(emailLink, fields);
assert.equal(guestEmails.length, 0);
assert.equal((await req(emailLink,{action:'approve',title:'First Place',message:'Approved note',gift:batchGift,guest:[avery,jamie]})).status,303);
assert.match((await req(emailLink)).body, /Email invitations/);
await req(emailLink, { ...fields, ['email_' + jamie]:'AVERY@example.com' });
assert.equal(guestEmails.length, 0);
rejectGuestEmails = true;
assert.match((await req(emailLink, fields)).body, /provider rejected/);
const rejectedLink = new URL(guestEmails[0][0].text.split(' ').at(-1)).pathname;
assert.equal((await req(rejectedLink)).status, 404);
rejectGuestEmails = false;
assert.match((await req(emailLink, fields)).body, /2 invitations submitted/);
const accepted = guestEmails[1];
assert.deepEqual(accepted.map(message => message.to), [['avery@example.com'], ['jamie@example.com']]);
const invitePaths = accepted.map(message => new URL(message.text.split(' ').at(-1)).pathname);
assert.notEqual(invitePaths[0], invitePaths[1]);
for (const [index, message] of accepted.entries()) {
  assert.match(message.text, /Started by Sarah/);
  assert.match(message.text, /Approved note/);
  assert.doesNotMatch(message.text, /Private marker|@example.com/);
  assert.equal((await req(invitePaths[index])).status, 200);
}
await req(emailLink, fields);
assert.equal(guestEmails.length, 2);
await req(emailLink, { action:'revoke', guest:avery });
assert.equal((await req(invitePaths[0])).status, 404);
assert.equal((await req(invitePaths[1])).status, 200);
console.log('Passed batch invite approval, recipient isolation, retry, repeat submission and revocation tests.');
