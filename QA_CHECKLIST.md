# NEXORA V1.1 — QA Checklist

## Build QA

- [x] `npm run lint`
- [x] `npm run build`
- [x] `cd functions && npm run build`

## Storefront QA

- [ ] Home opens without layout break.
- [ ] Header appears on home and all public pages.
- [ ] `/admin` redirects to `/nexora-admin`.
- [ ] Mobile menu contains Admin Access.
- [ ] Footer contains Admin Access.
- [ ] Dark mode and light mode both render readable contrast.
- [ ] English is default.
- [ ] Arabic switches document direction to RTL.
- [ ] Shop grid displays well on mobile and desktop.
- [ ] Product cards show sold-out and low-stock states correctly.
- [ ] Product page supports size selection and sticky mobile purchase behavior.
- [ ] Cart updates quantities correctly.
- [ ] Checkout does not show inactive payment methods.
- [ ] Track order requires order number and phone.

## Admin QA

- [ ] Login route opens from `/admin`.
- [ ] Authenticated admin redirects to dashboard.
- [ ] Sidebar navigation works.
- [ ] View Store button works.
- [ ] Products can be created, edited, hidden, and deleted.
- [ ] Product image upload works with Firebase Storage.
- [ ] Orders load and status updates work.
- [ ] Inventory page reflects stock changes.
- [ ] Coupons validate against server-side function.
- [ ] Promotions and Drops are manageable.
- [ ] Reviews only show after approval.
- [ ] Settings save correctly.

## Production QA

- [ ] Firestore rules deployed.
- [ ] Firestore indexes deployed.
- [ ] Storage rules deployed.
- [ ] Cloud Functions deployed.
- [ ] Vercel environment variables configured.
- [ ] Test order creates order document.
- [ ] Stock decreases after order.
- [ ] Coupon usage increments after valid use.
- [ ] Admin can update order status.
- [ ] Customer can track order with phone and order number.
