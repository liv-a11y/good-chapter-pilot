import { createHmac, timingSafeEqual } from 'node:crypto';

const shop = process.env.SHOPIFY_SHOP;
export const demo = !shop;
export const claimProperty = 'good_chapter_claim';
const apiVersion = '2026-10';
const mutation = `mutation CreateGiftCart($input: CartInput!) {
  cartCreate(input: $input) {
    cart { checkoutUrl totalQuantity lines(first: 1) { nodes { quantity merchandise { ... on ProductVariant { id } } } } }
    userErrors { message }
  }
}`;

export function validateConfig() {
  if (demo) return;
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)
    || !process.env.SHOPIFY_STOREFRONT_TOKEN
    || !process.env.SHOPIFY_WEBHOOK_SECRET
    || (process.env.GC_ORGANIZER_KEY?.length ?? 0) < 24
    || (process.env.GC_MERCHANT_KEY?.length ?? 0) < 24
    || process.env.GC_MERCHANT_KEY === process.env.GC_ORGANIZER_KEY
    || !process.env.GC_VARIANTS) {
    throw new Error('Set a valid shop, Storefront token, webhook secret, distinct organizer and merchant keys, and variant list.');
  }
}

async function graphql(query, variables) {
  const response = await fetch(`https://${shop}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error('Shopify is temporarily unavailable.');
  const result = await response.json();
  if (result.errors?.length || !result.data) throw new Error('Shopify could not complete this request.');
  return result.data;
}

export async function catalog() {
  if (demo) return [
    { id: 'toaster', title: 'A proper toaster', price: '$49.00', amount: 49 },
    { id: 'toolbox', title: 'A first toolbox', price: '$65.00', amount: 65 },
    { id: 'lamp', title: 'A lamp for the corner', price: '$58.00', amount: 58 },
    { id: 'vacuum', title: 'A compact shop vacuum', price: '$89.00', amount: 89 },
    { id: 'mugs', title: 'Two everyday mugs', price: '$28.00', amount: 28 },
  ];
  const ids = [...new Set(process.env.GC_VARIANTS.split(',').map(id => id.trim()).filter(Boolean))];
  if (ids.length > 100 || ids.some(id => !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(id))) {
    throw new Error('Configure up to 100 Shopify product variant IDs.');
  }
  const data = await graphql(`query GiftCatalog($ids: [ID!]!) {
    nodes(ids: $ids) { ... on ProductVariant { id title availableForSale product { title productType tags } price { amount currencyCode } } }
  }`, { ids });
  return data.nodes.filter(variant => variant?.availableForSale).map(variant => ({
    id: variant.id,
    title: variant.title === 'Default Title' ? variant.product.title : `${variant.product.title} · ${variant.title}`,
    productType: variant.product.productType,
    tags: variant.product.tags,
    amount: Number(variant.price.amount),
    price: new Intl.NumberFormat('en-US', { style: 'currency', currency: variant.price.currencyCode }).format(variant.price.amount),
  }));
}

export async function checkout(variant, claim) {
  const data = await graphql(mutation, { input: { lines: [{
    merchandiseId: variant,
    quantity: 1,
    attributes: [{ key: claimProperty, value: claim }],
  }] } });
  const result = data.cartCreate;
  const line = result?.cart?.lines?.nodes?.[0];
  if (result?.userErrors?.length || !result?.cart?.checkoutUrl || result.cart.totalQuantity !== 1 || line?.quantity !== 1 || line?.merchandise?.id !== variant) {
    throw Object.assign(new Error('This gift is currently unavailable for checkout.'), { code: 'GIFT_UNAVAILABLE' });
  }
  return result.cart.checkoutUrl;
}

export function authenticWebhook(headers, body) {
  if (demo || headers['x-shopify-shop-domain'] !== shop) return false;
  const signature = Buffer.from(headers['x-shopify-hmac-sha256'] ?? '', 'base64');
  const expected = createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET).update(body).digest();
  return signature.length === expected.length && timingSafeEqual(signature, expected);
}
