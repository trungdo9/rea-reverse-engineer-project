const A = { pid: '82b39723-dffd-4b2c-bb23-bcdea81880f0' }, D = { pid: '5f89ec69-bd46-4313-908c-1d9462938d32' };
const V = { S_trang: '3e0b56d4-fff0-465f-8b7f-2a878bd42980', M_trang: 'c62a8101-0e99-4acc-8a7b-03326bf51ba9', M_kem: '666ca56b-1bdc-4ffa-bf87-7d74c2c09eb1' };
log('--- S9b trùng lịch theo biến thể');
const w1 = await newOrder('2027-03-10T09:00', '2027-03-11T09:00'); await book(w1, V.M_trang); await step('W1 reserve váy M/Trắng', trans(w1, 'new', 'reserved'));
const w2 = await newOrder('2027-03-10T12:00', '2027-03-11T12:00'); await book(w2, V.M_trang); await step('W2 reserve M/Trắng cùng giờ (1 cái)', trans(w2, 'new', 'reserved'));
const w3 = await newOrder('2027-03-10T12:00', '2027-03-11T12:00'); await book(w3, V.M_kem); await step('W3 reserve M/Kem cùng giờ', trans(w3, 'new', 'reserved'));
log('--- S10b BUNDLE');
let r = await api('POST', 'bundles', { data: { type: 'bundles', attributes: { name: '[TEST] Combo sự kiện' } } });
log('create bundle', JSON.stringify(short(r)), r.body?.data && Object.keys(r.body.data.attributes).join(','));
const bid = r.body?.data?.id;
if (bid) {
  for (const [pid, q] of [[D.pid, 2], [A.pid, 1]]) {
    let bi = await api('POST', 'bundle_items', { data: { type: 'bundle_items', attributes: { bundle_id: bid, product_id: pid, quantity: q, discount_percentage: 10 } } });
    if (bi.status >= 300) bi = await api('POST', 'bundle_items', { data: { type: 'bundle_items', attributes: { bundle_id: bid, product_id: pid, quantity: q } } });
    log('bundle item x' + q, JSON.stringify(short(bi)), bi.body?.data && Object.keys(bi.body.data.attributes).join(','));
  }
  const o = await newOrder('2027-03-01T09:00', '2027-03-02T09:00');
  let bk = await api('POST', 'order_fulfillments', { data: { type: 'order_fulfillments', attributes: { order_id: o, actions: [{ action: 'book_bundle', bundle_id: bid, quantity: 1 }] } } });
  log('book_bundle', JSON.stringify(short(bk)));
  log('bundle order lines', (await api('GET', `lines?filter[order_id]=${o}`)).body.data.map(l => `${l.attributes.title} q=${l.attributes.quantity} ${l.attributes.price_in_cents / 100}`));
  await step('bundle order reserve', trans(o, 'new', 'reserved'));
  log('bundle order', await getOrder(o));
}
log('--- S13 BẢNG GIÁ BẬC THANG (price structure)');
r = await api('POST', 'price_structures', { data: { type: 'price_structures', attributes: { name: '[TEST] Ngày, giảm từ ngày thứ 4', price_structure_type: 'reusable' } } });
log('create price_structure', JSON.stringify(short(r)), r.body?.data && Object.keys(r.body.data.attributes).join(','));
const ps = await api('GET', 'price_structures?include=price_tiles'); log('existing structures', (ps.body?.data || []).map(x => x.attributes.name));
log('tile sample', JSON.stringify((ps.body?.included || []).slice(0, 3).map(t => t.attributes)).slice(0, 600));
log('--- S14 PRICE RULESET (cuối tuần +20%)');
r = await api('POST', 'price_rulesets', { data: { type: 'price_rulesets', attributes: { name: '[TEST] Cuối tuần' } } });
log('create ruleset', JSON.stringify(short(r)), r.body?.data && Object.keys(r.body.data.attributes).join(','));
log('IDS', { w1, w2, w3, bid, ruleset: r.body?.data?.id });
