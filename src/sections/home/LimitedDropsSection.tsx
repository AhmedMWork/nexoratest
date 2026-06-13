// ============================================================
// NEXORA — Limited Drops Section
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Timer, ArrowRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function LimitedDropsSection() {
  const [drops, setDrops] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts({ isLimitedDrop: true }).then(setDrops);
  }, []);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #121212 50%, #0a0a0a 100%)',
        }}
      />
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <SectionReveal>
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-4 h-4 text-[#ffaa33]" />
              <p className="nexora-caption text-[#ffaa33]">Limited Availability</p>
            </div>
            <h2 className="nexora-heading-md mb-6">
              LIMITED
              <br />
              <span className="text-[#ffaa33]">DROPS</span>
            </h2>
            <p className="text-sm text-[#888] max-w-md mb-8 leading-relaxed">
              Exclusive pieces produced in limited quantities. Once they are gone,
              they are gone forever. Each drop is numbered and crafted with the
              same obsessive attention to detail.
            </p>
            <Link
              to="/shop?filter=limited"
              className="nexora-button-primary inline-flex items-center gap-2"
            >
              Shop Limited Drops
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </SectionReveal>

          {/* Right — Product Cards */}
          <div className="space-y-4">
            {drops.map((product, i) => (
              <SectionReveal key={product.slug} delay={0.1 + i * 0.1}>
                <Link
                  to={`/product/${product.slug}`}
                  className="group flex items-center gap-4 bg-[#121212] border border-[#1e1e1e] hover:border-[#ffaa33]/30 transition-all p-4"
                >
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#0a0a0a]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#555] mb-1">
                      {product.category} — Only {product.sizes.reduce((sum, s) => sum + s.stock, 0)} left
                    </p>
                    <h3 className="text-sm font-bold text-[#f3f3f3] group-hover:text-[#ffaa33] transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#ffaa33] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#333] group-hover:text-[#ffaa33] transition-colors flex-shrink-0" />
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
