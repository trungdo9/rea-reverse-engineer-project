const A = { pid: '82b39723-dffd-4b2c-bb23-bcdea81880f0' }, D = { pid: '5f89ec69-bd46-4313-908c-1d9462938d32' };
const ORDER1 = '8907f10b-b60e-4f00-b2f2-bfc11842df14';
log('--- S9 BIẾN THỂ (size/màu) — mô phỏng áo cưới');
let r = await api('POST', 'product_groups', { data: { type: 'product_groups', attributes: { name: '[TEST] Váy cưới đuôi cá', product_type: 'rental', tracking_type: 'trackable', price_type: 'simple', flat_fee_price_in_cents: 150000000, price_period: 'day', taxable: true, has_variations: true, variation_fields: ['Size', 'Màu'] } } });
log('create pg with variations', JSON.stringify(short(r)), r.body?.data?.attributes?.variation_fields);
let vpg = r.body?.data?.id, variants = [];
if (vpg) {
  const first = (await api('GET', `products?filter[product_group_id]=${vpg}`)).body.data;
  log('auto products', first.map(p => ({ id: p.id, name: p.attributes.name, vv: p.attributes.variation_values })));
  if (first[0]) { const u = await api('PATCH', `products/${first[0].id}`, { data: { type: 'products', id: first[0].id, attributes: { variation_values: ['S', 'Trắng'] } } }); log('set variant 1 values', JSON.stringify(short(u))); variants.push(first[0].id); }
  for (const vv of [['M', 'Trắng'], ['M', 'Kem']]) {
    const c = await api('POST', 'products', { data: { type: 'products', attributes: { product_group_id: vpg, variation_values: vv } } });
    log('create variant', vv.join('/'), JSON.stringify(short(c))); if (c.status < 300) variants.push(c.body.data.id);
  }
  for (const v of variants) await api('POST', 'stock_adjustments', { data: { type: 'stock_adjustments', attributes: { product_id: v, location_id: LOC, quantity: 1 } } });
  log('variants', (await api('GET', `products?filter[product_group_id]=${vpg}`)).body.data.map(p => `${p.attributes.name} [${p.attributes.variation_values}] stock=${p.attributes.stock_count}`));
}
log('--- S10 BUNDLE (combo)');
r = await api('POST', 'bundles', { data: { type: 'bundles', attributes: { name: '[TEST] Combo sự kiện: Loa D + Loa A', discount_percentage: 10, product_type: 'rental' } } });
log('create bundle', JSON.stringify(short(r)));
const bid = r.body?.data?.id;
if (bid) {
  for (const [pid, q] of [[D.pid, 2], [A.pid, 1]]) { const bi = await api('POST', 'bundle_items', { data: { type: 'bundle_items', attributes: { bundle_id: bid, product_id: pid, quantity: q, discount_percentage: 10 } } }); log('bundle item', q, JSON.stringify(short(bi))); }
  const o = await newOrder('2027-03-01T09:00', '2027-03-02T09:00');
  const bk = await api('POST', 'order_fulfillments', { data: { type: 'order_fulfillments', attributes: { order_id: o, actions: [{ action: 'book_bundle', bundle_id: bid, quantity: 1, bundle_configuration: [] }] } } });
  log('book_bundle', JSON.stringify(short(bk)));
  log('bundle order lines', (await api('GET', `lines?filter[order_id]=${o}`)).body.data.map(l => `${l.attributes.title} q=${l.attributes.quantity} ${l.attributes.price_in_cents / 100} ${l.attributes.line_type || ''}`));
  await step('bundle order reserve', trans(o, 'new', 'reserved'));
  log('bundle order', await getOrder(o));
}
log('--- S11 ĐÓNG ĐƠN (archive)');
log('order #1', await getOrder(ORDER1));
await step('#1 stopped -> archived', trans(ORDER1, 'stopped', 'archived'));
log('order #1 after', await getOrder(ORDER1));
log('--- S12 EMAIL');
const tpl = (await api('GET', 'email_templates?page[size]=50')).body?.data || [];
log('email templates', tpl.map(t => `${t.attributes.name}|${t.attributes.identifier}|auto=${t.attributes.automated}`));
const conf = tpl.find(t => /order_confirmation|Order confirmation/i.test(t.attributes.identifier + t.attributes.name));
if (conf) { const e = await api('POST', 'emails', { data: { type: 'emails', attributes: { email_template_id: conf.id, order_id: ORDER1, recipients: 'test-khach-a@example.com', subject: '[TEST] Xác nhận đơn', body: 'Test email từ phân tích nghiệp vụ.' } } }); log('send email', JSON.stringify(short(e)), e.body?.data && JSON.stringify(e.body.data.attributes).slice(0, 300)); }
log('IDS', { vpg, variants, bid });
