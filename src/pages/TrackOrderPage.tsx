// ============================================================
// NEXORA — Track Order Page
// ============================================================

import { useEffect, useState, type ElementType } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import { trackOrderSchema, type TrackOrderFormData } from '@/lib/validators';
import { getOrderByNumberAndPhone } from '@/firebase/db';
import { formatTimestamp, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import SectionReveal from '@/components/ui/SectionReveal';
import { useI18n } from '@/i18n/I18nProvider';

const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered'];

const statusIcons: Record<string, ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  returned: XCircle,
};

export default function TrackOrderPage() {
  const { t, lang } = useI18n();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrackOrderFormData>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: {
      orderNumber: searchParams.get('order') || '',
      phone: searchParams.get('phone') || '',
    },
  });

  const onSubmit = async (data: TrackOrderFormData) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await getOrderByNumberAndPhone(data.orderNumber.toUpperCase().trim(), data.phone.trim());
      if (!result) {
        setError(t('track.notFound'));
        return;
      }
      setOrder(result);
    } catch {
      setError(t('track.notFound'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderNumber = searchParams.get('order');
    const phone = searchParams.get('phone');
    if (orderNumber) setValue('orderNumber', orderNumber);
    if (phone) setValue('phone', phone);
  }, [searchParams, setValue]);

  return (
    <>
      <Helmet>
        <title>{t('track.title')} | NEXORA</title>
        <meta name="description" content="Track your NEXORA order status in real-time." />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#0a0a0a] min-h-screen">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#ffaa33] mb-3">{t('track.caption')}</p>
            <h1 className="nexora-heading-md mb-8">{t('track.title').toUpperCase()}</h1>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-10">
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 block">{t('track.orderNumber')}</label>
                <input {...register('orderNumber')} placeholder={t('track.placeholderOrder')} className="w-full bg-[#121212] border border-[#222] px-4 py-3.5 text-sm text-[#f3f3f3] placeholder:text-[#333] focus:outline-none focus:border-[#ffaa33] transition-colors uppercase" />
                {errors.orderNumber && <p className="text-[10px] text-red-400 mt-1">{errors.orderNumber.message}</p>}
              </div>
              <div>
                <label className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 block">{t('track.phone')}</label>
                <input {...register('phone')} placeholder={t('track.placeholderPhone')} className="w-full bg-[#121212] border border-[#222] px-4 py-3.5 text-sm text-[#f3f3f3] placeholder:text-[#333] focus:outline-none focus:border-[#ffaa33] transition-colors" dir="ltr" />
                {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="sm:self-end px-6 py-3.5 bg-[#ffaa33] text-[#0a0a0a] font-bold text-xs tracking-wider uppercase hover:bg-[#ffbb44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                {loading ? t('common.loading') : t('track.action')}
              </button>
            </form>
          </SectionReveal>

          {error && <div className="p-4 bg-red-400/5 border border-red-400/20 text-red-400 text-sm mb-6">{error}</div>}

          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-5 bg-[#121212] border border-[#1e1e1e]">
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div>
                    <p className="text-[10px] text-[#555] uppercase tracking-wider">{t('track.orderNumber')}</p>
                    <p className="text-lg font-bold text-[#ffaa33]">{order.orderNumber}</p>
                  </div>
                  <span className={`status-badge ${getStatusColor(order.status)}`}>{getStatusLabel(order.status, lang)}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div><p className="text-[#555]">{t('track.customer')}</p><p className="text-[#f3f3f3]">{order.customer.fullName}</p></div>
                  <div><p className="text-[#555]">{t('track.phone')}</p><p className="text-[#f3f3f3]">{order.customer.phone}</p></div>
                  <div><p className="text-[#555]">{t('track.location')}</p><p className="text-[#f3f3f3]">{order.customer.governorate}, {order.customer.city}</p></div>
                  <div><p className="text-[#555]">{t('track.payment')}</p><p className="text-[#f3f3f3] uppercase">{order.paymentMethod === 'cod' ? t('checkout.cod') : order.paymentMethod}</p></div>
                </div>
              </div>

              {order.status !== 'cancelled' && order.status !== 'returned' && (
                <div className="p-5 bg-[#121212] border border-[#1e1e1e] overflow-x-auto">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[#f3f3f3] mb-5">{t('track.progress')}</h3>
                  <div className="relative min-w-[560px]">
                    <div className="flex justify-between">
                      {statusSteps.map((step, i) => {
                        const Icon = statusIcons[step];
                        const currentIndex = statusSteps.indexOf(order.status as OrderStatus);
                        const isCompleted = i <= currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${isCompleted ? (isCurrent ? 'border-[#ffaa33] bg-[#ffaa33]/10 text-[#ffaa33]' : 'border-[#ffaa33] bg-[#ffaa33] text-[#0a0a0a]') : 'border-[#222] text-[#333]'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-[9px] mt-2 uppercase tracking-wider text-center max-w-20 ${isCompleted ? 'text-[#888]' : 'text-[#333]'}`}>{getStatusLabel(step, lang)}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#222] -translate-y-1/2">
                      <div className="h-full bg-[#ffaa33] transition-all" style={{ width: `${Math.max(0, statusSteps.indexOf(order.status as OrderStatus)) / (statusSteps.length - 1) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 bg-[#121212] border border-[#1e1e1e]">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[#f3f3f3] mb-4">{t('track.updates')}</h3>
                <div className="space-y-3">
                  {order.trackingUpdates.map((update, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#ffaa33] rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#f3f3f3]">{update.message}</p>
                        <p className="text-[10px] text-[#555]">{formatTimestamp(update.timestamp, lang === 'ar' ? 'ar-EG' : 'en-EG')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
