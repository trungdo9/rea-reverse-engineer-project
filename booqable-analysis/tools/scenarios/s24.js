const car = { pid: '8c9c3b78-f588-4f3c-82bb-eee43c85187d' };
const ORDER1 = '8907f10b-b60e-4f00-b2f2-bfc11842df14';
const pay = o => api('GET', `orders/${o}`).then(r => { const a = r.body.data.attributes; return { status: a.status, pay: a.payment_status, total: a.grand_total_in_cents / 100, deposit: a.deposit_in_cents / 100, paid: a.paid_in_cents / 100, deposit_paid: a.deposit_paid_in_cents / 100, to_be_paid: a.to_be_paid_in_cents / 100, deposit_held: a.deposit_held_in_cents / 100, deposit_to_refund: a.deposit_to_refund_in_cents / 100 }; });
log('--- P1 HOÀN TIỀN THỦ CÔNG (đơn #1 đã Paid 1,2tr)');
log('#1 before', await pay(ORDER1));
let r = await api('POST', 'payment_refunds', { data: { type: 'payment_refunds', attributes: { mode: 'manual', order_id: ORDER1, amount_in_cents: 20000000, deposit_in_cents: 0, provider_method: 'cash', succeeded_at: new Date().toISOString(), description: '[TEST] hoàn 200k do trả sớm' } } });
log('refund 200k', JSON.stringify(short(r)));
log('#1 after refund', await pay(ORDER1));
log('--- P2 CỌC: thu cọc -> giao -> trả có hư hỏng -> giữ 1tr cọc -> hoàn phần còn lại');
const o = await newOrder('2027-06-01T09:00', '2027-06-03T09:00');
await book(o, car.pid); await step('reserve xe (thuê 2tr + cọc 5tr)', trans(o, 'new', 'reserved'));
log('after reserve', await pay(o));
r = await api('POST', 'payment_charges', { data: { type: 'payment_charges', attributes: { mode: 'manual', order_id: o, amount_in_cents: 200000000, deposit_in_cents: 500000000, provider_method: 'bank_transfer', succeeded_at: new Date().toISOString() } } });
log('charge rent 2tr + deposit 5tr (chuyển khoản)', JSON.stringify(short(r)));
log('after charge', await pay(o));
const pl = (await api('GET', `plannings?filter[order_id]=${o}`)).body.data;
await step('pickup', fulfil(o, pl.map(p => ({ action: 'start_product', product_id: p.attributes.item_id, planning_id: p.id, quantity: p.attributes.quantity }))));
await step('return', fulfil(o, pl.map(p => ({ action: 'stop_product', product_id: p.attributes.item_id, planning_id: p.id, quantity: p.attributes.quantity }))));
let held = null;
for (const t of ['deposit_holds', 'order_deposit_holds', 'held_deposits', 'deposit_hold_changes']) { const h = await api('POST', t, { data: { type: t, attributes: { order_id: o, amount_in_cents: 100000000, reason: '[TEST] trầy xước cản trước' } } }); log('POST', t, JSON.stringify(short(h))); if (h.status < 300) { held = t; break; } }
log('after hold', await pay(o));
log('order lines', (await api('GET', `lines?filter[order_id]=${o}`)).body.data.map(l => `${l.attributes.title} ${l.attributes.line_type} ${l.attributes.price_in_cents / 100}`));
r = await api('POST', 'payment_refunds', { data: { type: 'payment_refunds', attributes: { mode: 'manual', order_id: o, amount_in_cents: 0, deposit_in_cents: 400000000, provider_method: 'bank_transfer', succeeded_at: new Date().toISOString() } } });
log('refund remaining deposit 4tr', JSON.stringify(short(r)));
log('final', await pay(o));
log('--- P3 PAYMENT REQUEST / LINK khi chưa có cổng thanh toán');
for (const t of ['payment_requests', 'payment_links']) { const q = await api('POST', t, { data: { type: t, attributes: { order_id: o, amount_in_cents: 10000000 } } }); log('POST', t, JSON.stringify(short(q))); }
log('IDS', { o, held });
