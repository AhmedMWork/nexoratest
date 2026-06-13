// ============================================================
// NEXORA — Why Nexora Section
// ============================================================

import { motion } from 'framer-motion';
import { Diamond, Ruler, Heart, Leaf } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';

const values = [
  {
    icon: Diamond,
    title: 'Premium Fabrics',
    description: 'Sourced from the finest mills. Egyptian cotton, organic blends, and innovative sustainable materials that feel as good as they look.',
  },
  {
    icon: Ruler,
    title: 'Precision Fit',
    description: 'Engineered patterns with meticulous attention to proportions. Every size fits intentionally, not accidentally.',
  },
  {
    icon: Heart,
    title: 'Local Craftsmanship',
    description: 'Proudly designed and manufactured in Egypt. Supporting local artisans and communities with fair wages.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Practice',
    description: 'Eco-conscious production with minimal waste. Packaging made from recycled materials, dyes that respect the environment.',
  },
];

export default function WhyNexoraSection() {
  return (
    <section className="py-20 lg:py-32 bg-[#0a0a0a]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionReveal className="text-center mb-16">
          <p className="nexora-caption text-[#ffaa33] mb-3">The Difference</p>
          <h2 className="nexora-heading-md">WHY NEXORA</h2>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <SectionReveal key={value.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-6 bg-[#121212] border border-[#1e1e1e] hover:border-[#ffaa33]/20 transition-all duration-300 h-full"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-[#222] group-hover:border-[#ffaa33]/30 mb-5 transition-colors">
                  <value.icon className="w-4 h-4 text-[#555] group-hover:text-[#ffaa33] transition-colors" />
                </div>
                <h3 className="text-sm font-bold tracking-wider uppercase text-[#f3f3f3] mb-3">
                  {value.title}
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
