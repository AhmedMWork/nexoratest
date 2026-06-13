# NEXORA Deployment Checklist

## 1. Local Build
- [x] Frontend build tested with `npm run build`.
- [x] Functions build tested with `cd functions && npm run build`.
- [x] Node version pinned to 20 through `.nvmrc` and `.node-version`.
- [x] pnpm ignored-builds issue handled in `package.json`.

## 2. Firebase
- [ ] Create/confirm production Firebase project.
- [ ] Add Firebase web config to Vercel environment variables.
- [ ] Deploy Firestore rules.
- [ ] Deploy Storage rules.
- [ ] Deploy Cloud Functions.
- [ ] Deploy Firestore indexes from `firestore.indexes.json`.
- [ ] Create first Firebase Auth admin user.
- [ ] Add Firestore document `admins/{uid}` for that user.

## 3. Admin Configuration
- [ ] Log in to `/nexora-admin`.
- [ ] Update Settings: WhatsApp, shipping fee, free shipping threshold, social links, SEO.
- [ ] Add real products with images, sizes, prices, stock, status `active`.
- [ ] Create test coupon.
- [ ] Create test promotion.
- [ ] Create test drop.

## 4. Customer Flow Test
- [ ] Open home on desktop.
- [ ] Open home on iPhone/mobile viewport.
- [ ] Browse shop.
- [ ] Open product page.
- [ ] Add product to cart.
- [ ] Apply coupon.
- [ ] Place COD order.
- [ ] Confirm order appears in admin Orders.
- [ ] Confirm stock was decreased.
- [ ] Track order using order number + phone.

## 5. Launch Safety
- [ ] No demo/fake success appears to customers.
- [ ] No placeholder products are active.
- [ ] No payment methods appear unless actually enabled.
- [ ] Policies reviewed: Shipping, Returns, Privacy, Terms.
- [ ] Domain connected in Vercel.
- [ ] Firebase App Check planned/enabled before high traffic.


## V1 verification commands

```bash
npm run lint
npm run build
cd functions && npm run build
```

## V1 Firebase deployment

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```
