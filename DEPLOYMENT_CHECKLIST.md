# NEXORA V3 — Deployment Checklist

## 1. Install
```bash
npm install
npm run build
cd functions
npm install
npm run build
```

## 2. Firebase
```bash
firebase login
firebase use <project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```

## 3. Vercel
- Import the GitHub repo or upload the project.
- Set build command: `npm run build`.
- Set output directory: `dist`.
- Add all `VITE_FIREBASE_*` environment variables.

## 4. Studio
Open `/studio` after deployment.

## 5. QA
- Homepage logo entry gate.
- Light mode default.
- Dark mode toggle.
- EN/AR switch.
- Men/Women/Unisex shop filters.
- Product page.
- Cart and checkout.
- Track order.
- Studio reviews creation.
- Studio product creation.
- Mobile menu.

## Security note
V3 follows the requested hidden link-only Studio entry. Before a high-volume public launch, enable Firebase Auth or a server-side Studio PIN.
