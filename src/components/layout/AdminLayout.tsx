// ============================================================
// NEXORA V3.4 — Hidden Studio Layout
// /studio and /admin are link-only, protected by Studio PIN + Firebase Admin auth.
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';
import StudioGate from '@/components/admin/StudioGate';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import { useAuthStore } from '@/stores/authStore';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();
  const isStudioRoot = location.pathname === '/nexora-admin/' || location.pathname === '/nexora-admin';

  if (isStudioRoot) return <Navigate to="/nexora-admin/dashboard" replace />;

  return (
    <StudioGate>
      {isLoading ? (
        <div className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)] flex items-center justify-center">
          <div className="v34-admin-panel px-8 py-6 text-center">
            <img src="/assets/nexora-logo.png" alt="NEXORA" className="mx-auto h-14 w-14 object-contain v34-logo-img" />
            <p className="v3-kicker mt-5">Loading Studio</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <AdminLoginPage />
      ) : (
        <div className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)]">
          <AdminSidebar />
          <main className="lg:ml-64 min-h-screen">
            <div className="p-4 lg:p-8">{children}</div>
          </main>
        </div>
      )}
    </StudioGate>
  );
}
