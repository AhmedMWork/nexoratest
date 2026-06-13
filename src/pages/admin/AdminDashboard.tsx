// ============================================================
// NEXORA — Admin Dashboard
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatPrice, formatTimestamp, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Order, Product } from '@/types';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [{ getOrders }, { loadProducts }] = await Promise.all([
          import('@/firebase/db'),
          import('@/services/productService'),
        ]);
        const [orders, products] = await Promise.all([getOrders(), loadProducts()]);
        if (!mounted) return;
        const deliveredOrActive = orders.filter((o: Order) => o.status !== 'cancelled' && o.status !== 'returned');
        const totalRevenue = deliveredOrActive.reduce((sum: number, o: Order) => sum + o.total, 0);
        const customers = new Set(orders.map((o: Order) => o.customer.phone));
        const lowStockCount = products.filter((p: Product) => p.sizes.some((s) => s.stock <= s.lowStockThreshold)).length;
        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customers.size,
          pendingOrders: orders.filter((o: Order) => o.status === 'pending').length,
          lowStockCount,
          recentOrders: orders.slice(0, 5),
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-[#ffaa33]' },
    { label: 'Total Orders', value: String(stats.totalOrders), icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Products', value: String(stats.totalProducts), icon: Package, color: 'text-purple-400' },
    { label: 'Customers', value: String(stats.totalCustomers), icon: Users, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold tracking-wider uppercase text-[#f3f3f3]">Dashboard</h1>
        <p className="text-xs text-[#555] mt-1">{isLoading ? 'Loading store performance...' : 'Overview of your store performance'}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="p-5 bg-[#121212] border border-[#1e1e1e]">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-[10px] text-[#555] uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#f3f3f3]">{card.value}</p>
          </div>
        ))}
      </div>

      {stats.pendingOrders > 0 && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-amber-400">{stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? 's' : ''} require attention</p>
          <Link to="/nexora-admin/orders" className="ml-auto text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider">View Orders</Link>
        </div>
      )}

      {stats.lowStockCount > 0 && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs text-red-400">{stats.lowStockCount} product{stats.lowStockCount !== 1 ? 's' : ''} with low stock</p>
          <Link to="/nexora-admin/inventory" className="ml-auto text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider">View Inventory</Link>
        </div>
      )}

      <div className="bg-[#121212] border border-[#1e1e1e]">
        <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#f3f3f3]">Recent Orders</h2>
          <Link to="/nexora-admin/orders" className="text-[10px] text-[#ffaa33] hover:text-[#ffbb44] uppercase tracking-wider flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Order</th>
                <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Total</th>
                <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Status</th>
                <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length ? stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#1e1e1e]/50 hover:bg-[#1e1e1e]/30 transition-colors">
                  <td className="p-4 text-xs text-[#ffaa33] font-medium">{order.orderNumber}</td>
                  <td className="p-4 text-xs text-[#f3f3f3]">{order.customer.fullName}</td>
                  <td className="p-4 text-xs text-[#f3f3f3]">{formatPrice(order.total)}</td>
                  <td className="p-4"><span className={`status-badge ${getStatusColor(order.status)} text-[9px]`}>{getStatusLabel(order.status)}</span></td>
                  <td className="p-4 text-xs text-[#555]">{formatTimestamp(order.createdAt)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-8 text-center text-xs text-[#555]">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Add Product', desc: 'Create new product listing', href: '/nexora-admin/products' },
          { label: 'Manage Orders', desc: 'View and process orders', href: '/nexora-admin/orders' },
          { label: 'Store Settings', desc: 'Configure your store', href: '/nexora-admin/settings' },
        ].map((action) => (
          <Link key={action.label} to={action.href} className="p-5 bg-[#121212] border border-[#1e1e1e] hover:border-[#333] transition-all group">
            <h3 className="text-xs font-bold text-[#f3f3f3] group-hover:text-[#ffaa33] transition-colors mb-1">{action.label}</h3>
            <p className="text-[10px] text-[#555]">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
