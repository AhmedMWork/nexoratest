// ============================================================
// NEXORA — Firestore Database Helpers
// Production storefront + complete admin operations layer
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  arrayUnion,
  addDoc,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './config';
import type {
  Product,
  Order,
  Review,
  Coupon,
  Promotion,
  Drop,
  InventoryLog,
  AuditLog,
  NewsletterSubscriber,
  ContactMessage,
  SiteSettings,
  OrderStatus,
} from '@/types';
import { normalizePhone } from '@/lib/utils';

function now() {
  return new Date();
}

function cleanUndefined<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
}

// ─── Products ───
const productsRef = collection(db, 'products');

export async function getProducts(filters?: {
  category?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedDrop?: boolean;
  includeHidden?: boolean;
}): Promise<Product[]> {
  const conditions: ReturnType<typeof where>[] = [];
  if (!filters?.includeHidden) conditions.push(where('status', 'in', ['active', 'sold_out']));
  if (filters?.category) conditions.push(where('category', '==', filters.category));
  if (filters?.isFeatured) conditions.push(where('isFeatured', '==', true));
  if (filters?.isNewArrival) conditions.push(where('isNewArrival', '==', true));
  if (filters?.isBestSeller) conditions.push(where('isBestSeller', '==', true));
  if (filters?.isLimitedDrop) conditions.push(where('isLimitedDrop', '==', true));

  const q = conditions.length > 0
    ? query(productsRef, ...conditions, orderBy('createdAt', 'desc'))
    : query(productsRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Product));
}

export async function getAdminProducts(): Promise<Product[]> {
  const q = query(productsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(productsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
  if (product.status && !['active', 'sold_out'].includes(product.status)) return null;
  return product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newDoc = doc(productsRef);
  await setDoc(newDoc, cleanUndefined({ ...product, createdAt: now(), updatedAt: now() }));
  await createAuditLog({ action: 'product.created', entityType: 'product', entityId: newDoc.id, after: product });
  return newDoc.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const before = await getProductById(id).catch(() => null);
  await updateDoc(doc(db, 'products', id), cleanUndefined({ ...data, updatedAt: now() }));
  await createAuditLog({ action: 'product.updated', entityType: 'product', entityId: id, before, after: data });
}

export async function deleteProduct(id: string): Promise<void> {
  const before = await getProductById(id).catch(() => null);
  await deleteDoc(doc(db, 'products', id));
  await createAuditLog({ action: 'product.deleted', entityType: 'product', entityId: id, before });
}

// ─── Orders ───
const ordersRef = collection(db, 'orders');

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newDoc = doc(ordersRef);
  await setDoc(newDoc, cleanUndefined({
    ...order,
    customer: { ...order.customer, phone: normalizePhone(order.customer.phone) },
    createdAt: now(),
    updatedAt: now(),
  }));
  return newDoc.id;
}

export async function createOrderWithStockTransaction(
  order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ orderId: string; orderNumber: string; totals: { subtotal: number; shippingFee: number; discount: number; total: number } }> {
  const createCheckoutOrder = httpsCallable<
    { order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> },
    { orderId: string; orderNumber: string; totals: { subtotal: number; shippingFee: number; discount: number; total: number } }
  >(functions, 'createCheckoutOrder');

  const response = await createCheckoutOrder({
    order: { ...order, customer: { ...order.customer, phone: normalizePhone(order.customer.phone) } },
  });

  return response.data;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const q = query(ordersRef, where('orderNumber', '==', orderNumber), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
}

export async function getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<Order | null> {
  const trackCustomerOrder = httpsCallable<{ orderNumber: string; phone: string }, { order: Order | null }>(functions, 'trackCustomerOrder');
  const response = await trackCustomerOrder({ orderNumber, phone: normalizePhone(phone) });
  return response.data.order;
}

export async function getOrders(): Promise<Order[]> {
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Order));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, message?: string, updatedBy = 'admin'): Promise<void> {
  const trackingMessage = message || getDefaultTrackingMessage(status);
  try {
    const updateStatus = httpsCallable<{ orderId: string; status: OrderStatus; message: string; updatedBy: string }, { ok: boolean }>(functions, 'updateOrderStatus');
    await updateStatus({ orderId, status, message: trackingMessage, updatedBy });
  } catch (error) {
    if (import.meta.env.PROD) throw error;
    // Fallback for local emulator/front-end-only development. Production rules still require admin auth.
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: now(),
      trackingUpdates: arrayUnion({ status, message: trackingMessage, timestamp: now(), updatedBy }),
    });
    await createAuditLog({ action: 'order.status_updated', entityType: 'order', entityId: orderId, after: { status, message: trackingMessage } });
  }
}

function getDefaultTrackingMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    pending: 'Order received. Awaiting confirmation.',
    confirmed: 'Order confirmed. We are preparing it now.',
    preparing: 'Your order is being prepared.',
    packed: 'Your order is packed and ready for shipping.',
    shipped: 'Your order has been shipped.',
    out_for_delivery: 'Your order is out for delivery.',
    delivered: 'Your order has been delivered.',
    cancelled: 'Your order has been cancelled.',
    returned: 'Your order has been marked as returned.',
    failed: 'Order could not be completed.',
  };
  return messages[status];
}

// ─── Coupons ───
const couponsRef = collection(db, 'coupons');

export async function getCoupons(): Promise<Coupon[]> {
  const q = query(couponsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Coupon));
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const q = query(couponsRef, where('code', '==', code.trim().toUpperCase()), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;
}

export async function validateCouponForCart(payload: { code: string; items: Array<{ productId: string; size: string; quantity: number }>; subtotal: number }): Promise<{ valid: boolean; code?: string; discount: number; freeShipping?: boolean; message: string }> {
  const validateCoupon = httpsCallable<typeof payload, { valid: boolean; code?: string; discount: number; freeShipping?: boolean; message: string }>(functions, 'validateCoupon');
  const response = await validateCoupon({ ...payload, code: payload.code.trim().toUpperCase() });
  return response.data;
}

export async function createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = doc(couponsRef);
  await setDoc(newDoc, cleanUndefined({ ...coupon, code: coupon.code.toUpperCase(), usedCount: coupon.usedCount || 0, createdAt: now(), updatedAt: now() }));
  await createAuditLog({ action: 'coupon.created', entityType: 'coupon', entityId: newDoc.id, after: coupon });
  return newDoc.id;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
  await updateDoc(doc(db, 'coupons', id), cleanUndefined({ ...data, code: data.code?.toUpperCase(), updatedAt: now() }));
  await createAuditLog({ action: 'coupon.updated', entityType: 'coupon', entityId: id, after: data });
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', id));
  await createAuditLog({ action: 'coupon.deleted', entityType: 'coupon', entityId: id });
}

// ─── Promotions ───
const promotionsRef = collection(db, 'promotions');

export async function getPromotions(): Promise<Promotion[]> {
  const q = query(promotionsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Promotion));
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const q = query(promotionsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Promotion));
}

export async function createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = doc(promotionsRef);
  await setDoc(newDoc, cleanUndefined({ ...promotion, createdAt: now(), updatedAt: now() }));
  await createAuditLog({ action: 'promotion.created', entityType: 'promotion', entityId: newDoc.id, after: promotion });
  return newDoc.id;
}

export async function updatePromotion(id: string, data: Partial<Promotion>): Promise<void> {
  await updateDoc(doc(db, 'promotions', id), cleanUndefined({ ...data, updatedAt: now() }));
  await createAuditLog({ action: 'promotion.updated', entityType: 'promotion', entityId: id, after: data });
}

export async function deletePromotion(id: string): Promise<void> {
  await deleteDoc(doc(db, 'promotions', id));
  await createAuditLog({ action: 'promotion.deleted', entityType: 'promotion', entityId: id });
}

// ─── Drops ───
const dropsRef = collection(db, 'drops');

export async function getDrops(includeArchived = true): Promise<Drop[]> {
  const q = includeArchived ? query(dropsRef, orderBy('launchDate', 'desc')) : query(dropsRef, where('status', 'in', ['scheduled', 'live', 'ended']), orderBy('launchDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Drop));
}

export async function createDrop(drop: Omit<Drop, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = doc(dropsRef);
  await setDoc(newDoc, cleanUndefined({ ...drop, createdAt: now(), updatedAt: now() }));
  await createAuditLog({ action: 'drop.created', entityType: 'drop', entityId: newDoc.id, after: drop });
  return newDoc.id;
}

export async function updateDrop(id: string, data: Partial<Drop>): Promise<void> {
  await updateDoc(doc(db, 'drops', id), cleanUndefined({ ...data, updatedAt: now() }));
  await createAuditLog({ action: 'drop.updated', entityType: 'drop', entityId: id, after: data });
}

export async function deleteDrop(id: string): Promise<void> {
  await deleteDoc(doc(db, 'drops', id));
  await createAuditLog({ action: 'drop.deleted', entityType: 'drop', entityId: id });
}

// ─── Reviews ───
const reviewsRef = collection(db, 'reviews');

export async function getReviews(filters?: { productId?: string; isApproved?: boolean; isFeatured?: boolean }): Promise<Review[]> {
  const conditions: ReturnType<typeof where>[] = [];
  if (filters?.productId) conditions.push(where('productId', '==', filters.productId));
  if (filters?.isApproved !== undefined) conditions.push(where('isApproved', '==', filters.isApproved));
  if (filters?.isFeatured) conditions.push(where('isFeatured', '==', true));
  const q = conditions.length > 0 ? query(reviewsRef, ...conditions, orderBy('createdAt', 'desc')) : query(reviewsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Review));
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = doc(reviewsRef);
  await setDoc(newDoc, cleanUndefined({ ...review, createdAt: now() }));
  await createAuditLog({ action: 'review.created', entityType: 'review', entityId: newDoc.id, after: review });
  return newDoc.id;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  await updateDoc(doc(db, 'reviews', id), cleanUndefined(data));
  await createAuditLog({ action: 'review.updated', entityType: 'review', entityId: id, after: data });
}

export async function approveReview(id: string): Promise<void> { await updateReview(id, { isApproved: true }); }
export async function deleteReview(id: string): Promise<void> { await deleteDoc(doc(db, 'reviews', id)); }

// ─── Newsletter ───
const newsletterRef = collection(db, 'newsletterSubscribers');

export async function subscribeNewsletter(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  await setDoc(doc(newsletterRef, encodeURIComponent(normalizedEmail)), { email: normalizedEmail, subscribedAt: now(), isActive: true }, { merge: true });
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const q = query(newsletterRef, orderBy('subscribedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as NewsletterSubscriber));
}

// ─── Contact Messages ───
const contactRef = collection(db, 'contactMessages');

export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
  await addDoc(contactRef, { ...message, isRead: false, createdAt: now() });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(contactRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ContactMessage));
}

// ─── Site Settings ───
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const docSnap = await getDoc(doc(db, 'siteSettings', 'default'));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, 'siteSettings', 'default'), cleanUndefined({ ...data, updatedAt: now() }), { merge: true });
  await createAuditLog({ action: 'settings.updated', entityType: 'siteSettings', entityId: 'default', after: data });
}

