# NEXORA — Technical Specification

## Architecture Overview

Single-Page Application (SPA) built with Vite + React 19 + TypeScript. Client-side routing via React Router v7. Firebase services provide the entire backend (Firestore, Authentication, Storage). All business logic lives in the browser, with Firebase Security Rules enforcing data integrity.

### Architecture Pattern
**Frontend SPA → Firebase Client SDK → Firebase Cloud Services**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI | React 19 + TypeScript + Tailwind CSS | Component tree, styling, responsive layout |
| Routing | React Router v7 | Declarative routing, protected routes, route guards |
| State | Zustand | Global state: cart, wishlist, UI, recently viewed |
| Forms | React Hook Form + Zod | Form handling, validation schemas |
| Animations | Framer Motion + GSAP | Page transitions, scroll animations, micro-interactions |
| Backend | Firebase (Firestore + Auth + Storage) | Database, auth, file storage |
| Icons | Lucide React | Consistent icon system |
| Notifications | React Hot Toast | User feedback toasts |

---

## Routing Structure

| Route | Page | Access |
|-------|------|--------|
| `/` | SplashScreen (entry gate) → redirects to Home | Public |
| `/home` | HomePage | Public |
| `/shop` | ShopPage | Public |
| `/shop/:category` | ShopPage (filtered) | Public |
| `/product/:slug` | ProductDetailPage | Public |
| `/drops` | DropsPage | Public |
| `/reviews` | ReviewsPage | Public |
| `/contact` | ContactPage | Public |
| `/wishlist` | WishlistPage | Public |
| `/cart` | CartPage | Public |
| `/checkout` | CheckoutPage | Public |
| `/track-order` | TrackOrderPage | Public |
| `/nexora-admin` | AdminLoginPage | Public (auth gate) |
| `/nexora-admin/dashboard` | AdminDashboard | Protected (admin only) |
| `/nexora-admin/products` | AdminProducts | Protected |
| `/nexora-admin/orders` | AdminOrders | Protected |
| `/nexora-admin/inventory` | AdminInventory | Protected |
| `/nexora-admin/reviews` | AdminReviews | Protected |
| `/nexora-admin/coupons` | AdminCoupons | Protected |
| `/nexora-admin/settings` | AdminSettings | Protected |
| `*` | NotFoundPage | Public |

---

## Component Inventory

### Layout Components (shared across pages)

| Component | Source | Notes |
|-----------|--------|-------|
| AppLayout | Custom | Wraps all pages: Navbar + Footer + ToastProvider + Lenis scroll |
| Navbar | Custom | Fixed top nav with logo, links, cart/wishlist counters, mobile hamburger |
| Footer | Custom | Newsletter signup, links, social, brand mark |
| PageTransition | Custom (Framer Motion) | Full-screen wipe transition between routes |
| CustomCursor | Custom | Amber dot cursor, expands on interactive elements |
| SplashScreen | Custom | Entry gate: animated logo + "Tap to Enter" |

### Reusable Components

| Component | Used In | Purpose |
|-----------|---------|---------|
| ProductCard | Home, Shop, Related Products | Image, name, price, quick-add hover |
| ProductGrid | Home, Shop | Masonry/dense grid layout |
| ImageGallery | ProductDetail | Thumbnail carousel + zoom |
| SizeSelector | ProductDetail, QuickView | Size selection with visual feedback |
| QuantitySelector | ProductDetail, Cart | +/- stepper |
| StarRating | ProductDetail, Reviews | 5-star display |
| SkeletonLoader | All pages | Loading state placeholders |
| EmptyState | Cart, Wishlist, Orders | Illustration + message when no data |
| SectionReveal | All sections | Scroll-triggered fade-in animation wrapper |

### Page Sections (Homepage)

| Section | Key Features |
|---------|-------------|
| HeroSection | Split layout: 3D belt canvas (left) + typography (right) |
| NewArrivalsSection | 3-column masonry product grid |
| FeaturedCollectionSection | Editorial asymmetric layout with featured products |
| BestSellersSection | Horizontal scrolling product strip |
| LimitedDropsSection | CTA banner with countdown timer |
| WhyNexoraSection | Brand value proposition with icons |
| ReviewsSection | Customer testimonials carousel |
| NewsletterSection | Email capture with dramatic typography |

### Admin Components

