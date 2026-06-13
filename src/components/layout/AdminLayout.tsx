// ============================================================
// NEXORA V3 — Hidden Studio Layout
// Link-only studio mode. No public admin entry is rendered in the storefront.
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const isStudioRoot = location.pathname === '/nexora-admin/' || location.pathname === '/nexora-admin';

  if (isStudioRoot) {
    return <Navigate to="/nexora-admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-fg)]">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
