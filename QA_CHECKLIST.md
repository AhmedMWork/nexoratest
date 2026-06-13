# NEXORA V2 QA Checklist

## Build

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `cd functions && npm install && npm run build`

## Firebase import safety

- [ ] No `src/firebase` folder exists.
- [ ] No root `firebase/auth.ts` or `firebase/storage.ts` files exist.
- [ ] No `firebase/*` path alias exists.
- [ ] Official Firebase SDK imports come only from package imports like `firebase/auth`.

## Customer flow

- [ ] Home opens.
- [ ] Shop opens.
- [ ] Product page opens.
- [ ] Size can be selected.
- [ ] Add to cart works.
- [ ] Coupon validation works.
- [ ] Checkout creates an order through Cloud Function.
- [ ] Stock is reduced.
- [ ] Order tracking works with order number + phone.
- [ ] No raw Firebase error is shown to customers.

## Admin flow

- [ ] `/admin` redirects correctly.
- [ ] Admin login works.
- [ ] Dashboard opens.
- [ ] Products CRUD works.
- [ ] Image upload works.
- [ ] Orders load.
- [ ] Order status update works.
- [ ] Coupons work.
- [ ] Promotions work.
- [ ] Drops work.
- [ ] Audit Logs open.

## Responsive

- [ ] iPhone SE width.
- [ ] iPhone Pro width.
- [ ] Android 360px.
- [ ] iPad.
- [ ] Laptop 1366px.
- [ ] Desktop 1920px.
