# NEXORA

**Premium Summer Essentials — Built Different.**

A complete production-ready luxury fashion e-commerce platform specialized in Men's and Women's Summer T-Shirts. Built with React 19, TypeScript, Tailwind CSS, Firebase, and Zustand.

## Features

### Public Store
- **Homepage** — Hero with animated canvas effects, New Arrivals, Featured Collection, Best Sellers, Limited Drops, Why Nexora, Reviews, Newsletter
- **Shop** — Full filtering by category, size, color, price. Sorting and search
- **Product Detail** — Image gallery, size/quantity selection, reviews, related products
- **Cart** — Full cart management with quantity controls
- **Checkout** — Egyptian governorates, city dropdowns, phone validation, Cash on Delivery
- **Track Order** — Real-time order status tracking with visual progress
- **Drops** — Editorial archive of limited edition collections
- **Reviews** — Customer testimonials with rating breakdowns
- **Contact** — Contact form with WhatsApp integration
- **Wishlist** — Save favorite products

### Admin Dashboard (`/nexora-admin`)
- **Dashboard** — KPI stats, recent orders, alerts
- **Products** — Full CRUD with search
- **Orders** — Status management with progress flow
- **Inventory** — Stock tracking with low stock alerts
- **Reviews** — Moderation (approve/delete)
- **Coupons** — Discount code management
- **Settings** — Store configuration

### Technical Highlights
- Egyptian localization (27 governorates, cities, phone validation)
- WhatsApp integration for order confirmation
- SEO optimized (meta tags, Open Graph, Twitter Cards, sitemap, robots.txt)
- Responsive design (mobile-first)
- Smooth animations (Framer Motion)
- Custom splash screen entry experience
- Kinetic marquee and canvas glow effects

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v7 |
| State | Zustand (persistent stores) |
| Forms | React Hook Form + Zod |
| Backend | Firebase (Firestore + Auth + Storage) |
| Animations | Framer Motion |
| Icons | Lucide React |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore, Authentication (Email/Password), and Storage
3. Copy `.env.example` to `.env` and fill in your Firebase credentials
4. Deploy Firestore rules: `firebase deploy --only firestore:rules`
5. Create an admin user in Firebase Authentication
6. Add the admin UID to the `admins` collection in Firestore

## Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Project Structure

```
src/
  components/
    layout/         # Navbar, Footer, AdminLayout, Sidebar
    ui/             # ProductCard, StarRating, Marquee, etc.
    forms/          # Form components
  sections/
    home/           # Hero, NewArrivals, Featured, etc.
  pages/            # All page components
  stores/           # Zustand stores
  firebase/         # Firebase config & helpers
  lib/              # Utils, constants, validators
  types/            # TypeScript definitions
public/
  assets/           # Images, logos
  robots.txt
  sitemap.xml
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## License

MIT — NEXORA 2024
