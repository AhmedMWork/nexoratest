// ============================================================
// NEXORA V3 — Editorial Entry Gate
// ============================================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';

export default function SplashScreen() {
  const { isSplashSeen, setSplashSeen } = useUIStore();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(!isSplashSeen);

  const handleEnter = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setSplashSeen();
      setIsVisible(false);
    }, 700);
  }, [setSplashSeen]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[9999] overflow-hidden bg-[var(--v33-bg)] flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 0.75, ease: 'easeInOut' }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--v33-accent) 32%, transparent), transparent 28rem), linear-gradient(135deg, var(--v33-card) 0%, var(--v33-bg) 48%, var(--v33-bg-soft) 100%)',
          }}
        />
        <motion.div animate={{ scale: isLeaving ? 1.18 : 1, opacity: isLeaving ? 0 : 1, filter: isLeaving ? 'blur(10px)' : 'blur(0px)' }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="relative flex flex-col items-center gap-8 px-6 text-center">
          <motion.img initial={{ opacity: 0, y: 18, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }} src="/assets/nexora-logo.png" alt="NEXORA" className="h-28 sm:h-36 w-auto object-contain opacity-80 dark:brightness-0 dark:invert" />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="space-y-3">
            <p className="text-[10px] sm:text-xs tracking-[0.48em] uppercase text-[var(--v33-muted)]">Soft Luxury Editorial Commerce</p>
            <p className="max-w-sm text-sm leading-7 text-[var(--v33-muted)]">A quiet experience for modern essentials.</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.65 }} onClick={handleEnter} className="rounded-full border border-[var(--v33-accent)] bg-[var(--v33-accent)] px-9 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#2F2520] shadow-[0_24px_70px_rgba(92,74,66,0.14)] hover:bg-[var(--v33-accent-strong)] hover:text-[#FFFDF8] transition-colors">
            Enter Store
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
