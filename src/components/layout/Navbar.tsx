// ============================================================
// NEXORA — Midnight Atelier Navbar
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
  Shield,
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
    [0, 80],
    ['rgba(5, 5, 5, 0.78)', 'rgba(5, 5, 5, 0.94)']
  );
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ['rgba(200, 169, 106, 0.12)', 'rgba(200, 169, 106, 0.26)']
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
      '/shop/men': 'nav.men',
      '/shop/women': 'nav.women',
      '/drops': 'nav.drops',
      '/reviews': 'nav.reviews',
      '/contact': 'nav.contact',
      '/admin': 'nav.admin',
    };
    return t(keyMap[href] || fallback);
  };

  const submitSearch = () => {
    const q = searchTerm.trim();
    if (!q) return;
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const isLinkActive = (href: string) => {
    if (href === '/shop') return location.pathname === '/shop';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <motion.header
        style={{ backgroundColor: navBg, borderBottomColor: navBorder }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-shadow duration-300 ${isScrolled ? 'shadow-[0_20px_80px_rgba(0,0,0,0.28)]' : ''}`}
      >
        <nav className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="NEXORA home">
              <span className="relative flex h-9 w-9 items-center justify-center border border-[#c8a96a]/25 bg-[#0b0b0d]/70 overflow-hidden">
                <img
                  src="/assets/nexora-logo.png"
                  alt="NEXORA"
                  className="h-7 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="text-xs font-black tracking-[0.36em] text-[#f4f0e8]">NEXORA</span>
                <span className="mt-1 text-[8px] tracking-[0.28em] uppercase text-[#b8b0a3]">Built Different</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`relative text-[11px] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ${
                      active ? 'text-[#c8a96a]' : 'text-[#b8b0a3] hover:text-[#f4f0e8]'
                    }`}
                  >
                    {getNavLabel(link.href, link.label)}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-2 left-0 right-0 h-px bg-[#c8a96a]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 lg:gap-2.5">
              <div className="hidden md:block"><ThemeLanguageControls compact /></div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-[#b8b0a3] hover:text-[#c8a96a] transition-colors"
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2.5 text-[#b8b0a3] hover:text-[#c8a96a] transition-colors"
                aria-label={t('nav.wishlist')}
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8a96a] text-[#050505] text-[9px] font-bold flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2.5 text-[#b8b0a3] hover:text-[#c8a96a] transition-colors"
                aria-label={t('nav.cart')}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8a96a] text-[#050505] text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/admin"
                className="hidden sm:inline-flex p-2.5 text-[#8a8175] hover:text-[#c8a96a] transition-colors"
                aria-label={t('nav.admin')}
                title={t('nav.admin')}
              >
                <Shield className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-[#b8b0a3] hover:text-[#f4f0e8] transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,0.14),transparent_38%),linear-gradient(180deg,rgba(23,23,26,0.5),rgba(5,5,5,1))]" />
            <div className="relative flex flex-col h-full px-6 py-6">
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="flex items-center gap-3">
                  <img
                    src="/assets/nexora-logo.png"
                    alt="NEXORA"
                    className="h-9 w-auto object-contain brightness-0 invert"
                  />
                  <span className="text-[10px] font-bold tracking-[0.28em] text-[#b8b0a3]">NEXORA</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#b8b0a3] hover:text-[#f4f0e8]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                {[{ label: 'Home', href: '/' }, ...NAV_LINKS, { label: 'Track Order', href: '/track-order' }, { label: 'Admin Access', href: '/admin' }].map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-[#17171a]"
                    >
                      <span className="text-2xl font-black tracking-wide text-[#f4f0e8]/85 group-hover:text-[#c8a96a] transition-colors">
                        {getNavLabel(link.href, link.label)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#2a2a2d] group-hover:text-[#c8a96a] transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[#17171a]">
                <div className="flex justify-center mb-5"><ThemeLanguageControls /></div>
                <div className="flex items-center gap-6 justify-center">
                  <Link to="/cart" className="flex items-center gap-2 text-sm text-[#b8b0a3]">
                    <ShoppingBag className="w-4 h-4" />
                    {t('nav.cart')} ({cartCount})
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 text-sm text-[#b8b0a3]">
                    <Heart className="w-4 h-4" />
                    {t('nav.wishlist')} ({wishlistCount})
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-xl flex items-start justify-center pt-32"
          >
            <div className="w-full max-w-2xl px-6">
              <div className="flex items-center gap-4 mb-8 border border-[#202024] bg-[#0b0b0d]/80 px-5 py-4">
                <Search className="w-5 h-5 text-[#c8a96a]" />
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); if (e.key === 'Escape') setIsSearchOpen(false); }}
                  autoFocus
                  className="flex-1 bg-transparent text-xl font-light text-[#f4f0e8] placeholder:text-[#6f675d] outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-[#b8b0a3] hover:text-[#f4f0e8]"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#8a8175]">
                {t('nav.pressEsc')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