| Component | Purpose |
|-----------|---------|
| AdminLayout | Sidebar nav + top bar + content area |
| AdminSidebar | Navigation links for all admin sections |
| StatCard | Dashboard KPI cards |
| DataTable | Sortable, filterable table for products/orders/reviews |
| ProductForm | Full CRUD form for products |
| OrderStatusUpdater | Dropdown to change order status |
| ImageUploader | Drag-and-drop image upload to Firebase Storage |
| CouponForm | Create/edit coupon codes |

---

## State Management (Zustand)

### Store: `useCartStore`
```typescript
interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```
- Persisted to localStorage
- Cart accessible from all pages via Navbar counter

### Store: `useWishlistStore`
```typescript
interface WishlistState {
  items: string[]; // product IDs
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}
```
- Persisted to localStorage
- Used on ProductCard (heart icon), ProductDetail, WishlistPage

### Store: `useRecentlyViewedStore`
```typescript
interface RecentlyViewedState {
  products: string[]; // product slugs, max 8
  addProduct: (slug: string) => void;
}
```
- Persisted to localStorage
- Displayed on ProductDetailPage

### Store: `useUIStore`
```typescript
interface UIState {
  isSplashSeen: boolean;
  isMenuOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  isLoading: boolean;
  toast: ToastConfig | null;
}
```

### Store: `useAuthStore`
```typescript
interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

---

## Firebase Data Architecture

### Collections

#### `products`
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: 'men' | 'women';
  collection: string; // e.g., 'summer-2024', 'core'
  images: string[]; // Firebase Storage URLs
  sizes: SizeInventory[];
  colors: string[];
  materials: string[];
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedDrop: boolean;
  rating: number;
  reviewCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface SizeInventory {
  size: string; // 'S' | 'M' | 'L' | 'XL' | 'XXL'
  stock: number;
  lowStockThreshold: number;
}
```

#### `orders`
```typescript
interface Order {
  id: string;
  orderNumber: string; // e.g., "NXR-240613-XXXX"
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    governorate: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  trackingUpdates: TrackingUpdate[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: Timestamp;
}
```

#### `reviews`
```typescript
interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  images?: string[];
  isApproved: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  createdAt: Timestamp;
}
```

#### `coupons`
```typescript
interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage or fixed amount
  minOrderAmount: number;
  maxUses: number;
  usesCount: number;
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}
```

#### `newsletterSubscribers`
```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Timestamp;
  isActive: boolean;
}
```

#### `contactMessages`
```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}
```

#### `siteSettings`
```typescript
interface SiteSettings {
  id: string;
  storeName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  announcements: Announcement[];
  updatedAt: Timestamp;
}

interface Announcement {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  startDate: Timestamp;
  endDate: Timestamp;
}
```

