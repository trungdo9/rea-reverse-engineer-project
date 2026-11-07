const r = await api('GET', 'orders?filter[statuses][]=new&page[size]=100');
const ids = (r.body?.data || []).map(o => o.id);
log('orders in status new:', ids.length);
let ok = 0, fail = [];
for (const id of ids) { const t = await trans(id, 'new', 'draft'); if (t.status < 300) ok++; else fail.push(short(t)); }
log('moved to draft:', ok, 'failed:', JSON.stringify(fail).slice(0, 300));
