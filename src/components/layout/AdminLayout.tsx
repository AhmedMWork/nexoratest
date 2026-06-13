// ============================================================
// NEXORA — Admin Layout
// ============================================================

import { type ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === '/nexora-admin/' || location.pathname === '/nexora-admin';

  useEffect(() => {
    // Auth state is managed by the global listener in App.tsx
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c8a96a] animate-spin" />
      </div>
    );
  }

  // Not authenticated and not on login page → redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/nexora-admin" replace />;
  }

  // Authenticated on login page → redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/nexora-admin/dashboard" replace />;
  }

  // Login page without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#050505]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f0e8]">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
