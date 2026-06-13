// ============================================================
// NEXORA — Main Application Router
// ============================================================

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import AppLayout from '@/components/layout/AppLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import PageTransition from '@/components/layout/PageTransition';
import SplashScreen from '@/components/ui/SplashScreen';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { initAuthListener } from '@/stores/authStore';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/i18n/I18nProvider';

// ─── Lazy-loaded Pages ───
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const DropsPage = lazy(() => import('@/pages/DropsPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const InfoPage = lazy(() => import('@/pages/info/InfoPage'));

// ─── Lazy-loaded Admin Pages ───
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons'));
const AdminPromotions = lazy(() => import('@/pages/admin/AdminPromotions'));
const AdminDrops = lazy(() => import('@/pages/admin/AdminDrops'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

// ─── Scroll to top on route change ───
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── Loading Fallback ───
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <SkeletonLoader type="page" />
    </div>
  );
}

// ─── Public Routes ───
function PublicRoutes() {
  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/shop/:category" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/product/:slug" element={<PageTransition><ProductDetailPage /></PageTransition>} />
          <Route path="/drops" element={<PageTransition><DropsPage /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
          <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
          <Route path="/info/:slug" element={<PageTransition><InfoPage /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Admin Routes ───
function AdminRoutes() {
  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PageTransition><AdminLoginPage /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
          <Route path="/products" element={<PageTransition><AdminProducts /></PageTransition>} />
          <Route path="/orders" element={<PageTransition><AdminOrders /></PageTransition>} />
          <Route path="/inventory" element={<PageTransition><AdminInventory /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><AdminReviews /></PageTransition>} />
          <Route path="/coupons" element={<PageTransition><AdminCoupons /></PageTransition>} />
          <Route path="/promotions" element={<PageTransition><AdminPromotions /></PageTransition>} />
          <Route path="/drops" element={<PageTransition><AdminDrops /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}

// ─── Main App ───
export default function App() {
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SplashScreen />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#121212',
              color: '#f3f3f3',
              border: '1px solid #333',
              borderRadius: '0',
              fontSize: '0.85rem',
            },
            success: {
              iconTheme: {
                primary: '#ffaa33',
                secondary: '#0a0a0a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0a0a0a',
              },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/nexora-admin/*" element={<AdminRoutes />} />
            <Route path="*" element={<PublicRoutes />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
        </HelmetProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