#### `admins`
```typescript
interface Admin {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

---

## Key Technical Decisions

### 1. Why Vite Instead of Next.js
The build environment uses Vite + React SPA. We achieve SEO through:
- Pre-rendered `index.html` with comprehensive meta tags
- Dynamic Open Graph tags injected at build time
- `robots.txt` and sitemap in `/public`
- Client-side meta updates via `react-helmet-async`

### 2. Firebase Direct Client Access (No API Routes)
Instead of Next.js API routes, we use Firebase Client SDK directly. Security is enforced via:
- **Firebase Authentication** for admin login
- **Firestore Security Rules** preventing unauthorized writes
- **Zod validation** on all form inputs before submission
- Admin operations check `auth.token.admin === true`

### 3. Image Strategy
- **Hero/Brand images**: Generated AI images, stored in `/public/assets/`
- **Product images**: Uploaded via Admin panel to Firebase Storage
- **Optimization**: All images served as WebP with lazy loading via `loading="lazy"` and `IntersectionObserver`
- **Responsive**: `srcset` attributes for different breakpoints

### 4. Egyptian Localization
- **Governorates**: Hardcoded array of 27 Egyptian governorates with cities
- **Phone validation**: Regex pattern for Egyptian mobile numbers (`^(01)[0-2,5]{1}[0-9]{8}$`)
- **Currency**: EGP (Egyptian Pound) throughout
- **WhatsApp**: Direct integration with `wa.me/` links
- **RTL support**: CSS logical properties for potential Arabic locale

### 5. Payment Flow
- **Cash on Delivery**: Default option, no integration needed
- **Paymob Ready**: Placeholder UI component with "Coming Soon" badge
- **Stripe Ready**: Placeholder UI component with "Coming Soon" badge
- Order confirmation generates unique order number format: `NXR-YYMMDD-XXXX`

### 6. Inventory Management
- Stock decremented atomically via Firebase transaction
- Overselling prevented by checking stock before order creation
- Low stock alerts displayed in admin dashboard
- Stock updates happen in Cloud Function (emulated locally if needed)

---

## Animation Implementation Plan

| Animation | Library | Implementation | Complexity |
|-----------|---------|---------------|------------|
| Splash Screen (logo pulse + radial burst) | Framer Motion | AnimatePresence + scale/opacity keyframes | Medium |
| Page Transitions (geometric wipe) | Framer Motion | Custom variants with clip-path | Medium |
| Scroll Reveal (SectionReveal) | Framer Motion | whileInView + viewport detection | Low |
| Product Card Hover | CSS + Framer Motion | scale transform + overlay slide | Low |
| Navbar Scroll Behavior | Framer Motion | useScroll + useTransform hooks | Low |
| Hero Typography (Slit-Scan) | GSAP + SplitText | Per-character skew/scale animation | High |
| Luminous Treadmill Belt | Three.js + Meshline | WebGL canvas with custom shaders | High |
| Kinetic Stripe Marquee | CSS | Pure CSS keyframe animation | Low |
| Scroll-Driven Bokeh Fog | Three.js | Particle system linked to Lenis scroll | High |
| Devotional Ring | Three.js | Cylinder geometry with custom vertex shader | High |
| Terminal Purge (Text Scramble) | Vanilla JS + GSAP | Custom scramble algorithm + radial wipe | Medium |
| Custom Cursor | Framer Motion | useMotionValue + spring physics | Medium |

**Priority**: Low complexity animations implemented first. Three.js effects (Belt, Fog, Ring) implemented as dedicated canvas components with `pointer-events: none`.

---

## Form Validation Schemas (Zod)

### Checkout Form
```typescript
const checkoutSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^(01)[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
  governorate: z.string().min(1, "Please select a governorate"),
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "card"]),
});
```

### Contact Form
```typescript
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});
```

### Product Form (Admin)
```typescript
const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.enum(["men", "women"]),
  sizes: z.array(z.object({
    size: z.string(),
    stock: z.number().int().min(0),
  })),
  // ... etc
});
```

---

## Project File Structure

```
/mnt/agents/output/app/
├── public/
│   ├── assets/
│   │   ├── nexora-logo.png
│   │   ├── nexora-logo-white.png
│   │   ├── hero-model.png
│   │   └── products/          # Generated product images
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── main.tsx               # Entry point, Lenis init
│   ├── App.tsx                # Router setup, layout wrapper
│   ├── index.css              # Global styles, Tailwind directives
│   ├── types/
│   │   └── index.ts           # All TypeScript interfaces
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │   ├── recentlyViewedStore.ts
│   │   ├── uiStore.ts
│   │   └── authStore.ts
│   ├── firebase/
│   │   ├── config.ts          # Firebase initialization
│   │   ├── auth.ts            # Auth functions
│   │   ├── db.ts              # Firestore CRUD helpers
│   │   └── storage.ts         # Storage upload helpers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── ui/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── SectionReveal.tsx
│   │   │   ├── Marquee.tsx
│   │   │   ├── CustomCursor.tsx
│   │   │   └── SplashScreen.tsx
│   │   └── forms/
│   │       ├── CheckoutForm.tsx
│   │       ├── ContactForm.tsx
│   │       ├── ProductForm.tsx
│   │       ├── CouponForm.tsx
│   │       └── LoginForm.tsx
│   ├── sections/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── NewArrivalsSection.tsx
│   │   │   ├── FeaturedCollectionSection.tsx
│   │   │   ├── BestSellersSection.tsx
│   │   │   ├── LimitedDropsSection.tsx
│   │   │   ├── WhyNexoraSection.tsx
│   │   │   ├── ReviewsSection.tsx
│   │   │   └── NewsletterSection.tsx
│   │   └── shop/
│   │       ├── ShopSidebar.tsx
│   │       └── ProductStream.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── DropsPage.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── TrackOrderPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── admin/
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminInventory.tsx
│   │       ├── AdminReviews.tsx
│   │       ├── AdminCoupons.tsx
│   │       └── AdminSettings.tsx
│   ├── hooks/
│   │   ├── useScrollReveal.ts
│   │   ├── useLenis.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLockBodyScroll.ts
│   │   └── useDebounce.ts
│   ├── lib/
│   │   ├── utils.ts             # cn() helper, formatters
│   │   ├── constants.ts         # Governorates, colors, sizes
│   │   ├── validators.ts        # Zod schemas
│   │   └── egyptData.ts         # Egyptian governorates + cities
│   └── effects/
│       ├── TreadmillBelt.tsx    # Three.js hero background
│       ├── BokehFog.tsx         # Three.js bokeh particles
│       ├── DevotionalRing.tsx   # Three.js text cylinder
│       └── TextScramble.tsx     # Scramble text utility
├── firestore.rules              # Firestore security rules
├── storage.rules                # Storage security rules
├── index.html                   # Entry HTML with SEO meta
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example
└── package.json
```

---

## Performance Strategy

### Target: 95+ Lighthouse across all categories

1. **Code Splitting**
   - Route-based lazy loading via `React.lazy()` + `Suspense`
   - Admin bundle separated from public bundle
   - Three.js effects loaded only when needed

2. **Image Optimization**
   - WebP format for all images
   - Responsive `srcset` for product images
   - Lazy loading via `IntersectionObserver`
   - Blur-up placeholder technique

3. **Font Loading**
   - Self-hosted fonts (Clash Display, Inter)
   - `font-display: swap` to prevent FOIT
   - Subset fonts for used characters only

4. **Caching**
   - Firebase data cached with stale-while-revalidate
   - Product list cached for 5 minutes
   - Static assets have long cache headers via Vite

5. **Bundle Size**
   - Tree-shake unused Three.js modules
   - Import only used Lucide icons
   - Dynamic import for heavy components

6. **Critical Rendering**
   - Inline critical CSS in `index.html`
   - Preload hero image and fonts
   - Defer non-critical JavaScript

---

## SEO Implementation

### Meta Tags (index.html)
- Title, description, canonical URL
- Open Graph: og:title, og:description, og:image, og:type, og:url
- Twitter Cards: twitter:card, twitter:title, twitter:description, twitter:image
- Structured data: Organization, WebSite, Store schemas

### Dynamic SEO (react-helmet-async)
- Product pages: Product schema with price, availability, rating
- Category pages: CollectionPage schema
- Each page updates title and meta description

### Files in /public
- `robots.txt`: Allow all, point to sitemap
- `sitemap.xml`: Static sitemap with all routes

---

## Security Implementation

### Firebase Authentication
- Email/password auth for admin access
- Firebase Auth state persistence (session)
- Route guards redirect unauthenticated users from admin

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: public read, admin-only write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }
    
    // Orders: customer read (by phone), admin full access
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
      allow read: if resource.data.customer.phone == request.resource.data.phone;
      allow create: if request.resource.data.keys().hasAll(['customer', 'items', 'total']);
    }
    
    // Admins: self-read only
    match /admins/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Input Validation
- All forms validated with Zod before Firebase submission
- Phone numbers validated against Egyptian format
- XSS prevention via React's built-in escaping
- File uploads restricted to images, max 5MB

---

## Development Workflow

### Phase 1: Foundation
1. Initialize project with webapp-building skill
2. Install additional dependencies
3. Set up Firebase configuration
4. Create type definitions
5. Set up Zustand stores
6. Configure routing
7. Create layout components

### Phase 2: Public Pages
1. Splash screen + page transitions
2. Navbar + Footer
3. Homepage (all sections)
4. Shop page with filters
5. Product detail page
6. Cart + Checkout flow
7. Supporting pages (Drops, Reviews, Contact, Track Order)

### Phase 3: Admin Dashboard
1. Admin login + route guards
2. Dashboard overview
3. Product CRUD
4. Order management
5. Review moderation
6. Coupon management
7. Settings

### Phase 4: Polish
1. All animations and effects
2. SEO optimization
3. Performance tuning
4. Responsive design
5. Accessibility audit

### Phase 5: QA + Deployment
1. Run all verification commands
2. Fix any errors
3. Generate assets
4. Create documentation
5. Deploy
