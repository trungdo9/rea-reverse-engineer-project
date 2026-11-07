const o = '9ca4b7f3-ba9f-4c0c-bfd7-330d2e1fc119', ORDER1 = '8907f10b-b60e-4f00-b2f2-bfc11842df14';
const pay = id => api('GET', `orders/${id}`).then(r => { const a = r.body.data.attributes; return { pay: a.payment_status, total: a.grand_total_in_cents / 100, paid: a.paid_in_cents / 100, to_be_paid: a.to_be_paid_in_cents / 100, deposit_to_refund: a.deposit_to_refund_in_cents / 100 }; });
let r = await api('POST', 'payment_refunds', { data: { type: 'payment_refunds', attributes: { order_id: o, amount_in_cents: 0, deposit_in_cents: 400000000, provider_method: 'bank_transfer', succeeded_at: new Date().toISOString() } } });
log('refund deposit 4tr', JSON.stringify(short(r)), r.body?.data && JSON.stringify(r.body.data.attributes).slice(0, 300));
log('car order final', await pay(o));
r = await api('POST', 'payment_refunds', { data: { type: 'payment_refunds', attributes: { order_id: ORDER1, amount_in_cents: 20000000, deposit_in_cents: 0, provider_method: 'cash', succeeded_at: new Date().toISOString() } } });
log('refund 200k on #1', JSON.stringify(short(r)));
log('#1 final', await pay(ORDER1));
