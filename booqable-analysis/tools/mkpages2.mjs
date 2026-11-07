import { writeFileSync } from 'node:fs';
const B = 'https://ghiencafe.booqable.com';
const PG = 'd99f656f-2513-4ba9-9748-4fbb2b0f8667', CU = '1c0e12de-aaa7-4beb-870f-110469a4c938', O1 = '8907f10b-b60e-4f00-b2f2-bfc11842df14';
const pages = [
  ['19-orders-upcoming', '/orders/upcoming'], ['19b-orders-overdue', '/orders/overdue'], ['19c-orders-shortage', '/orders/shortage'],
  ['19d-order-packing-slip', `/orders/${O1}/packing_slip`], ['19e-order-activity-log', `/orders/${O1}/activity_logs`],
  ['34-customer-orders', `/customers/${CU}/orders`], ['35-customer-accounts', `/customers/${CU}/accounts`], ['36-customer-creditcards', `/customers/${CU}/creditcards`], ['37-customer-activity-log', `/customers/${CU}/activity_logs`],
  ['47-product-serial-edit', `/product_groups/${PG}/edit`], ['49-product-serial-history', `/product_groups/${PG}/history`], ['52-product-serial-recommendations', `/product_groups/${PG}/recommendations`],
  ['78-report-operations', '/reports/operations'], ['78b-report-sales-items', '/reports/sales_items'], ['78c-report-services', '/reports/services'], ['78d-report-stock', '/reports/stock'],
  ['81-automations', '/automations'], ['82-automation-new', '/automations/new'],
  ['87-settings-plans', '/settings/plans'], ['88-settings-documents-customize', '/settings/documents/customize'], ['89-settings-emails-header', '/settings/emails/header'],
  ['89b-settings-emails-footer', '/settings/emails/footer'], ['89c-settings-locale-editor', '/settings/locale/editor'], ['89d-settings-online-store', '/settings/online-store'],
  ['89e-settings-install-javascript', '/settings/online-reservations/install-javascript'], ['89f-settings-install-wordpress', '/settings/online-reservations/install-wordpress'],
];
const steps = [];
for (const [name, path] of pages) { steps.push({ nav: B + path, ms: 7500 }); steps.push({ full: name }); }
writeFileSync(process.argv[2], JSON.stringify(steps));
console.log(pages.length, 'pages');
