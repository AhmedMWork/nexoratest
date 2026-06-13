# NEXORA V2 Deployment Checklist

## Local verification

```bash
npm install
npm run verify
cd functions
npm install
npm run verify
```

## Firebase

```bash
firebase login
firebase use <project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only functions
```

## Vercel

Add these environment variables:

```txt
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ENABLE_SEED_FALLBACK=false
VITE_DEFAULT_WHATSAPP_NUMBER
```

## Admin

- [ ] Firebase Auth user created.
- [ ] `admins/{uid}` document created.
- [ ] Admin login tested.
- [ ] Product creation tested.
- [ ] Image upload tested.
- [ ] Order status update tested.
- [ ] Audit Logs tested.

## Storefront

- [ ] Products visible.
- [ ] Hidden/draft products not visible.
- [ ] Cart works.
- [ ] Coupon works.
- [ ] Checkout works.
- [ ] Track order works.
- [ ] Arabic/English checked.
- [ ] Dark/Light checked.
- [ ] iPhone/mobile checked.
