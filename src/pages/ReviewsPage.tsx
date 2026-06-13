// ============================================================
// NEXORA — Reviews Page
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Quote, ThumbsUp } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import StarRating from '@/components/ui/StarRating';
import type { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    import('@/firebase/db')
      .then(({ getReviews }) => getReviews({ isApproved: true }))
      .then((loadedReviews) => { if (mounted) setReviews(loadedReviews); })
      .catch(() => { if (mounted) setReviews([]); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const averageRating = useMemo(() => (
    reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  ), [reviews]);
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <>
      <Helmet>
        <title>Reviews | NEXORA — Customer Testimonials</title>
        <meta name="description" content="See what customers say about NEXORA premium streetwear." />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#0a0a0a] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#ffaa33] mb-3">Testimonials</p>
            <h1 className="nexora-heading-md mb-8">CUSTOMER REVIEWS</h1>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-[#121212] border border-[#1e1e1e] mb-10">
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-[#f3f3f3]">{averageRating ? averageRating.toFixed(1) : '—'}</p>
                <StarRating rating={averageRating} size={18} className="my-2" />
                <p className="text-xs text-[#555]">Based on {reviews.length} reviews</p>
              </div>
              <div className="space-y-2">
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs text-[#888] w-3">{rating}</span>
                    <Star className="w-3 h-3 text-[#ffaa33] fill-[#ffaa33]" />
                    <div className="flex-1 h-1.5 bg-[#1e1e1e]">
                      <div className="h-full bg-[#ffaa33]" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[10px] text-[#555] w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {isLoading ? (
            <div className="p-10 text-center text-xs text-[#555] bg-[#121212] border border-[#1e1e1e]">Loading reviews...</div>
          ) : reviews.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review, i) => (
                <SectionReveal key={review.id} delay={i * 0.05}>
                  <div className="p-5 bg-[#121212] border border-[#1e1e1e] h-full">
                    <Quote className="w-5 h-5 text-[#ffaa33]/20 mb-3" />
                    <StarRating rating={review.rating} size={12} className="mb-3" />
                    <h4 className="text-sm font-semibold text-[#f3f3f3] mb-2">{review.title}</h4>
                    <p className="text-xs text-[#888] leading-relaxed mb-4">{review.body}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#f3f3f3]">{review.customerName}</p>
                        <p className="text-[10px] text-[#555]">{review.productName}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-[#555]"><ThumbsUp className="w-3 h-3" />{review.helpfulCount || 0}</span>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-[#555] bg-[#121212] border border-[#1e1e1e]">No customer reviews have been published yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
