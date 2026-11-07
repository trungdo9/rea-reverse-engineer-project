const A = { pgId: '25141510-0c61-46e0-b430-43c121ff0163', pid: '82b39723-dffd-4b2c-bb23-bcdea81880f0' };
const av = async (f, t) => { const r = await api('GET', `availabilities?filter[item_id]=${A.pid}&filter[from]=${T(f)}&filter[till]=${T(t)}&filter[location_id]=${LOC}`); return r.status < 300 ? (r.body.data[0]?.attributes || r.body.data) : short(r); };
log('availability probe', await av('2026-11-20T09:00', '2026-11-22T15:00'));

log('--- S1.1 thuê nối tiếp đúng ranh giới (O1 kết thúc 22/11 15:00, O2 bắt đầu 22/11 15:00)');
const o1 = await newOrder('2026-11-20T09:00', '2026-11-22T15:00');
await step('O1 book Loa A x1', book(o1, A.pid));
await step('O1 new->reserved', trans(o1, 'new', 'reserved'));
const o2 = await newOrder('2026-11-22T15:00', '2026-11-24T15:00');
await step('O2 book (22/11 15:00 -> 24/11)', book(o2, A.pid));
await step('O2 new->reserved (back-to-back)', trans(o2, 'new', 'reserved'));

log('--- S1.2 chồng lấn 1 giờ (O3 bắt đầu 22/11 14:00)');
const o3 = await newOrder('2026-11-22T14:00', '2026-11-23T10:00');
await step('O3 book (overlap 1h with O1)', book(o3, A.pid));
await step('O3 new->reserved', trans(o3, 'new', 'reserved'));
log('O3 state', await getOrder(o3));

log('--- S1.3 chồng lấn 1 phút');
const o3b = await newOrder('2026-11-24T14:59', '2026-11-25T10:00');
await step('O3b book (overlap 1 minute with O2 end 24/11 15:00)', book(o3b, A.pid));
await step('O3b new->reserved', trans(o3b, 'new', 'reserved'));

log('--- S1.4 thời gian đệm (lag time 2h sau mỗi lượt thuê)');
const pr = await api('PATCH', `products/${A.pid}`, { data: { type: 'products', id: A.pid, attributes: { buffer_time_after: 7200 } } });
log('set buffer_time_after=7200s', short(pr), pr.body?.data?.attributes?.buffer_time_after);
const o4 = await newOrder('2026-11-24T16:00', '2026-11-25T09:00');
await step('O4 book (1h after O2 end, buffer 2h)', book(o4, A.pid));
await step('O4 new->reserved', trans(o4, 'new', 'reserved'));
const o5 = await newOrder('2026-11-24T17:00', '2026-11-25T09:00');
await step('O5 book (exactly 2h after O2 end)', book(o5, A.pid));
await step('O5 new->reserved', trans(o5, 'new', 'reserved'));
log('O2 (already reserved) after buffer change', await getOrder(o2));

log('--- S1.5 lead time 3h trước mỗi lượt thuê, áp dụng cho O1/O2 đã nối tiếp');
const pr2 = await api('PATCH', `products/${A.pid}`, { data: { type: 'products', id: A.pid, attributes: { buffer_time_before: 10800 } } });
log('set buffer_time_before=10800s', short(pr2));
log('O1', await getOrder(o1)); log('O2', await getOrder(o2));
const o6 = await newOrder('2026-11-26T09:00', '2026-11-27T09:00');
await step('O6 book (far away, buffers both sides)', book(o6, A.pid));
await step('O6 new->reserved', trans(o6, 'new', 'reserved'));
await api('PATCH', `products/${A.pid}`, { data: { type: 'products', id: A.pid, attributes: { buffer_time_before: 0, buffer_time_after: 0 } } });
log('reset buffers to 0');
log('IDS', { o1, o2, o3, o3b, o4, o5, o6 });
