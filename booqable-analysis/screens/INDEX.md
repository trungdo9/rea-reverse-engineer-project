# Chỉ mục màn hình Booqable (ghiencafe)

Ảnh chụp toàn trang 1440px (storefront có thêm bản mobile 390px). Mỗi ảnh có file `.txt` cùng tên chứa URL và nội dung chữ của màn hình.

## Back-office (nhân viên) — 93 màn hình

| Ảnh | Route | Mục đích nghiệp vụ |
| --- | --- | --- |
| [01-dashboard](back-office/01-dashboard.png) | `/dashboard` | Bảng điều khiển: Going out / Coming back hôm nay, link đơn trễ |
| [02-setup-checklist](back-office/02-setup-checklist.png) | `/setup` | Checklist onboarding 11 bước + trợ lý Bo |
| [10-orders-list](back-office/10-orders-list.png) | `/orders` | Danh sách đơn: lọc trạng thái, thanh toán, tag; số liệu tổng |
| [11-order-returned-paid](back-office/11-order-returned-paid.png) | `/orders/8907f10b-b60e-4f00-b2f2-bfc11842df14` | Đơn đã trả, đã thanh toán (vòng đời hoàn tất) |
| [12-order-reserved](back-office/12-order-reserved.png) | `/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5` | Đơn đang giữ hàng (Reserved), chờ Pickup |
| [13-order-draft-shortage](back-office/13-order-draft-shortage.png) | `/orders/92f3c284-b692-40da-83a1-2ddd9a3e6ce3` | Đơn Draft/báo giá, có dòng thiếu hàng |
| [14-order-webshop](back-office/14-order-webshop.png) | `/orders/44f5ca95-23dd-4671-92f4-902197b603eb` | Đơn đặt online (tag WEBSHOP, tự Reserved) |
| [15-order-pos-picked-up](back-office/15-order-pos-picked-up.png) | `/orders/222f8c85-b4ac-4658-b1ac-12e347162b11` | Đơn bán tại quầy: quét serial, giao ngay, thu tiền mặt |
| [16-order-deposit-held-refunded](back-office/16-order-deposit-held-refunded.png) | `/orders/9ca4b7f3-ba9f-4c0c-bfd7-330d2e1fc119` | Đơn có cọc: giữ 1tr do hư hỏng, hoàn 4tr |
| [17-order-bundle](back-office/17-order-bundle.png) | `/orders/60e105c1-41d8-4fae-a784-49dc11881db5` | Đơn có combo (bundle) giảm 10% |
| [18-order-serial-stock-items](back-office/18-order-serial-stock-items.png) | `/orders/aaf8b1a0-aac4-4b96-8db8-09a78bfa05cd` | Đơn gắn serial cụ thể (stock item) |
| [19-orders-upcoming](back-office/19-orders-upcoming.png) | `/orders/upcoming` | Đơn sắp tới |
| [19b-orders-overdue](back-office/19b-orders-overdue.png) | `/orders/overdue` | Đơn quá hạn trả |
| [19c-orders-shortage](back-office/19c-orders-shortage.png) | `/orders/shortage` | Đơn đang thiếu hàng |
| [19d-order-packing-slip](back-office/19d-order-packing-slip.png) | `/orders/8907f10b-b60e-4f00-b2f2-bfc11842df14/packing_slip` | Phiếu soạn hàng (packing slip) |
| [19e-order-activity-log](back-office/19e-order-activity-log.png) | `/orders/8907f10b-b60e-4f00-b2f2-bfc11842df14/activity_logs` | Nhật ký thao tác của đơn |
| [20-calendar-month](back-office/20-calendar-month.png) | `/calendar/products` | Lịch Gantt theo sản phẩm (tháng) |
| [30-customers-list](back-office/30-customers-list.png) | `/customers` | Danh sách khách hàng |
| [32-customer-edit](back-office/32-customer-edit.png) | `/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/edit` | Hồ sơ khách: thông tin, địa chỉ, cọc/giảm giá riêng |
| [33-customer-new](back-office/33-customer-new.png) | `/customers/new` | Tạo khách mới |
| [34-customer-orders](back-office/34-customer-orders.png) | `/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/orders` | Lịch sử đơn của khách |
| [35-customer-accounts](back-office/35-customer-accounts.png) | `/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/accounts` | Tài khoản đăng nhập storefront của khách |
| [36-customer-creditcards](back-office/36-customer-creditcards.png) | `/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/creditcards` | Thẻ đã lưu của khách |
| [37-customer-activity-log](back-office/37-customer-activity-log.png) | `/customers/1c0e12de-aaa7-4beb-870f-110469a4c938/activity_logs` | Nhật ký thao tác của khách |
| [40-inventory-products](back-office/40-inventory-products.png) | `/product_groups` | Danh sách sản phẩm |
| [41-inventory-bundles](back-office/41-inventory-bundles.png) | `/bundles` | Danh sách combo |
| [42-inventory-collections](back-office/42-inventory-collections.png) | `/collections` | Bộ sưu tập (nhóm sản phẩm trên store) |
| [43-inventory-downtimes](back-office/43-inventory-downtimes.png) | `/downtimes` | Danh sách bảo trì (downtime) |
| [44-product-new](back-office/44-product-new.png) | `/product_groups/new` | Tạo sản phẩm: loại, cách theo dõi kho, giá, biến thể |
| [45-product-serial-overview](back-office/45-product-serial-overview.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667` | Sản phẩm theo serial: tổng quan |
| [46-product-serial-inventory](back-office/46-product-serial-inventory.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/inventory` | Kho theo serial: stock item, nhập kho, kho tạm |
| [47-product-serial-edit](back-office/47-product-serial-edit.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/edit` | Sửa sản phẩm: lead/lag time, shortage limit, SKU, cân nặng |
| [48-product-serial-pricing](back-office/48-product-serial-pricing.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/pricing` | Thiết lập giá sản phẩm |
| [49-product-serial-history](back-office/49-product-serial-history.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/history` | Lịch sử sản phẩm |
| [50-product-serial-online-store](back-office/50-product-serial-online-store.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/online_store` | Hiển thị sản phẩm trên storefront (SEO, mô tả, ảnh) |
| [51-product-serial-downtimes](back-office/51-product-serial-downtimes.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/downtimes` | Downtime của sản phẩm |
| [52-product-serial-recommendations](back-office/52-product-serial-recommendations.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/recommendations` | Gợi ý bán kèm (cross-sell) |
| [53-product-serial-history](back-office/53-product-serial-history.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/activity_logs` | Activity log sản phẩm |
| [54-product-variants-inventory](back-office/54-product-variants-inventory.png) | `/product_groups/b0836f13-a224-4b8b-bd5d-e318a9953634/inventory` | Sản phẩm có biến thể (Size × Màu): kho từng biến thể |
| [55-product-variants-variations](back-office/55-product-variants-variations.png) | `/product_groups/b0836f13-a224-4b8b-bd5d-e318a9953634/variations` | Quản lý biến thể |
| [56-product-tiered-pricing](back-office/56-product-tiered-pricing.png) | `/product_groups/c917bb4f-c8e9-4e64-ae95-0180fd343050/pricing` | Bảng giá bậc thang (giảm 50% từ ngày 4) |
| [57-bundle-detail](back-office/57-bundle-detail.png) | `/bundles/ceeb5623-35aa-4933-bcd1-1d575b93f4fc` | Chi tiết combo |
| [60-coupons-list](back-office/60-coupons-list.png) | `/coupons` | Danh sách coupon |
| [61-coupon-edit](back-office/61-coupon-edit.png) | `/coupons/38dabd22-c7d7-44a7-b8dd-b4700cd6de6c/edit` | Luật coupon: thời hạn, số lần, đơn tối thiểu, cộng dồn |
| [62-coupon-new](back-office/62-coupon-new.png) | `/coupons/new` | Tạo coupon |
| [65-documents-invoices](back-office/65-documents-invoices.png) | `/reports/documents/invoices` | Hóa đơn |
| [66-documents-quotes](back-office/66-documents-quotes.png) | `/reports/documents/quotes` | Báo giá |
| [67-documents-contracts](back-office/67-documents-contracts.png) | `/reports/documents/contracts` | Hợp đồng |
| [70-reports](back-office/70-reports.png) | `/reports` | Danh mục báo cáo |
| [71-report-company-performance](back-office/71-report-company-performance.png) | `/reports/company_performance` | Báo cáo: company performance |
| [72-report-rentals](back-office/72-report-rentals.png) | `/reports/rentals` | Báo cáo: rentals |
| [73-report-availability](back-office/73-report-availability.png) | `/reports/availability` | Báo cáo: availability |
| [74-report-pickups](back-office/74-report-pickups.png) | `/reports/pickups` | Báo cáo: pickups |
| [75-report-customers](back-office/75-report-customers.png) | `/reports/customers` | Báo cáo: customers |
| [76-report-coupons](back-office/76-report-coupons.png) | `/reports/coupons` | Báo cáo: coupons |
| [77-report-activity-logs](back-office/77-report-activity-logs.png) | `/reports/activity_logs` | Báo cáo: activity logs |
| [78-report-operations](back-office/78-report-operations.png) | `/reports/operations` | Báo cáo: operations |
| [78b-report-sales-items](back-office/78b-report-sales-items.png) | `/reports/sales_items` | Báo cáo: sales items |
| [78c-report-services](back-office/78c-report-services.png) | `/reports/services` | Báo cáo: services |
| [78d-report-stock](back-office/78d-report-stock.png) | `/reports/stock` | Báo cáo: stock |
| [80-app-store](back-office/80-app-store.png) | `/app-store` | app store |
| [81-automations](back-office/81-automations.png) | `/setup` | Tự động hóa (automation) |
| [82-automation-new](back-office/82-automation-new.png) | `/setup` | Tạo automation |
| [85-user-settings](back-office/85-user-settings.png) | `/employees/current` | Hồ sơ người dùng: 2FA, khóa API, lịch sử đăng nhập |
| [86-team-invite](back-office/86-team-invite.png) | `/employees/new` | Mời thành viên + 13 quyền |
| [87-settings-plans](back-office/87-settings-plans.png) | `/settings/plans` | Bảng gói cước |
| [88-settings-documents-customize](back-office/88-settings-documents-customize.png) | `/settings/documents/customize` | Settings: documents customize |
| [89-settings-emails-header](back-office/89-settings-emails-header.png) | `/settings/emails/header` | Settings: emails header |
| [89b-settings-emails-footer](back-office/89b-settings-emails-footer.png) | `/settings/emails/footer` | Settings: emails footer |
| [89c-settings-locale-editor](back-office/89c-settings-locale-editor.png) | `/settings/locale` | Settings: locale editor |
| [89e-settings-install-javascript](back-office/89e-settings-install-javascript.png) | `/settings/online-reservations/install-javascript` | Settings: install javascript |
| [89f-settings-install-wordpress](back-office/89f-settings-install-wordpress.png) | `/settings/online-reservations/install-wordpress` | Settings: install wordpress |
| [900-settings-general](back-office/900-settings-general.png) | `/settings/general` | Settings: general |
| [901-settings-prices](back-office/901-settings-prices.png) | `/settings/prices` | Settings: prices |
| [902-settings-taxes](back-office/902-settings-taxes.png) | `/settings/taxes` | Settings: taxes |
| [903-settings-rental-period](back-office/903-settings-rental-period.png) | `/settings/rental-period` | Settings: rental period |
| [904-settings-payments](back-office/904-settings-payments.png) | `/settings/payments` | Settings: payments |
| [905-settings-custom_fields](back-office/905-settings-custom_fields.png) | `/settings/custom_fields` | Settings: custom_fields |
| [906-settings-locations](back-office/906-settings-locations.png) | `/settings/locations` | Settings: locations |
| [907-settings-emails](back-office/907-settings-emails.png) | `/settings/emails` | Settings: emails |
| [908-settings-documents](back-office/908-settings-documents.png) | `/settings/documents` | Settings: documents |
| [909-settings-locale](back-office/909-settings-locale.png) | `/settings/locale` | Settings: locale |
| [910-settings-security](back-office/910-settings-security.png) | `/settings/security` | Settings: security |
| [911-settings-account](back-office/911-settings-account.png) | `/settings/account` | Settings: account |
| [912-settings-online-bookings](back-office/912-settings-online-bookings.png) | `/settings/online-bookings` | Settings: online bookings |
| [913-settings-booking-page](back-office/913-settings-booking-page.png) | `/settings/booking-page` | Settings: booking page |
| [914-settings-website-builder](back-office/914-settings-website-builder.png) | `/settings/website-builder` | Settings: website builder |
| [915-settings-website-integration](back-office/915-settings-website-integration.png) | `/settings/website-integration` | Settings: website integration |
| [916-settings-cross-sell](back-office/916-settings-cross-sell.png) | `/settings/cross-sell` | Settings: cross sell |
| [917-settings-online-reservations](back-office/917-settings-online-reservations.png) | `/settings/online-reservations` | Settings: online reservations |
| [918-settings-pickup-and-delivery](back-office/918-settings-pickup-and-delivery.png) | `/settings/pickup-and-delivery` | Settings: pickup and delivery |
| [919-settings-checkout](back-office/919-settings-checkout.png) | `/settings/checkout` | Settings: checkout |
| [920-settings-seo](back-office/920-settings-seo.png) | `/settings/seo` | Settings: seo |

## Hộp thoại & luồng nghiệp vụ — 20 màn hình

| Ảnh | Route | Mục đích nghiệp vụ |
| --- | --- | --- |
| [d01-pickup-dialog](dialogs/d01-pickup-dialog.png) | `/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5` | Hộp thoại giao hàng (chọn món, giao một phần, quét barcode) |
| [d02-payment-methods](dialogs/d02-payment-methods.png) | `/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5` | Chọn phương thức thanh toán |
| [d03-payment-cash-form](dialogs/d03-payment-cash-form.png) | `/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5` | Thu tiền mặt/chuyển khoản/thẻ ngoài |
| [d04-order-actions-menu](dialogs/d04-order-actions-menu.png) | `/orders/dab7dad1-c565-4b4f-bda4-7d4ad0d930b5` | Menu đơn: Duplicate, Revert, Cancel |
| [d05-reserve-shortage-error](dialogs/d05-reserve-shortage-error.png) | `/orders/68ffcc88-9cce-48f1-8892-c7aebe1a83d4` | Lỗi thiếu hàng khi Reserve |
| [d06-return-dialog-keep-deposit](dialogs/d06-return-dialog-keep-deposit.png) | `/orders/222f8c85-b4ac-4658-b1ac-12e347162b11` | Hộp thoại nhận lại hàng + giữ cọc kèm lý do |
| [d07-add-stock-serial](dialogs/d07-add-stock-serial.png) | `/product_groups/d99f656f-2513-4ba9-9748-4fbb2b0f8667/inventory` | Nhập kho (serial / kho tạm) |
| [d08-calendar-actions-menu](dialogs/d08-calendar-actions-menu.png) | `/calendar/products` | Menu lịch: Subscribe, Today, Day/Week/Month |
| [d09-calendar-subscribe-ical](dialogs/d09-calendar-subscribe-ical.png) | `/calendar/products` | Đồng bộ lịch iCal (URL đã che) |
| [d10-calendar-week](dialogs/d10-calendar-week.png) | `/calendar/products` | Lịch dạng tuần |
| [d11-calendar-check-availability-picker](dialogs/d11-calendar-check-availability-picker.png) | `/calendar/products` | Chọn khoảng thời gian kiểm tra tồn |
| [d12-calendar-availability-result](dialogs/d12-calendar-availability-result.png) | `/calendar/products` | Kết quả: cột còn trống/tổng |
| [d13-user-menu](dialogs/d13-user-menu.png) | `/dashboard` | Menu người dùng |
| [d14-global-scan-barcode](dialogs/d14-global-scan-barcode.png) | `/dashboard` | Quét barcode toàn cục |
| [d20-new-order-empty](dialogs/d20-new-order-empty.png) | `/orders/new` | Tạo đơn mới (trống) |
| [d20-new-order-reopened-unsaved-with-deposit](dialogs/d20-new-order-reopened-unsaved-with-deposit.png) | `/orders/new` | Đơn mới bị mở lại (đơn chưa lưu) có tiền cọc |
| [d21-new-order-create-customer](dialogs/d21-new-order-create-customer.png) | `/orders/new` | Tạo khách ngay trong đơn |
| [d22-new-order-period-picker](dialogs/d22-new-order-period-picker.png) | `/orders/new` | Chọn thời gian thuê trong đơn |
| [d23-new-order-product-search](dialogs/d23-new-order-product-search.png) | `/orders/new` | Tìm & thêm sản phẩm (số còn trống) |
| [d24-new-order-scan-products](dialogs/d24-new-order-scan-products.png) | `/orders/new` | Quét barcode thêm sản phẩm |

## Storefront (khách đặt online) — 17 màn hình

| Ảnh | Route | Mục đích nghiệp vụ |
| --- | --- | --- |
| [01-home-preview-modal](storefront/01-home-preview-modal.png) | `/` | Storefront: thông báo chế độ preview |
| [02-home-catalog](storefront/02-home-catalog.png) | `/` | Trang chủ / danh mục |
| [03-product-variants](storefront/03-product-variants.png) | `/products/test-vay-c-i-duoi-ca` | Sản phẩm có biến thể |
| [04-product-no-period](storefront/04-product-no-period.png) | `/products/test-may-pha-ca-phe` | Trang sản phẩm chưa chọn ngày |
| [05-location-picker](storefront/05-location-picker.png) | `/products/test-may-pha-ca-phe` | Chọn điểm nhận hàng (khi có nhiều chi nhánh) |
| [06-period-picker-calendar](storefront/06-period-picker-calendar.png) | `/products/test-may-pha-ca-phe` | Chọn ngày thuê |
| [07-period-picker-time-slots](storefront/07-period-picker-time-slots.png) | `/products/test-may-pha-ca-phe` | Chọn giờ (bước 60 phút) |
| [08-period-picker-filled](storefront/08-period-picker-filled.png) | `/products/test-may-pha-ca-phe` | Khoảng thuê đã chọn |
| [09-product-with-period-availability](storefront/09-product-with-period-availability.png) | `/products/test-may-pha-ca-phe` | Giá theo khoảng thuê + số còn trống |
| [10-product-added-to-cart](storefront/10-product-added-to-cart.png) | `/products/test-may-pha-ca-phe` | Đã thêm vào giỏ |
| [11-cart](storefront/11-cart.png) | `/carts/b8f95902-28da-4b24-9969-02d597efa474` | Giỏ hàng + dịch vụ thêm + coupon |
| [12-checkout-form](storefront/12-checkout-form.png) | `/checkouts/b8f95902-28da-4b24-9969-02d597efa474` | Checkout: thông tin khách, địa chỉ |
| [13-checkout-success](storefront/13-checkout-success.png) | `/checkouts/83e0b8a1-c43f-42b8-ab46-d3d9b1047def/success` | Đặt hàng thành công |
| [m01-home-mobile](storefront/m01-home-mobile.png) | `/` | Mobile: trang chủ |
| [m02-product-mobile](storefront/m02-product-mobile.png) | `/products/test-may-pha-ca-phe` | Mobile: sản phẩm |
| [m03-cart-mobile](storefront/m03-cart-mobile.png) | `/carts/b8f95902-28da-4b24-9969-02d597efa474` | Mobile: giỏ hàng |
| [m04-checkout-mobile](storefront/m04-checkout-mobile.png) | `/checkouts/b8f95902-28da-4b24-9969-02d597efa474` | Mobile: checkout |

## Ảnh luồng từ các phiên kiểm tra trước

`flow-captures-earlier/` (JPG) chứa ảnh từng bước khi chạy thật các luồng: tạo sản phẩm, đơn #1 từ New → Reserved → Paid → Picked up → Mixed → Returned, đơn #2 thiếu hàng, POS quét thẻ khách/serial, đặt hàng online #3, các trang Settings.
