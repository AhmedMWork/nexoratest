# NEXORA V1.1 — Midnight Atelier Release Report

## Release Summary

NEXORA V1.1 upgrades the V1 production base with a premium fashion visual direction, easier admin access, improved mobile storefront layout, and a full build verification pass.

## Key Improvements

### 1. Visual Identity Upgrade

- Replaced the sharper black/orange system with Midnight Atelier colors.
- Added premium dark palette: Obsidian, Soft Black, Graphite, Warm Ivory, Muted Stone, Champagne Gold.
- Added refined light mode overrides using warm ivory and porcelain surfaces.
- Updated buttons, cards, badges, hover states, gradients, and global surfaces.

### 2. Storefront Upgrade

- Rebuilt the hero section around a premium editorial brand message.
- Removed temporary campaign language from the hero.
- Upgraded product cards with editorial styling, sold-out logic, low-stock indicators, refined quick add, and better mobile behavior.
- Changed the mobile shop grid to two columns for better fashion catalog browsing.
- Improved footer with a luxury newsletter panel and clear admin access.

### 3. Admin Access Upgrade

- Added `/admin` shortcut route redirecting to `/nexora-admin`.
- Added Admin Access icon in the header.
- Added Admin Access link in the mobile menu.
- Added Admin Access link in the footer.
- Added View Store action in the admin sidebar.
- Upgraded admin login page visually with a premium command center layout.

### 4. Stability & QA

Verified successfully:

```bash
npm run lint
npm run build
cd functions
npm run build
```

All commands completed without errors.

## Notes Before Deployment

1. Use Node 20 for Firebase Functions.
2. Configure Firebase credentials in Vercel Environment Variables.
3. Deploy Firestore rules, indexes, Storage rules, and Functions.
4. Create an admin user in Firebase Authentication and add matching UID to the `admins` collection.
5. Test one complete order flow on the production Firebase project before public launch.

## Version

NEXORA V1.1 — Midnight Atelier
