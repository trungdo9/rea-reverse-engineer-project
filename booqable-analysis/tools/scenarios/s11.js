const D = { pgId: '3454c17c-50f1-4382-8868-35e0df51b029', pid: '5f89ec69-bd46-4313-908c-1d9462938d32' };
const A = { pid: '82b39723-dffd-4b2c-bb23-bcdea81880f0' };
const tryPost = async (label, path, variants) => { for (const a of variants) { const r = await api('POST', path, { data: { type: path, attributes: a } }); log(label.padEnd(40), Object.keys(a).join(','), JSON.stringify(short(r))); if (r.status < 300) return r.body.data; } return null; };

log('--- S5 NHIỀU CHI NHÁNH');
const loc2 = await tryPost('create location', 'locations', [{ name: '[TEST] Kho Quận 7', location_type: 'rental', code: 'Q7' }, { name: '[TEST] Kho Quận 7' }]);
if (loc2) {
  await step('Loa D +2 at Kho Q7', api('POST', 'stock_adjustments', { data: { type: 'stock_adjustments', attributes: { product_id: D.pid, location_id: loc2.id, quantity: 2 } } }));
  const M1 = await newOrder('2027-01-20T09:00', '2027-01-21T09:00');
  await book(M1, D.pid, 4); await step('M1 (start loc = kho chính, có 3) reserve x4', trans(M1, 'new', 'reserved'));
  log('M1', await getOrder(M1));
  const pl = (await api('GET', `plannings?filter[order_id]=${M1}`)).body.data.map(x => ({ q: x.attributes.quantity, shortage: x.attributes.shortage_amount, loc_shortage: x.attributes.location_shortage_amount }));
  log('M1 plannings', pl);
  const M2 = await api('POST', 'orders', { data: { type: 'orders', attributes: { customer_id: CUST, starts_at: T('2027-01-22T09:00'), stops_at: T('2027-01-23T09:00'), start_location_id: loc2.id, stop_location_id: LOC } } });
  log('M2 create (nhận ở Q7, trả ở kho chính)', JSON.stringify(short(M2)));
  if (M2.status < 300) { await book(M2.body.data.id, D.pid, 2); await step('M2 reserve x2 from Q7', trans(M2.body.data.id, 'new', 'reserved')); log('M2', await getOrder(M2.body.data.id)); }
  log('transfers list', JSON.stringify(short(await api('GET', 'transfers'))));
}

log('--- S6 HÀNG BÁN (sales item) & DỊCH VỤ');
const sale = await api('POST', 'product_groups', { data: { type: 'product_groups', attributes: { name: '[TEST] Cà phê hạt 1kg (bán)', product_type: 'consumable', tracking_type: 'bulk', price_type: 'simple', flat_fee_price_in_cents: 25000000, taxable: true } } });
log('create sales item (consumable)', JSON.stringify(short(sale)));
let salePid = null;
if (sale.status < 300) {
  salePid = (await api('GET', `products?filter[product_group_id]=${sale.body.data.id}`)).body.data[0].id;
  await step('sales stock +5', api('POST', 'stock_adjustments', { data: { type: 'stock_adjustments', attributes: { product_id: salePid, location_id: LOC, quantity: 5 } } }));
}
const svc = await api('POST', 'product_groups', { data: { type: 'product_groups', attributes: { name: '[TEST] Phí giao hàng', product_type: 'service', tracking_type: 'none', price_type: 'simple', flat_fee_price_in_cents: 5000000, taxable: true } } });
log('create service', JSON.stringify(short(svc)));
const svcPid = svc.status < 300 ? (await api('GET', `products?filter[product_group_id]=${svc.body.data.id}`)).body.data[0].id : null;
const N1 = await newOrder('2027-01-25T09:00', '2027-01-27T09:00');
await step('N1 book Loa A x1 (2 ngày)', book(N1, A.pid));
if (salePid) await step('N1 book cà phê hạt x2 (bán)', book(N1, salePid, 2));
if (svcPid) await step('N1 book phí giao hàng x1', book(N1, svcPid, 1));
const ln = (await api('GET', `lines?filter[order_id]=${N1}`)).body.data.map(l => `${l.attributes.title} q=${l.attributes.quantity} ${l.attributes.charge_label || ''} ${l.attributes.price_in_cents / 100}`);
log('N1 lines', ln);
await step('N1 reserve', trans(N1, 'new', 'reserved'));
const plN = (await api('GET', `plannings?filter[order_id]=${N1}`)).body.data.map(x => ({ id: x.id, pid: x.attributes.item_id, q: x.attributes.quantity }));
await step('N1 pickup all', fulfil(N1, plN.map(p => ({ action: 'start_product', product_id: p.pid, planning_id: p.id, quantity: p.q }))));
await step('N1 return all', fulfil(N1, plN.map(p => ({ action: 'stop_product', product_id: p.pid, planning_id: p.id, quantity: p.q }))));
log('N1 after return', await getOrder(N1), (await api('GET', `plannings?filter[order_id]=${N1}`)).body.data.map(x => `${x.attributes.planning_type} q=${x.attributes.quantity} started=${x.attributes.started} stopped=${x.attributes.stopped}`));
if (salePid) { const p = (await api('GET', `products/${salePid}`)).body.data.attributes; log('sales item stock after selling 2', Object.fromEntries(Object.entries(p).filter(([k]) => /stock|count/.test(k)))); }

log('--- S7 COUPON');
const cp = await tryPost('create coupon', 'coupons', [{ identifier: 'TEST10', coupon_type: 'percentage', value: 10 }]);
if (cp) { const r = await api('PATCH', `orders/${N1}`, { data: { type: 'orders', id: N1, attributes: { coupon_id: cp.id } } }); log('apply coupon to N1', JSON.stringify(short(r)), await getOrder(N1)); }

log('--- S8 CHỨNG TỪ');
for (const t of ['quote', 'contract', 'invoice']) await tryPost(`create ${t}`, 'documents', [{ order_id: N1, document_type: t }]);
const docs = (await api('GET', `documents?filter[order_id]=${N1}`)).body.data.map(d => `${d.attributes.document_type} #${d.attributes.number} ${d.attributes.status || ''} finalized=${d.attributes.finalized} total=${d.attributes.grand_total_with_tax_in_cents / 100}`);
log('N1 documents', docs);
log('IDS', { loc2: loc2?.id, salePid, svcPid, N1, coupon: cp?.id });
