// ============================================================
// NEXORA V3.3 — Limited Drops Page
// Drops are limited releases only. Core collections are excluded.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Hourglass, Sparkles, Timer } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import ProductCard from '@/components/ui/ProductCard';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';

export default function DropsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    loadProducts({ isLimitedDrop: true })
      .then((items) => { if (mounted) setProducts(items.filter((p) => p.isLimitedDrop)); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const featured = products[0];
  const totalPieces = useMemo(() => products.reduce((sum, product) => sum + product.sizes.reduce((sizeSum, size) => sizeSum + Math.max(0, size.stock), 0), 0), [products]);

  return (
    <>
      <Helmet>
        <title>Limited Drops | NEXORA</title>
        <meta name="description" content="Limited NEXORA releases. Small quantities, seasonal stories, and pieces that are not always available." />
      </Helmet>

      <main className="pt-24 pb-20 v3-page min-h-screen overflow-hidden">
        <section className="v3-shell">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8 lg:gap-12 items-center min-h-[58vh]">
            <SectionReveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="v33-limited-pill"><Sparkles className="h-3.5 w-3.5" /> Limited</span>
                <span className="v3-kicker">Not always available</span>
              </div>
              <h1 className="v3-title max-w-3xl">Limited drops, released with intention.</h1>
              <p className="v3-lead mt-6">NEXORA limited pieces are produced in controlled quantities. When a release ends, it leaves the regular store and becomes part of the archive.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="v3-btn-primary">Shop All Pieces <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/shop/unisex" className="v3-btn-secondary">Explore Unisex</Link>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.12}>
              <div className="v33-limited-hero-card">
                {featured ? (
                  <>
                    <img src={featured.images[0]} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2F2520]/78 via-[#2F2520]/20 to-transparent dark:from-[#120F0D]/88" />
                    <div className="relative z-10 mt-auto p-6 sm:p-8">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#F8F3EA]/80">Current limited piece</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#FFFDF8]">{featured.name}</h2>
                      <Link to={`/product/${featured.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F0C7B2]">View piece <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                    <Hourglass className="h-10 w-10 text-[var(--v33-accent)]" />
                    <h2 className="mt-5 text-2xl font-semibold text-[var(--v33-text)]">No limited drop is live right now.</h2>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--v33-muted)]">The next release is being prepared. Join the circle for early access.</p>
                  </div>
                )}
              </div>
            </SectionReveal>
          </div>
        </section>

        <section className="v3-shell mt-14 lg:mt-20">
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <div className="v33-stat-card"><Timer className="h-4 w-4" /><span>Limited window</span><strong>Seasonal</strong></div>
            <div className="v33-stat-card"><Sparkles className="h-4 w-4" /><span>Current pieces</span><strong>{products.length}</strong></div>
            <div className="v33-stat-card"><Hourglass className="h-4 w-4" /><span>Available stock</span><strong>{totalPieces}</strong></div>
          </div>

          <div className="v3-section-head">
            <div>
              <p className="v3-kicker">Limited releases</p>
              <h2>Available now</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-[18px] border border-[var(--v33-border)] bg-[var(--v33-card)] animate-pulse" />)}
            </div>
          ) : products.length ? (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product, i) => <ProductCard key={product.slug} product={product} index={i} />)}
            </motion.div>
          ) : (
            <div className="v33-empty-panel">
              <p>No limited drop is live right now.</p>
              <Link to="/shop" className="v3-btn-secondary mt-5">Shop core essentials</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
