// ============================================================
// NEXORA — Splash Screen (Entry Gate)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';

export default function SplashScreen() {
  const { isSplashSeen, setSplashSeen } = useUIStore();
  const [phase, setPhase] = useState<'idle' | 'entering' | 'complete'>('idle');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isSplashSeen) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setPhase('idle');
    }, 500);

    return () => clearTimeout(timer);
  }, [isSplashSeen]);

  const handleEnter = useCallback(() => {
    setPhase('entering');
    setTimeout(() => {
      setPhase('complete');
      setSplashSeen();
      setTimeout(() => setIsVisible(false), 800);
    }, 600);
  }, [setSplashSeen]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center cursor-pointer"
          onClick={handleEnter}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Radial burst on enter */}
          <AnimatePresence>
            {phase === 'entering' && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,170,51,0) 0%, transparent 0%)' }}
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(255,170,51,1) 0%, transparent 10%)',
                    'radial-gradient(circle at 50% 50%, rgba(255,170,51,0.8) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 50%, rgba(255,170,51,0) 0%, transparent 100%)',
                  ],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Content */}
          <motion.div
            className="flex flex-col items-center gap-8"
            animate={{
              scale: phase === 'entering' ? 1.5 : 1,
              opacity: phase === 'entering' ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.05, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: 'easeOut',
              }}
              className="relative"
            >
              <motion.img
                src="/assets/nexora-logo.png"
                alt="NEXORA"
                className="h-32 w-auto object-contain"
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(255,170,51,0.3))',
                    'drop-shadow(0 0 40px rgba(255,170,51,0.5))',
                    'drop-shadow(0 0 20px rgba(255,170,51,0.3))',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 -m-4 rounded-full border border-[#ffaa33]/20"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[10px] tracking-[0.5em] uppercase text-[#555]"
            >
              Built Different.
            </motion.p>

            {/* Tap to Enter */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.5, 1] }}
              transition={{
                delay: 1,
                duration: 2,
                repeat: Infinity,
                times: [0, 0.2, 0.7, 0.8, 1],
              }}
              className="mt-4 text-xs tracking-[0.3em] uppercase text-[#ffaa33]/70 hover:text-[#ffaa33] transition-colors"
            >
              Tap To Enter
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
