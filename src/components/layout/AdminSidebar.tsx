// ============================================================
// NEXORA — Admin Sidebar Navigation
// ============================================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Star,
  Tag,
  Settings,
  BadgePercent,
  CalendarClock,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import { ADMIN_NAV_LINKS } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Star,
  Tag,
  Settings,
  BadgePercent,
  CalendarClock,
};

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/nexora-admin');
    } catch {
      toast.error('Logout failed');
    }
  };

  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-screen bg-[#050505] border-r border-[#17171a]
    transition-all duration-300 flex flex-col
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#0b0b0d] border border-[#202024] text-[#f4f0e8]"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#17171a] h-16">
          {!isCollapsed && (
            <Link to="/nexora-admin/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/nexora-logo.png"
                alt="NEXORA"
                className="h-7 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#b8b0a3]">ADMIN</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-[#8a8175] hover:text-[#f4f0e8] transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-200 rounded ${
                  isActive
                    ? 'bg-[#c8a96a]/10 text-[#c8a96a] border-l-2 border-[#c8a96a]'
                    : 'text-[#8a8175] hover:text-[#f4f0e8] hover:bg-[#17171a]'
                }`}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Store + Logout */}
        <div className="p-2 border-t border-[#17171a] space-y-1">
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-xs font-medium tracking-wider uppercase text-[#8a8175] hover:text-[#c8a96a] hover:bg-[#17171a] transition-all rounded"
          >
            <ExternalLink className="w-4 h-4" />
            {!isCollapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-xs font-medium tracking-wider uppercase text-[#8a8175] hover:text-red-400 hover:bg-red-400/5 transition-all rounded"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
