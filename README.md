# NEXORA V2

Premium fashion commerce platform built with React, Vite, TypeScript, Firebase, and Vercel.

## V2 focus

NEXORA V2 is an enterprise-oriented foundation release focused on stability, Firebase correctness, admin control, and launch readiness.

## What changed in V2

- Firebase local code moved to `src/lib/firebase` to prevent SDK import shadowing.
- npm-first setup with safe public registry configuration.
- Node 20 requirement documented and enforced.
- Admin Audit Logs added.
- Service-layer exports added under `src/services`.
- Customer-safe error mapper added.
- Admin access remains easy through `/admin` and `/nexora-admin`.
- Cloud Functions remain the authority for checkout, coupons, order tracking, and order status changes.

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run verify
cd functions
npm install
npm run verify
```

## Docs

- `SETUP.md`
- `FIREBASE_ARCHITECTURE.md`
- `ADMIN_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `QA_CHECKLIST.md`
- `V2_RELEASE_REPORT.md`

## Admin

Open:

```txt
/admin
```

or:

```txt
/nexora-admin
```

## Production notes

- Create a real Firebase project.
- Add environment variables to Vercel.
- Deploy Firestore rules, indexes, storage rules, and functions.
- Create an admin user in Firebase Auth and an `admins/{uid}` document.
- Add real products from the admin panel.
- Paymob/Stripe are not enabled in this release; COD is the supported checkout method.
