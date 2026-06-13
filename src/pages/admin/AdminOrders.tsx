// ============================================================
// NEXORA — Admin Orders Page
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Eye, Package, ChevronDown, RefreshCw, Search } from 'lucide-react';
import { formatPrice, formatTimestamp, getStatusColor, getStatusLabel, getNextStatus } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { getOrders } = await import('@/firebase/db');
      setOrders(await getOrders());
    } catch {
      toast.error('Could not load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { updateOrderStatus } = await import('@/firebase/db');
      await updateOrderStatus(orderId, newStatus);
      setOrders((current) => current.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              updatedAt: new Date(),
              trackingUpdates: [
                ...o.trackingUpdates,
                { status: newStatus, message: `Status updated to ${getStatusLabel(newStatus)}`, timestamp: new Date(), updatedBy: 'admin' },
              ],
            }
          : o
      ));
      toast.success(`Status updated to ${getStatusLabel(newStatus)}`);
      setSelectedOrder(null);
    } catch {
      toast.error('Could not update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f3f3f3]">Orders</h1>
          <p className="text-xs text-[#555] mt-1">{orders.length} orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order, customer, phone..."
              className="w-full sm:w-72 bg-[#121212] border border-[#222] pl-10 pr-4 py-2.5 text-xs text-[#f3f3f3] placeholder:text-[#333] focus:outline-none focus:border-[#ffaa33]"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#121212] border border-[#222] px-3 py-2.5 text-xs text-[#888] focus:outline-none">
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
          <button onClick={loadOrders} className="nexora-button flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1e1e1e] overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Order #</th>
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Customer</th>
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Phone</th>
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Total</th>
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Status</th>
              <th className="p-4 text-[10px] font-medium text-[#555] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-xs text-[#555]">Loading orders...</td></tr>
            ) : filteredOrders.length ? filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#1e1e1e]/50 hover:bg-[#1e1e1e]/30 transition-colors">
                <td className="p-4 text-xs text-[#ffaa33] font-medium">{order.orderNumber}</td>
                <td className="p-4 text-xs text-[#f3f3f3]">{order.customer.fullName}</td>
                <td className="p-4 text-xs text-[#888]">{order.customer.phone}</td>
                <td className="p-4 text-xs font-medium">{formatPrice(order.total)}</td>
                <td className="p-4"><span className={`status-badge ${getStatusColor(order.status)} text-[9px]`}>{getStatusLabel(order.status)}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="p-1.5 text-[#555] hover:text-[#ffaa33] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    {getNextStatus(order.status) && (
                      <button onClick={() => updateStatus(order.id, getNextStatus(order.status)! as OrderStatus)} className="flex items-center gap-1 px-2 py-1 bg-[#ffaa33]/10 text-[#ffaa33] text-[9px] uppercase tracking-wider hover:bg-[#ffaa33]/20 transition-colors">
                        <Package className="w-3 h-3" /> {getStatusLabel(getNextStatus(order.status)!)}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-8 text-center text-xs text-[#555]">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="p-5 bg-[#121212] border border-[#1e1e1e] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#f3f3f3]">{selectedOrder.orderNumber}</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-[#555] hover:text-[#f3f3f3]"><ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e]">
              <p className="text-[#555] mb-1">Customer</p>
              <p className="text-[#f3f3f3]">{selectedOrder.customer.fullName}</p>
              <p className="text-[#888]">{selectedOrder.customer.phone}</p>
              <p className="text-[#888] mt-1">{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.governorate}</p>
            </div>
            <div className="p-3 bg-[#0a0a0a] border border-[#1e1e1e]">
              <p className="text-[#555] mb-1">Order Details</p>
              <p className="text-[#f3f3f3]">Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
              <p className="text-[#888]">Shipping: {formatPrice(selectedOrder.shippingFee)}</p>
              <p className="text-[#888]">Date: {formatTimestamp(selectedOrder.createdAt)}</p>
              <p className="text-[#ffaa33] font-bold mt-1">Total: {formatPrice(selectedOrder.total)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((status) => (
              <button key={status} onClick={() => updateStatus(selectedOrder.id, status)} className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border transition-colors ${selectedOrder.status === status ? 'border-[#ffaa33] text-[#ffaa33] bg-[#ffaa33]/5' : 'border-[#222] text-[#555] hover:border-[#444]'}`}>
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider text-[#555]">Items</h4>
            {selectedOrder.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-xs border-b border-[#1e1e1e]/50 pb-2">
                <span className="text-[#f3f3f3]">{item.name} — {item.size} x{item.quantity}</span>
                <span className="text-[#888]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
