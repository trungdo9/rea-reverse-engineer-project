const r = await api('GET', 'orders?filter[statuses][]=new&page[size]=50');
for (const o of r.body.data) log(o.id, JSON.stringify(short(await trans(o.id, 'new', 'draft'))));
