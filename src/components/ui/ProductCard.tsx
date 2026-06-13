// ============================================================
// NEXORA — Product Card
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size;
    if (!defaultSize) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: defaultSize,
      quantity: 1,
      image: product.images[0] || '',
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: inWishlist ? '💔' : '❤️',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-[#121212] border border-[#1e1e1e] hover:border-[#333] transition-all duration-500"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
          <img
            src={product.images[0] || '/assets/nexora-logo-bg.jpg'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-[#ffaa33] text-[#0a0a0a] text-[9px] font-bold px-2 py-1 tracking-wider uppercase">
              -{discount}%
            </span>
          )}

          {/* New Badge */}
          {product.isNewArrival && !discount && (
            <span className="absolute top-3 left-3 bg-[#f3f3f3] text-[#0a0a0a] text-[9px] font-bold px-2 py-1 tracking-wider uppercase">
              New
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 transition-all duration-300 ${
              inWishlist
                ? 'bg-[#ffaa33] text-[#0a0a0a]'
                : 'bg-[#0a0a0a]/60 text-[#f3f3f3] opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 bg-[#ffaa33] text-[#0a0a0a] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#ffbb44] transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] text-[#555] tracking-[0.15em] uppercase mb-1.5">
            {product.category} — {product.collection}
          </p>
          <h3 className="text-sm font-semibold text-[#f3f3f3] mb-2 truncate group-hover:text-[#ffaa33] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#f3f3f3]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#555] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
