const id = '92f3c284-b692-40da-83a1-2ddd9a3e6ce3';
log('before', await getOrder(id));
const r = await api('POST', 'order_status_transitions', { data: { type: 'order_status_transitions', attributes: { order_id: id, transition_from: 'reserved', transition_to: 'draft', revert: true } } });
log('revert reserved->draft', JSON.stringify(short(r)));
log('after', await getOrder(id));
