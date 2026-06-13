// ============================================================
// NEXORA — Footer
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FOOTER_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n/I18nProvider';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    try {
      const { subscribeNewsletter } = await import('@/firebase/db');
      await subscribeNewsletter(data.email);
      toast.success('Subscribed to NEXORA updates');
      reset();
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1e1e1e]">
      {/* Newsletter CTA */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="nexora-caption mb-4">{t('footer.newsletterCaption')}</p>
            <h3 className="nexora-heading-md mb-6">
              {t('footer.newsletterTitleA')}
              <span className="text-[#ffaa33]"> NEXORA </span>
              {t('footer.newsletterTitleB')}
            </h3>
            <p className="text-[#666] text-sm max-w-md mx-auto mb-8">
              {t('footer.newsletterText')}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full bg-[#121212] border border-[#222] px-5 py-3.5 text-sm text-[#f3f3f3] placeholder:text-[#444] focus:outline-none focus:border-[#ffaa33] transition-colors"
                />
                {errors.email && (
                  <span className="absolute -bottom-5 left-0 text-[10px] text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="nexora-button-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? '...' : t('footer.subscribe')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="nexora-divider" />

      {/* Footer Links */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src="/assets/nexora-logo.png"
                alt="NEXORA"
                className="h-10 w-auto object-contain brightness-0 invert opacity-80"
              />
            </Link>
            <p className="text-xs text-[#555] leading-relaxed mb-6 max-w-[200px]">
              {t('footer.brandText')}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 flex items-center justify-center border border-[#222] text-[#555] hover:text-[#ffaa33] hover:border-[#ffaa33] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f3f3f3] mb-5">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-[#555] hover:text-[#ffaa33] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f3f3f3] mb-5">
              {t('footer.support')}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-[#555] hover:text-[#ffaa33] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f3f3f3] mb-5">
              {t('footer.company')}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-xs text-[#555] hover:text-[#ffaa33] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="nexora-divider" />

      {/* Bottom Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-[#444] tracking-wider">
            &copy; {new Date().getFullYear()} NEXORA. Built Different.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/info/privacy" className="text-[10px] text-[#444] hover:text-[#888] transition-colors tracking-wider">
              {t('footer.privacy')}
            </Link>
            <Link to="/info/terms" className="text-[10px] text-[#444] hover:text-[#888] transition-colors tracking-wider">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
