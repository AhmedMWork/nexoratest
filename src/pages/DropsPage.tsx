// ============================================================
// NEXORA — Drops Page (Archive)
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { formatPrice } from '@/lib/utils';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';

export default function DropsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts().then(setProducts);
  }, []);

  const drops = useMemo(() => [
    {
      id: 'summer-2024',
      name: 'Summer 2024 Drop',
      date: 'June 2024',
      description: 'Our biggest summer collection yet. Earth tones, organic fabrics, and architectural silhouettes designed for the Egyptian heat.',
      image: products.find((p) => p.collection === 'summer-2024')?.images[0] || '/assets/products/men-sage-tee.jpg',
      products: products.filter((p) => p.collection === 'summer-2024'),
      featured: true,
    },
    {
      id: 'core-collection',
      name: 'Core Collection',
      date: 'Ongoing',
      description: 'The foundation of NEXORA. Timeless pieces in essential colors that form the backbone of your wardrobe. Always available.',
      image: products.find((p) => p.collection === 'core')?.images[0] || '/assets/products/men-black-tee.jpg',
      products: products.filter((p) => p.collection === 'core'),
      featured: false,
    },
  ], [products]);

  return (
    <>
      <Helmet>
        <title>Drops | NEXORA — Limited Edition Collections</title>
        <meta name="description" content="Explore NEXORA's limited edition drops and core collection. Premium summer t-shirts." />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#0a0a0a] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#ffaa33] mb-3">Collections</p>
            <h1 className="nexora-heading-md mb-4">THE DROPS</h1>
            <p className="text-sm text-[#888] max-w-lg mb-12">
              Each drop tells a story. Limited quantities, unlimited quality. Once they are gone, they are gone.
            </p>
          </SectionReveal>

          <div className="space-y-16">
            {drops.map((drop, i) => (
              <SectionReveal key={drop.id} delay={i * 0.1}>
                <div className={`grid lg:grid-cols-2 gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`relative aspect-[4/3] overflow-hidden bg-[#121212] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img src={drop.image} alt={drop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
                    {drop.featured && (
                      <span className="absolute top-4 left-4 bg-[#ffaa33] text-[#0a0a0a] text-[9px] font-bold px-3 py-1.5 tracking-wider uppercase">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className={`flex flex-col justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-[#555]" />
                      <span className="text-xs text-[#555]">{drop.date}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#f3f3f3] mb-4">{drop.name}</h2>
                    <p className="text-sm text-[#888] leading-relaxed mb-6">{drop.description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <Tag className="w-3.5 h-3.5 text-[#555]" />
                      <span className="text-xs text-[#555]">{drop.products.length} products</span>
                    </div>
                    <Link to="/shop" className="nexora-button inline-flex items-center gap-2 w-fit">
                      Shop Collection
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
                  {drop.products.slice(0, 4).map((product) => (
                    <Link key={product.id} to={`/product/${product.slug}`} className="group bg-[#121212] border border-[#1e1e1e] hover:border-[#333] transition-all">
                      <div className="aspect-square overflow-hidden">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-[#f3f3f3] group-hover:text-[#ffaa33] transition-colors truncate">{product.name}</p>
                        <p className="text-[10px] text-[#ffaa33] mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
