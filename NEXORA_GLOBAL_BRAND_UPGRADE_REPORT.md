# NEXORA Global Brand Upgrade Report

## Build Stability
- Added `.nvmrc` and `.node-version` set to Node 20.
- Added `engines.node` and `pnpm.onlyBuiltDependencies` to solve the ignored-builds issue for `@firebase/util`, `esbuild`, and `protobufjs`.
- Added `.npmrc` to force the public npm registry and avoid private/incorrect registries.
- Frontend production build passed: `npm run build`.
- Firebase Functions build passed: `cd functions && npm run build`.

## Storefront Hardening
- Checkout now supports validated coupon codes through Firebase Functions.
- Checkout sends coupon codes to the server; the server recalculates prices and discounts and does not trust client totals.
- Customer order tracking remains protected through order number + phone number.
- Raw coupons are no longer readable by public clients; validation happens server-side.
- Products can now be marked draft/active/hidden/archived/sold out to prevent unfinished products appearing to customers.

## Admin Platform Upgrade
- Added complete Promotions management page.
- Added complete Drops management page.
- Upgraded Coupons management from mock/demo state to Firestore CRUD.
- Upgraded Product admin form with product status, sizes, fit and care instructions.
- Added admin navigation for Promotions and Drops.
- Added audit logging for product, coupon, promotion, drop, settings and order status actions.
- Added inventory logs support.

## Commerce Engine Upgrade
- Firebase Function `validateCoupon` added.
- Firebase Function `createCheckoutOrder` upgraded to:
  - validate products and stock from Firestore
  - calculate subtotal server-side
  - validate coupon rules server-side
  - apply discount server-side
  - calculate shipping server-side
  - decrement stock in transaction
  - update sold-out status when stock reaches zero
  - write inventory logs
  - increment coupon usage count
  - write audit logs

## Data Model Additions
New/expanded collections supported:
- `products`
- `orders`
- `coupons`
- `promotions`
- `drops`
- `inventoryLogs`
- `auditLogs`
- `reviews`
- `siteSettings`
- `admins`

## Firebase Security
- Products are public only when active/sold_out and public.
- Orders are direct-admin only; customer creation/tracking uses Cloud Functions.
- Coupons are admin-only; customer validation uses Cloud Functions.
- Promotions and drops are public only when customer-safe.
- Inventory logs and audit logs are admin-only.
- Storage write is admin-only with image size/type restrictions.

## Notes Before Production
- Use Node 20 locally and in Firebase Functions.
- Deploy functions before testing checkout/coupon validation.
- Create an admin user in Firebase Auth and add the same UID to Firestore `admins`.
- Add real products from the admin panel before launch.
- Keep COD enabled until Paymob/Stripe keys are added and tested.
