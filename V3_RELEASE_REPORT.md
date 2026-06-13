# NEXORA V3 — Soft Luxury Editorial Rebuild

## Release status
NEXORA V3 is a major visual, UX, and operating-model upgrade focused on a lighter premium identity inspired by the supplied reference board.

## What changed
- Rebuilt the public visual direction around a warm ivory / sand / dust rose / mocha palette.
- Made Light Mode the default branded experience.
- Rebuilt Dark Mode using warm cocoa/graphite tones instead of harsh black inversion.
- Rebuilt the homepage as an editorial luxury storefront with hero, category panels, featured products, service cards, reviews, and about/contact-inspired blocks.
- Added Men / Women / Unisex catalog support across navigation, filters, product types, seed data, and admin product editing.
- Removed all visible Admin links and icons from the public storefront.
- Added hidden studio entry routes: `/studio`, `/admin`, and `/nexora-admin/dashboard`.
- Converted public reviews into display-only curated reviews.
- Upgraded Admin Reviews so only Studio/admin can create, publish, hide, feature, or delete reviews.
- Updated the entry splash screen so the logo appears first and the customer clicks Enter Store.
- Updated animation direction to softer editorial fades, movement, and hover interactions.
- Preserved the Firebase import architecture under `src/lib/firebase` to prevent module shadowing.
- Added V3 documentation and setup notes.

## Verified
- Frontend TypeScript + production build: `npm run build` succeeded.
- Firebase Functions TypeScript build: `cd functions && npm run build` succeeded.

## Notes
The Studio access is hidden from the storefront as requested. For public-scale production, a password/PIN or Firebase admin auth is still strongly recommended before sharing the domain widely.