// ─── Inventory Management ───
export async function updateProductStock(productId: string, size: string, quantity: number, reason: InventoryLog['reason'] = 'manual_adjustment', note?: string): Promise<void> {
  const product = await getProductById(productId);
  if (!product) throw new Error('Product not found');
  const sizeIndex = product.sizes.findIndex((s) => s.size === size);
  if (sizeIndex === -1) throw new Error('Size not found');
  const previousStock = product.sizes[sizeIndex].stock;
  const newStock = previousStock + quantity;
  if (newStock < 0) throw new Error('Insufficient stock');
  const updatedSizes = [...product.sizes];
  updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: newStock };
  await updateProduct(productId, { sizes: updatedSizes, status: updatedSizes.reduce((sum, s) => sum + s.stock, 0) <= 0 ? 'sold_out' : product.status === 'sold_out' ? 'active' : product.status });
  await createInventoryLog({ productId, sku: product.sku, size, change: quantity, reason, previousStock, newStock, note });
}

export async function createInventoryLog(log: Omit<InventoryLog, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = await addDoc(collection(db, 'inventoryLogs'), { ...log, createdAt: now() });
  return newDoc.id;
}

export async function getInventoryLogs(productId?: string): Promise<InventoryLog[]> {
  const q = productId ? query(collection(db, 'inventoryLogs'), where('productId', '==', productId), orderBy('createdAt', 'desc')) : query(collection(db, 'inventoryLogs'), orderBy('createdAt', 'desc'), limit(200));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as InventoryLog));
}

// ─── Audit Logs ───
export async function createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<string> {
  const newDoc = await addDoc(collection(db, 'auditLogs'), { ...log, createdAt: now() });
  return newDoc.id;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), limit(300));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as AuditLog));
}

// ─── Dashboard Stats ───
export async function getDashboardStats(): Promise<{ totalOrders: number; totalRevenue: number; totalProducts: number; pendingOrders: number; lowStockProducts: number; activeCoupons: number; liveDrops: number; activePromotions: number }> {
  const [ordersSnapshot, productsSnapshot, couponsSnapshot, dropsSnapshot, promotionsSnapshot] = await Promise.all([
    getDocs(ordersRef),
    getDocs(productsRef),
    getDocs(couponsRef),
    getDocs(dropsRef),
    getDocs(promotionsRef),
  ]);
  const orders = ordersSnapshot.docs.map((d) => d.data() as Order);
  const products = productsSnapshot.docs.map((d) => d.data() as Product);
  return {
    totalOrders: orders.length,
    totalRevenue: orders.filter((o) => !['cancelled', 'failed'].includes(o.status)).reduce((sum, o) => sum + Number(o.total || 0), 0),
    totalProducts: products.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    lowStockProducts: products.filter((p) => p.sizes?.some((s) => s.stock <= s.lowStockThreshold)).length,
    activeCoupons: couponsSnapshot.docs.filter((d) => d.data().isActive === true).length,
    liveDrops: dropsSnapshot.docs.filter((d) => d.data().status === 'live').length,
    activePromotions: promotionsSnapshot.docs.filter((d) => d.data().status === 'active').length,
  };
}

// ─── Seed Data ───
export async function seedDatabase(products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
  const batch = writeBatch(db);
  for (const product of products) batch.set(doc(productsRef), { ...product, status: product.status || 'active', visibility: product.visibility || 'public', createdAt: now(), updatedAt: now() });
  await batch.commit();
}
