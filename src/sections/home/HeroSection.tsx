// ============================================================
// NEXORA — Hero Section
// ============================================================

import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Canvas-based animated glow belt effect
function GlowBelt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const lines: { x: number; y: number; speed: number; opacity: number; width: number }[] = [];
    for (let i = 0; i < 20; i++) {
      lines.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.3,
        width: 0.5 + Math.random() * 2,
      });
    }

    const animate = () => {
      time += 0.01;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Draw ember lines
      lines.forEach((line) => {
        line.y -= line.speed;
        if (line.y < -10) {
          line.y = h + 10;
          line.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + Math.sin(time + line.y * 0.01) * 20, line.y - 30);
        ctx.strokeStyle = `rgba(255, 170, 51, ${line.opacity * (0.5 + 0.5 * Math.sin(time * 2 + line.x))})`;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      // Draw pulsing glow center
      const centerX = w * 0.5;
      const centerY = h * 0.6;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, w * 0.4
      );
      gradient.addColorStop(0, `rgba(255, 170, 51, ${0.08 + 0.04 * Math.sin(time * 3)})`);
      gradient.addColorStop(0.5, `rgba(255, 170, 51, ${0.03 + 0.02 * Math.sin(time * 2)})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated glow belt background */}
      <GlowBelt />

      {/* Content Grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 py-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-[70vh]">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* Glow ring behind model */}
              <div className="absolute inset-0 -m-8 lg:-m-16">
                <div
                  className="w-full h-full rounded-full opacity-30 blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,170,51,0.3) 0%, transparent 70%)',
                  }}
                />
              </div>
              <img
                src="/assets/hero-model.jpg"
                alt="NEXORA Model"
                className="relative z-10 w-full max-w-md lg:max-w-lg mx-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Right — Typography */}
          <div className="flex flex-col justify-center lg:pl-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="nexora-caption text-[#ffaa33] mb-4"
            >
              Summer 2024 Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="nexora-heading-lg mb-6"
            >
              THE
              <br />
              <span className="text-[#ffaa33]">SUMMER</span>
              <br />
              DROP.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-8"
            >
              <p className="text-5xl lg:text-7xl font-black text-[#f3f3f3]/10 tracking-tight">
                25% OFF
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-sm text-[#888] max-w-sm mb-10 leading-relaxed"
            >
              Elevated essentials crafted with precision. Premium organic cotton,
              architectural fits, and finishes that define the new standard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="nexora-button-primary flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/drops"
                className="nexora-button"
              >
                View Drops
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 gradient-overlay-bottom pointer-events-none" />
    </section>
  );
}
