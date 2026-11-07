const keys = o => o ? Object.keys(o).join(',') : '';
log('--- NHÂN VIÊN & QUYỀN');
const emp = await api('GET', 'employees');
for (const e of emp.body?.data || []) { const a = e.attributes; log('employee', a.name, a.email, 'owner=', a.owner, 'active=', a.active, 'permissions=', JSON.stringify(a.permissions)); log('employee attrs', keys(a)); }
log('--- THÔNG BÁO');
for (const p of ['notification_subscriptions', 'notifications', 'employee_notification_subscriptions']) { const r = await api('GET', p); log(p, r.status, JSON.stringify((r.body?.data || []).slice(0, 20).map(x => x.attributes)).slice(0, 1500)); }
log('--- THANH TOÁN');
for (const p of ['payment_methods', 'app_payment_options', 'payment_profiles', 'payments?page[size]=5']) { const r = await api('GET', p); log(p, r.status, JSON.stringify((r.body?.data || []).slice(0, 5).map(x => ({ t: x.type, ...x.attributes }))).slice(0, 700)); }
