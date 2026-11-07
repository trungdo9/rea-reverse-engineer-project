const pid = '2941f917-2bc1-4a2f-93d0-92380ce119a2', I1 = '387e3d5f-edf7-4cf8-b510-f81078903435', I2 = 'fda17aaf-c32e-4955-9120-539a487eadba';
const tries = [
  { stock_item_id: I2, starts_at: T('2026-12-28T00:00'), stops_at: T('2026-12-30T00:00'), location_id: LOC, reason: 'maintenance' },
  { stock_item_ids: [I2], product_id: pid, starts_at: T('2026-12-28T00:00'), stops_at: T('2026-12-30T00:00'), location_id: LOC, notes: '[TEST] bảo trì' },
  { item_id: pid, quantity: 1, starts_at: T('2026-12-28T00:00'), stops_at: T('2026-12-30T00:00'), location_id: LOC, notes: '[TEST] bảo trì' },
];
let dt = null;
for (const a of tries) { const r = await api('POST', 'downtimes', { data: { type: 'downtimes', attributes: a } }); log('POST downtimes', Object.keys(a).join(','), JSON.stringify(short(r))); if (r.status < 300) { dt = r.body.data; break; } }
if (dt) log('downtime attrs', JSON.stringify(dt.attributes).slice(0, 600));
const S7 = 'b036f233-16f7-4925-ab14-6247f96e46c7', S6 = '40083efd-4c7c-47ac-aba2-8bca93ca458c';
log('S6 (x2 reserved 28-29/12) after downtime', await getOrder(S6));
const S9 = await newOrder('2026-12-29T10:00', '2026-12-29T18:00');
await book(S9, pid, 1); await step('S9 reserve x1 29/12 (1 in downtime, 1 free?)', trans(S9, 'new', 'reserved'));
log('--- archive serial');
for (const [m, p, b] of [['POST', `stock_items/${I1}/archive`], ['PATCH', `stock_items/${I1}`, { data: { type: 'stock_items', id: I1, attributes: { archived_at: new Date().toISOString() } } }], ['DELETE', `stock_items/${I1}?archive=true`]]) {
  const r = await api(m, p, b); log(m, p, JSON.stringify(short(r)));
}
