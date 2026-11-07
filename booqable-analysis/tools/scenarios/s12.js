const N1 = '270674c4-e7eb-483f-abc0-8cef4e2f9be8', A = { pid: '82b39723-dffd-4b2c-bb23-bcdea81880f0' }, svcPid = '08333bec-e4cf-4996-9914-d13a0dccdcc0';
const pls = async o => (await api('GET', `plannings?filter[order_id]=${o}`)).body.data.map(x => ({ id: x.id, pid: x.attributes.item_id, q: x.attributes.quantity, started: x.attributes.started, stopped: x.attributes.stopped }));
let p = await pls(N1);
for (const x of p) await step(`N1 stop ${x.pid === A.pid ? 'Loa A' : 'service'}`, fulfil(N1, [{ action: 'stop_product', product_id: x.pid, planning_id: x.id, quantity: x.q }]));
log('N1', await getOrder(N1));
const o = (await api('GET', `orders/${N1}`)).body.data.attributes;
log('N1 coupon fields', Object.fromEntries(Object.entries(o).filter(([k]) => /coupon|discount/.test(k))));
const rc = await api('POST', 'order_price_recalculations', { data: { type: 'order_price_recalculations', attributes: { order_id: N1 } } });
log('try order_price_recalculations', JSON.stringify(short(rc)));
log('--- S6b hàng bán (consumable, giá cố định)');
for (const pt of ['fixed', 'none']) {
  const sale = await api('POST', 'product_groups', { data: { type: 'product_groups', attributes: { name: `[TEST] Cà phê hạt 1kg (bán, ${pt})`, product_type: 'consumable', tracking_type: 'bulk', price_type: pt, flat_fee_price_in_cents: 25000000, taxable: true } } });
  log(`create consumable price_type=${pt}`, JSON.stringify(short(sale)));
  if (sale.status >= 300) continue;
  const salePid = (await api('GET', `products?filter[product_group_id]=${sale.body.data.id}`)).body.data[0].id;
  await step('stock +5', api('POST', 'stock_adjustments', { data: { type: 'stock_adjustments', attributes: { product_id: salePid, location_id: LOC, quantity: 5 } } }));
  const N2 = await newOrder('2027-02-01T09:00', '2027-02-03T09:00');
  await step('N2 book cà phê x2', book(N2, salePid, 2));
  log('N2 lines', (await api('GET', `lines?filter[order_id]=${N2}`)).body.data.map(l => `${l.attributes.title} q=${l.attributes.quantity} '${l.attributes.charge_label}' ${l.attributes.price_in_cents / 100}`));
  await step('N2 reserve', trans(N2, 'new', 'reserved'));
  const N3 = await newOrder('2027-02-10T09:00', '2027-02-11T09:00');
  await book(N3, salePid, 4); await step('N3 reserve x4 (5 - 2 đã giữ ở N2, ngày khác)', trans(N3, 'new', 'reserved'));
  const q = await pls(N2);
  await step('N2 pickup (giao hàng bán)', fulfil(N2, q.map(x => ({ action: 'start_product', product_id: x.pid, planning_id: x.id, quantity: x.q }))));
  log('N2', await getOrder(N2), await pls(N2));
  log('IDS', { salePid, N2, N3 });
  break;
}
