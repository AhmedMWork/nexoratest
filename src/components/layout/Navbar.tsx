// ============================================================
// NEXORA — Navbar
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { NAV_LINKS } from '@/lib/constants';
import ThemeLanguageControls from './ThemeLanguageControls';
import { useI18n } from '@/i18n/I18nProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const cartCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.95)']
  );
  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(51, 51, 51, 0)', 'rgba(51, 51, 51, 0.5)']
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getNavLabel = (href: string, fallback: string) => {
    const keyMap: Record<string, string> = {
      '/': 'nav.home',
      '/shop': 'nav.shop',
      '/drops': 'nav.drops',
      '/reviews': 'nav.reviews',
      '/contact': 'nav.contact',
    };
    return t(keyMap[href] || fallback);
  };

  const submitSearch = () => {
    const q = searchTerm.trim();
    if (!q) return;
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const isHome = location.pathname === '/';
  if (isHome && !isScrolled) return null;

  return (
    <>
      <motion.header
        style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      >
        <nav className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/assets/nexora-logo.png"
                alt="NEXORA"
                className="h-8 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span className="hidden sm:inline text-xs font-bold tracking-[0.3em] text-[#f3f3f3]/80">
                NEXORA
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
                    location.pathname.startsWith(link.href)
                      ? 'text-[#ffaa33]'
                      : 'text-[#888] hover:text-[#f3f3f3]'
                  }`}
                >
                  {getNavLabel(link.href, link.label)}
                  {location.pathname.startsWith(link.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[#ffaa33]"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden md:block"><ThemeLanguageControls compact /></div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#888] hover:text-[#ffaa33] transition-colors"
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-[#888] hover:text-[#ffaa33] transition-colors"
                aria-label={t('nav.wishlist')}
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ffaa33] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-[#888] hover:text-[#ffaa33] transition-colors"
                aria-label={t('nav.cart')}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ffaa33] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#888] hover:text-[#f3f3f3] transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]"
          >
            <div className="flex flex-col h-full px-6 py-6">
              <div className="flex items-center justify-between mb-12">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src="/assets/nexora-logo.png"
                    alt="NEXORA"
                    className="h-8 w-auto object-contain brightness-0 invert"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#888] hover:text-[#f3f3f3]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1">
                {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-[#1e1e1e]"
                    >
                      <span className="text-2xl font-bold tracking-wide text-[#f3f3f3]/80 group-hover:text-[#ffaa33] transition-colors">
                        {getNavLabel(link.href, link.label)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#333] group-hover:text-[#ffaa33] transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[#1e1e1e]">
                <div className="flex justify-center mb-5"><ThemeLanguageControls /></div>
                <div className="flex items-center gap-6 justify-center">
                  <Link to="/cart" className="flex items-center gap-2 text-sm text-[#888]">
                    <ShoppingBag className="w-4 h-4" />
                    {t('nav.cart')} ({cartCount})
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 text-sm text-[#888]">
                    <Heart className="w-4 h-4" />
                    {t('nav.wishlist')} ({wishlistCount})
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-xl flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-6">
              <div className="flex items-center gap-4 mb-8">
                <Search className="w-6 h-6 text-[#ffaa33]" />
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); if (e.key === 'Escape') setIsSearchOpen(false); }}
                  autoFocus
                  className="flex-1 bg-transparent text-2xl font-light text-[#f3f3f3] placeholder:text-[#444] outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-[#888] hover:text-[#f3f3f3]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="nexora-divider" />
              <p className="mt-6 text-sm text-[#555]">
                {t('nav.pressEsc')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
