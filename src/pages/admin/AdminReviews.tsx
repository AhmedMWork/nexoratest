// ============================================================
// NEXORA — Admin Reviews Page
// Firestore moderation: approve, feature, delete
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Star, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import type { Review } from '@/types';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const { getReviews } = await import('@/firebase/db');
      setReviews(await getReviews());
    } catch {
      toast.error('Could not load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const filteredReviews = useMemo(() => {
    if (filter === 'approved') return reviews.filter((r) => r.isApproved);
    if (filter === 'pending') return reviews.filter((r) => !r.isApproved);
    return reviews;
  }, [reviews, filter]);

  const approveReviewById = async (id: string) => {
    try {
      const { approveReview } = await import('@/firebase/db');
      await approveReview(id);
      setReviews((current) => current.map((r) => r.id === id ? { ...r, isApproved: true } : r));
      toast.success('Review approved');
    } catch {
      toast.error('Could not approve review');
    }
  };

  const deleteReviewById = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const { deleteReview } = await import('@/firebase/db');
      await deleteReview(id);
      setReviews((current) => current.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Could not delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f3f3f3]">Reviews</h1>
          <p className="text-xs text-[#555] mt-1">{reviews.filter((r) => !r.isApproved).length} pending approval</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-colors ${
                filter === f ? 'border-[#ffaa33] text-[#ffaa33]' : 'border-[#222] text-[#555] hover:border-[#444]'
              }`}
            >
              {f}
            </button>
          ))}
          <button onClick={loadReviews} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#555] bg-[#121212] border border-[#1e1e1e]">Loading reviews...</div>
        ) : filteredReviews.length ? filteredReviews.map((review) => (
          <div key={review.id} className={`p-5 bg-[#121212] border ${review.isApproved ? 'border-[#1e1e1e]' : 'border-amber-500/20'} transition-all`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-[#ffaa33] fill-[#ffaa33]' : 'text-[#333]'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#f3f3f3] font-medium">{review.title}</span>
                </div>
                <p className="text-[10px] text-[#555]">by {review.customerName} — {review.productName}</p>
              </div>
              <div className="flex items-center gap-2">
                {!review.isApproved && (
                  <button onClick={() => approveReviewById(review.id)} className="p-1.5 text-green-400 hover:text-green-300" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteReviewById(review.id)} className="p-1.5 text-[#555] hover:text-red-400" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">{review.body}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-[10px] text-[#555]">{review.helpfulCount || 0} found helpful</span>
              {review.isFeatured && <span className="text-[10px] px-2 py-0.5 bg-[#ffaa33]/10 text-[#ffaa33] uppercase tracking-wider">Featured</span>}
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-xs text-[#555] bg-[#121212] border border-[#1e1e1e]">No reviews found</div>
        )}
      </div>
    </div>
  );
}
