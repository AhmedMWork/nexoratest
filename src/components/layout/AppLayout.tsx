// ============================================================
// NEXORA — App Layout (Navbar + Footer wrapper)
// ============================================================

import { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3f3f3]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
