# NEXORA V1 Release Report

## Release status

This package is the NEXORA V1 production-ready codebase prepared for deployment on Vercel + Firebase.

Validation completed:

- `npm run lint` — passed.
- `npm run build` — passed.
- `cd functions && npm run build` — passed.

Recommended local runtime:

- Node.js 20.x
- npm or pnpm. Use one package manager consistently per install.

## What was fixed in V1

### Build and environment stability

- Added Node 20 project markers through `.nvmrc` and `.node-version`.
- Added npm registry configuration to avoid accidental private registry resolution.
- Added pnpm build dependency approval for packages required by Vite/Firebase.
- Added production chunk splitting in Vite to keep the build cleaner and avoid large default bundle warnings.
- Verified the front-end build and Firebase Functions build.

### Customer-facing production cleanup

- Removed the Vite starter page from the application route layer.
- Removed customer-facing checkout options for inactive payment providers.
- Checkout now shows only the enabled payment method instead of unfinished payment choices.
- Removed fake checkout success behavior from production flow.
- Removed fake order tracking behavior from production flow.
- Removed seed reviews from customer-facing review pages and homepage review sections.
- Customer reviews now come from Firestore and only approved reviews are displayed.

### Orders and server-side authority

- Strengthened `createCheckoutOrder` as the authoritative server-side order function.
- Product prices are recalculated on the server.
- Stock is checked on the server.
- Order creation and stock deduction happen inside a Firestore transaction.
- Coupon validation happens on the server.
- Free shipping coupons are supported.
- First-order-only coupons are enforced during order creation.
- Per-customer coupon limits are enforced during order creation.
- Inventory logs are written when stock is deducted.
- Audit logs are written for sensitive order actions.
- Product status is updated automatically when stock reaches zero.

### Order tracking and order status

- Order tracking requires order number + customer phone.
- Added callable `updateOrderStatus` for admin-controlled order status updates.
- Order status updates write tracking entries and audit logs.
- Cancelled/returned order transitions can restore stock safely without repeated restocking.

### Admin products

- Product creation now requires real product images instead of placeholder images.
- Added image upload support through Firebase Storage.
- Added validation for product name, SKU, price, images, sizes, and stock.
- Added support for status, sizes, fit, care instructions, collections, badges, and visibility-oriented fields.
- Product images can be uploaded or pasted as URLs.

### Admin coupons

- Expanded coupon control for:
  - allowed product IDs
  - excluded product IDs
  - allowed categories
  - excluded categories
  - allowed collections
  - excluded collections
  - start date
  - end date
  - usage limit
  - per-customer limit
  - first-order-only
  - maximum discount
  - free shipping coupons

### Admin reviews

- Replaced local review demo state with Firestore moderation.
- Admin can review, approve, and delete customer reviews.
- Customer-facing review sections only show approved reviews.

### Firebase deployment readiness

- Added Firestore composite indexes for production query patterns.
- Updated `firebase.json` to include `firestore.indexes.json`.
- Strengthened Firestore and Storage deployment assets.
- Storage image upload is admin-controlled by rules.

## Important notes before public launch

- Online payment providers are intentionally not active in this package. COD is the active checkout path unless you integrate Paymob/Stripe credentials and flows.
- Add real Firebase environment variables before running production.
- Create an admin Firebase Auth user and matching `admins/{uid}` Firestore document before using the dashboard.
- Deploy Firestore rules, indexes, Storage rules, and Functions before testing checkout.
- Add real products from the admin dashboard before launch.
- Run one complete real order test before public marketing.

## Required Firebase deploy command

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```

## Recommended final test flow

1. Log into admin.
2. Add a product with images, SKU, price, sizes, and stock.
3. Add a coupon with start/end date.
4. Place a customer order using COD.
5. Confirm the order appears in admin orders.
6. Confirm stock decreased.
7. Track the order using order number + phone.
8. Change order status from admin.
9. Confirm tracking updates are visible to the customer.
10. Cancel a test order and confirm stock restoration if applicable.
