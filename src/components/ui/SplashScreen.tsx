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
      <motion.div className="fixed inset-0 z-[9999] overflow-hidden bg-[#F5F0E8] dark:bg-[#171311] flex items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 0.75, ease: 'easeInOut' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(207,174,158,0.30),transparent_28rem),linear-gradient(135deg,#FAF7F2_0%,#F5F0E8_42%,#ECE4D8_100%)] dark:bg-[radial-gradient(circle_at_35%_30%,rgba(199,161,145,0.20),transparent_28rem),linear-gradient(135deg,#231D1A_0%,#171311_58%,#0F0C0B_100%)]" />
        <motion.div animate={{ scale: isLeaving ? 1.18 : 1, opacity: isLeaving ? 0 : 1, filter: isLeaving ? 'blur(10px)' : 'blur(0px)' }} transition={{ duration: 0.7, ease: 'easeInOut' }} className="relative flex flex-col items-center gap-8 px-6 text-center">
          <motion.img initial={{ opacity: 0, y: 18, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }} src="/assets/nexora-logo.png" alt="NEXORA" className="h-28 sm:h-36 w-auto object-contain opacity-80 dark:brightness-0 dark:invert" />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="space-y-3">
            <p className="text-[10px] sm:text-xs tracking-[0.48em] uppercase text-[#8A7A72] dark:text-[#BBAEA4]">Soft Luxury Editorial Commerce</p>
            <p className="max-w-sm text-sm leading-7 text-[#5C4A42]/80 dark:text-[#E9DED3]/75">A quiet experience for modern essentials.</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.65 }} onClick={handleEnter} className="rounded-full border border-[#CFAE9E] bg-[#CFAE9E] px-9 py-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#5C4A42] shadow-[0_24px_70px_rgba(92,74,66,0.14)] hover:bg-[#D9B9AA] transition-colors">
            Enter Store
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
