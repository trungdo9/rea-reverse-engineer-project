(async () => { 
const __out = [];
const log = (...a) => __out.push(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content || '';
async function api(method, path, body) {
  const r = await fetch(path.startsWith('http') ? path : '/api/boomerang/' + path.replace(/^\//, ''), { method, credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-Token': csrf() },
    body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch {}
  return { status: r.status, body: j };
}
const errs = r => (r.body?.errors || []).map(e => ({ code: e.code, detail: e.detail, src: e.source?.pointer, meta: e.meta?.blocking ? { blocking: e.meta.blocking.map(b => ({ reason: b.reason, stock: b.stock_count, reserved: b.reserved, needed: b.needed, shortage: b.shortage, orders: (b.orders||[]).length, downtimes: (b.downtimes||[]).length })), warning: e.meta.warning } : undefined }));
const short = r => r.status >= 400 ? { status: r.status, errors: errs(r) } : { status: r.status };

 try { const LOC = 'c985bb45-196b-4c30-90fe-b753980cbb14';
const CUST = '1c0e12de-aaa7-4beb-870f-110469a4c938';
const T = s => s.length === 16 ? s + ':00.000Z' : s;            // '2026-11-20T09:00' -> ISO UTC
async function newOrder(starts, stops, cust = CUST) {
  const r = await api('POST', 'orders', { data: { type: 'orders', attributes: { customer_id: cust, starts_at: T(starts), stops_at: T(stops) } } });
  if (r.status >= 300) { log('newOrder FAIL', short(r)); return null; }
  return r.body.data.id;
}
async function book(orderId, productId, quantity = 1) {
  return api('POST', 'order_fulfillments', { include: 'changed_plannings', data: { type: 'order_fulfillments', attributes: { order_id: orderId, actions: [{ action: 'book_product', mode: 'create_new', product_id: productId, quantity }] } } });
}
async function fulfil(orderId, actions) {
  return api('POST', 'order_fulfillments', { data: { type: 'order_fulfillments', attributes: { order_id: orderId, actions } } });
}
async function trans(orderId, from, to, extra = {}) {
  return api('POST', 'order_status_transitions', { data: { type: 'order_status_transitions', attributes: { order_id: orderId, transition_from: from, transition_to: to, revert: false, ...extra } } });
}
async function getOrder(id) {
  const r = await api('GET', `orders/${id}`);
  const a = r.body?.data?.attributes || {};
  return { number: a.number, status: a.status, statuses: a.statuses, counts: a.status_counts, starts: a.starts_at, stops: a.stops_at, shortage: a.shortage, pay: a.payment_status, total: a.grand_total_in_cents / 100, due: a.to_be_paid_in_cents / 100 };
}
async function setPeriod(id, starts, stops) {
  const attributes = {}; if (starts) attributes.starts_at = T(starts); if (stops) attributes.stops_at = T(stops);
  return api('PATCH', `orders/${id}`, { data: { type: 'orders', id, attributes } });
}
async function plannings(orderId) {
  const r = await api('GET', `plannings?filter[order_id]=${orderId}&page[size]=50`);
  return (r.body?.data || []).map(p => ({ id: p.id, product: p.attributes.product_id || p.attributes.item_id, q: p.attributes.quantity, reserved: p.attributes.reserved, started: p.attributes.started, stopped: p.attributes.stopped, from: p.attributes.reserved_from || p.attributes.starts_at, till: p.attributes.reserved_till || p.attributes.stops_at }));
}
async function avail(itemId, from, till) {
  const r = await api('POST', 'availabilities', { filter: { item_id: [itemId], from: T(from), till: T(till), location_id: LOC } });
  const a = r.body?.data?.[0]?.attributes; return a ? { available: a.available, plannable: a.plannable } : short(r);
}
async function mkProduct(name, priceVnd, stock, extra = {}) {
  const pg = await api('POST', 'product_groups', { data: { type: 'product_groups', attributes: { name, product_type: 'rental', tracking_type: 'bulk', price_type: 'simple', flat_fee_price_in_cents: priceVnd * 100, price_period: 'day', taxable: true, ...extra } } });
  if (pg.status >= 300) { log('mkProduct FAIL', short(pg)); return null; }
  const pgId = pg.body.data.id;
  const prods = await api('GET', `products?filter[product_group_id]=${pgId}`);
  const pid = prods.body.data[0].id;
  if (stock) { const s = await api('POST', 'stock_adjustments', { data: { type: 'stock_adjustments', attributes: { product_id: pid, location_id: LOC, quantity: stock } } }); if (s.status >= 300) log('stock FAIL', short(s)); }
  return { pgId, pid };
}
// One-line scenario result helper
async function step(label, p) { const r = await p; log(label.padEnd(58), JSON.stringify(r && r.status ? short(r) : r)); return r; }
const p = await mkProduct('[TEST] Loa A (1 cái)', 100000, 1);
log('product', p);
const prod = await api('GET', `products/${p.pid}`);
log('product attrs', Object.entries(prod.body.data.attributes).filter(([k]) => /buffer|shortage|stock|track|lag|lead|type|sku|price|deposit|avail|plann/.test(k)));
log('avail 20-22/11', await avail(p.pgId, '2026-11-20T09:00', '2026-11-22T15:00'));

 } catch (e) { log('EXCEPTION', String(e && e.stack || e)); } return __out.join('
'); })()