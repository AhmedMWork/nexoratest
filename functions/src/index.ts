import { initializeApp } from 'firebase-admin/app';
import { DocumentReference, FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();

type ProductSize = { size: string; stock: number; lowStockThreshold?: number };
type CheckoutItem = { productId: string; size: string; quantity: number };
type CheckoutPayload = {
  order?: {
    orderNumber?: string;
    customer?: { fullName?: string; phone?: string; governorate?: string; city?: string; address?: string; notes?: string };
    items?: CheckoutItem[];
    paymentMethod?: string;
    couponCode?: string;
  };
};
type CouponDoc = {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  perCustomerLimit?: number;
  firstOrderOnly?: boolean;
  startDate?: Timestamp | Date;
  endDate?: Timestamp | Date;
  isActive?: boolean;
  status?: string;
  allowedProductIds?: string[];
  excludedProductIds?: string[];
  allowedCategories?: string[];
  excludedCategories?: string[];
  allowedCollections?: string[];
  excludedCollections?: string[];
};
type CouponResult = { valid: boolean; discount: number; freeShipping: boolean; message: string };
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'failed';

function normalizePhone(phone: string): string { return phone.replace(/\D/g, '').replace(/^20/, '0'); }
function isValidEgyptPhone(phone: string): boolean { return /^01[0125][0-9]{8}$/.test(phone); }
function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NXR-${date}-${random}`;
}
function sanitizeString(value: unknown, max = 250): string { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}
function serialize(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, serialize(v)]));
  return value;
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
async function requireAdmin(uid?: string): Promise<{ uid: string; email?: string }> {
  if (!uid) throw new HttpsError('unauthenticated', 'Admin login is required.');
  const adminSnap = await db.collection('admins').doc(uid).get();
  if (!adminSnap.exists) throw new HttpsError('permission-denied', 'Admin privileges are required.');
  return { uid, email: String(adminSnap.get('email') || '') };
}
async function findCoupon(code: string) {
  const normalized = sanitizeString(code, 40).toUpperCase();
  if (!normalized) return null;
  const snapshot = await db.collection('coupons').where('code', '==', normalized).limit(1).get();
  if (snapshot.empty) return null;
  return { ref: snapshot.docs[0].ref, id: snapshot.docs[0].id, data: snapshot.docs[0].data() as CouponDoc };
}
function calculateCouponDiscount(coupon: CouponDoc, subtotal: number, products: Array<{ id: string; category?: string; collection?: string }>): CouponResult {
  const now = new Date();
  const start = toDate(coupon.startDate);
  const end = toDate(coupon.endDate);
  if (!coupon.isActive || ['paused', 'expired', 'draft', 'archived'].includes(coupon.status || '')) return { valid: false, discount: 0, freeShipping: false, message: 'This code is not active.' };
  if (start && now < start) return { valid: false, discount: 0, freeShipping: false, message: 'This code is not active yet.' };
  if (end && now > end) return { valid: false, discount: 0, freeShipping: false, message: 'This code has expired.' };
  if ((coupon.usageLimit || 0) > 0 && (coupon.usedCount || 0) >= (coupon.usageLimit || 0)) return { valid: false, discount: 0, freeShipping: false, message: 'This code has reached its usage limit.' };
  if (subtotal < Number(coupon.minOrderAmount || 0)) return { valid: false, discount: 0, freeShipping: false, message: `Minimum order is ${coupon.minOrderAmount || 0} EGP.` };

  const ids = products.map((p) => p.id);
  if (coupon.allowedProductIds?.length && !ids.some((id) => coupon.allowedProductIds?.includes(id))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to these items.' };
  if (coupon.excludedProductIds?.length && ids.some((id) => coupon.excludedProductIds?.includes(id))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to one or more items.' };
  if (coupon.allowedCategories?.length && !products.some((p) => coupon.allowedCategories?.includes(String(p.category)))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to this category.' };
  if (coupon.excludedCategories?.length && products.some((p) => coupon.excludedCategories?.includes(String(p.category)))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to this category.' };
  if (coupon.allowedCollections?.length && !products.some((p) => coupon.allowedCollections?.includes(String(p.collection)))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to this collection.' };
  if (coupon.excludedCollections?.length && products.some((p) => coupon.excludedCollections?.includes(String(p.collection)))) return { valid: false, discount: 0, freeShipping: false, message: 'This code does not apply to this collection.' };

  let discount = 0;
  const freeShipping = coupon.type === 'free_shipping';
  if (coupon.type === 'percentage') discount = Math.round(subtotal * (Number(coupon.value || 0) / 100));
  if (coupon.type === 'fixed') discount = Number(coupon.value || 0);
  if (coupon.maxDiscountAmount && coupon.type === 'percentage') discount = Math.min(discount, Number(coupon.maxDiscountAmount));
  discount = Math.max(0, Math.min(discount, subtotal));
  return { valid: true, discount, freeShipping, message: freeShipping ? 'Free shipping applied.' : 'Code applied.' };
}

export const validateCoupon = onCall({ region: 'europe-west1' }, async (request) => {
  const code = sanitizeString((request.data as { code?: string }).code, 40).toUpperCase();
  const items = Array.isArray((request.data as { items?: CheckoutItem[] }).items) ? (request.data as { items: CheckoutItem[] }).items : [];
  const subtotal = Number((request.data as { subtotal?: number }).subtotal || 0);
  if (!code) throw new HttpsError('invalid-argument', 'Coupon code is required.');
  if (!items.length || subtotal <= 0) throw new HttpsError('invalid-argument', 'Cart is required.');

  const coupon = await findCoupon(code);
  if (!coupon) return { valid: false, discount: 0, freeShipping: false, message: 'Invalid code.' };

  const productRefs = items.map((item) => db.collection('products').doc(sanitizeString(item.productId, 120)));
  const productSnaps = await Promise.all(productRefs.map((ref) => ref.get()));
  const products = productSnaps.filter((s) => s.exists).map((snap) => ({ id: snap.id, category: snap.get('category'), collection: snap.get('collection') }));
  return { code, ...calculateCouponDiscount(coupon.data, subtotal, products) };
});

export const createCheckoutOrder = onCall({ region: 'europe-west1' }, async (request) => {
  const incomingOrder = (request.data as CheckoutPayload).order;
  if (!incomingOrder) throw new HttpsError('invalid-argument', 'Order payload is required.');

  const customer = incomingOrder.customer || {};
  const fullName = sanitizeString(customer.fullName, 80);
  const phone = normalizePhone(sanitizeString(customer.phone, 30));
  const governorate = sanitizeString(customer.governorate, 80);
  const city = sanitizeString(customer.city, 80);
  const address = sanitizeString(customer.address, 250);
  const notes = sanitizeString(customer.notes, 300);
  const items = Array.isArray(incomingOrder.items) ? incomingOrder.items : [];
  const couponCode = sanitizeString(incomingOrder.couponCode, 40).toUpperCase();

  if (fullName.length < 2) throw new HttpsError('invalid-argument', 'Full name is required.');
  if (!isValidEgyptPhone(phone)) throw new HttpsError('invalid-argument', 'A valid Egyptian phone number is required.');
  if (!governorate || !city || address.length < 5) throw new HttpsError('invalid-argument', 'A complete shipping address is required.');
  if (incomingOrder.paymentMethod !== 'cod') throw new HttpsError('invalid-argument', 'Only cash on delivery is currently available.');
  if (items.length === 0 || items.length > 30) throw new HttpsError('invalid-argument', 'Order items are required.');

  const normalizedItems = items.map((item) => ({ productId: sanitizeString(item.productId, 120), size: sanitizeString(item.size, 20).toUpperCase(), quantity: Number(item.quantity) }));
  normalizedItems.forEach((item) => {
    if (!item.productId || !item.size || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new HttpsError('invalid-argument', 'Invalid order item.');
  });

  const orderRef = db.collection('orders').doc();
  const settingsRef = db.collection('siteSettings').doc('default');
  const serverTime = FieldValue.serverTimestamp();
  let orderNumber = sanitizeString(incomingOrder.orderNumber, 30);
  if (!/^NXR-\d{6}-[A-Z0-9]{4}$/.test(orderNumber)) orderNumber = generateOrderNumber();
  let totals = { subtotal: 0, shippingFee: 0, discount: 0, total: 0 };

  await db.runTransaction(async (transaction) => {
    const duplicate = await transaction.get(db.collection('orders').where('orderNumber', '==', orderNumber).limit(1));
    if (!duplicate.empty) orderNumber = generateOrderNumber();

    const settingsSnap = await transaction.get(settingsRef);
    const shippingFee = Number(settingsSnap.get('shippingFee') ?? 60);
    const freeShippingThreshold = Number(settingsSnap.get('freeShippingThreshold') ?? 1500);

    const productRefs = normalizedItems.map((item) => db.collection('products').doc(item.productId));
    const productSnaps = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

    let couponRef: DocumentReference | null = null;
    let couponData: CouponDoc | null = null;
    if (couponCode) {
      const couponSnap = await transaction.get(db.collection('coupons').where('code', '==', couponCode).limit(1));
      if (couponSnap.empty) throw new HttpsError('failed-precondition', 'Invalid coupon code.');
      couponRef = couponSnap.docs[0].ref;
      couponData = couponSnap.docs[0].data() as CouponDoc;
      if (couponData.firstOrderOnly) {
        const previousOrders = await transaction.get(db.collection('orders').where('customer.phone', '==', phone).limit(1));
        if (!previousOrders.empty) throw new HttpsError('failed-precondition', 'This code is valid for first orders only.');
      }
      if ((couponData.perCustomerLimit || 0) > 0) {
        const previousCouponOrders = await transaction.get(db.collection('orders').where('customer.phone', '==', phone).where('couponCode', '==', couponCode).limit(Number(couponData.perCustomerLimit)));
        if (previousCouponOrders.size >= Number(couponData.perCustomerLimit)) throw new HttpsError('failed-precondition', 'This code has reached your usage limit.');
      }
    }

    let subtotal = 0;
    const couponProducts: Array<{ id: string; category?: string; collection?: string }> = [];
    const productUpdates: Array<{ ref: DocumentReference; sizes: ProductSize[]; totalStock: number; previousStock: number; newStock: number; item: { size: string; quantity: number }; sku: string; status: unknown }> = [];
    const orderItems = productSnaps.map((snapshot, index) => {
      const item = normalizedItems[index];
      if (!snapshot.exists) throw new HttpsError('failed-precondition', 'Product not found.');
      const product = snapshot.data() as Record<string, unknown>;
      if (!['active', undefined].includes(product.status as string | undefined)) throw new HttpsError('failed-precondition', 'Product is not available.');
      const sizes = (product.sizes as ProductSize[] | undefined) || [];
      const sizeIndex = sizes.findIndex((entry) => entry.size.toUpperCase() === item.size);
      if (sizeIndex === -1) throw new HttpsError('failed-precondition', `Size ${item.size} is not available.`);
      const selectedSize = sizes[sizeIndex];
      if (selectedSize.stock < item.quantity) throw new HttpsError('failed-precondition', `Only ${selectedSize.stock} left in size ${item.size}.`);
      const unitPrice = Number(product.price || 0);
      if (unitPrice <= 0) throw new HttpsError('failed-precondition', 'Product price is not available.');
      subtotal += unitPrice * item.quantity;
      couponProducts.push({ id: productRefs[index].id, category: String(product.category || ''), collection: String(product.collection || '') });
      const updatedSizes = [...sizes];
      const previousStock = selectedSize.stock;
      updatedSizes[sizeIndex] = { ...selectedSize, stock: previousStock - item.quantity };
      const totalStock = updatedSizes.reduce((sum, s) => sum + Number(s.stock || 0), 0);
      productUpdates.push({ ref: productRefs[index], sizes: updatedSizes, totalStock, previousStock, newStock: previousStock - item.quantity, item, sku: String(product.sku || ''), status: product.status });
      return { productId: productRefs[index].id, name: String(product.name || 'NEXORA Product'), slug: String(product.slug || ''), price: unitPrice, size: item.size, quantity: item.quantity, image: Array.isArray(product.images) ? String(product.images[0] || '') : '' };
    });

    let discount = 0;
    let freeShippingByCoupon = false;
    if (couponData && couponRef) {
      const result = calculateCouponDiscount(couponData, subtotal, couponProducts);
      if (!result.valid) throw new HttpsError('failed-precondition', result.message);
      discount = result.discount;
      freeShippingByCoupon = result.freeShipping;
    }

    const finalShippingFee = subtotal >= freeShippingThreshold || freeShippingByCoupon ? 0 : shippingFee;
    const total = Math.max(0, subtotal - discount + finalShippingFee);
    totals = { subtotal, shippingFee: finalShippingFee, discount, total };

    for (const update of productUpdates) {
      transaction.update(update.ref, { sizes: update.sizes, status: update.totalStock <= 0 ? 'sold_out' : update.status || 'active', updatedAt: serverTime });
      transaction.set(db.collection('inventoryLogs').doc(), { productId: update.ref.id, sku: update.sku, size: update.item.size, change: -update.item.quantity, reason: 'order_created', previousStock: update.previousStock, newStock: update.newStock, orderId: orderRef.id, createdAt: serverTime });
    }

    transaction.set(orderRef, {
      orderNumber,
      customer: { fullName, phone, governorate, city, address, notes },
      items: orderItems,
      subtotal,
      shippingFee: finalShippingFee,
      discount,
      couponCode: couponCode || null,
      total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'pending',
      source: 'web',
      trackingUpdates: [{ status: 'pending', message: 'Order received. Awaiting confirmation.', timestamp: new Date(), updatedBy: 'system' }],
      createdAt: serverTime,
      updatedAt: serverTime,
    });
    if (couponRef) transaction.update(couponRef, { usedCount: FieldValue.increment(1), updatedAt: serverTime });
    transaction.set(db.collection('auditLogs').doc(), { action: 'order.created', entityType: 'order', entityId: orderRef.id, after: { orderNumber, total, couponCode }, createdAt: serverTime });
  });

  return { orderId: orderRef.id, orderNumber, totals };
});

export const updateOrderStatus = onCall({ region: 'europe-west1' }, async (request) => {
  const admin = await requireAdmin(request.auth?.uid);
  const orderId = sanitizeString((request.data as { orderId?: string }).orderId, 120);
  const status = sanitizeString((request.data as { status?: string }).status, 40) as OrderStatus;
  const message = sanitizeString((request.data as { message?: string }).message, 180) || getDefaultTrackingMessage(status);
  const allowedStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'failed'];
  if (!orderId || !allowedStatuses.includes(status)) throw new HttpsError('invalid-argument', 'Valid order id and status are required.');

  const orderRef = db.collection('orders').doc(orderId);
  const serverTime = FieldValue.serverTimestamp();

  await db.runTransaction(async (transaction) => {
    const orderSnap = await transaction.get(orderRef);
    if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found.');
    const order = orderSnap.data() as Record<string, unknown>;
    const previousStatus = String(order.status || 'pending') as OrderStatus;
    const isRestockStatus = ['cancelled', 'returned'].includes(status);
    const wasAlreadyRestocked = ['cancelled', 'returned'].includes(previousStatus);
    const orderItems = Array.isArray(order.items) ? order.items as Array<{ productId: string; size: string; quantity: number }> : [];

    const productRefs = isRestockStatus && !wasAlreadyRestocked ? orderItems.map((item) => db.collection('products').doc(String(item.productId))) : [];
    const productSnaps = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

    transaction.update(orderRef, {
      status,
      updatedAt: serverTime,
      trackingUpdates: FieldValue.arrayUnion({ status, message, timestamp: new Date(), updatedBy: admin.uid }),
    });

    if (isRestockStatus && !wasAlreadyRestocked) {
      productSnaps.forEach((productSnap, index) => {
        if (!productSnap.exists) return;
        const item = orderItems[index];
        const product = productSnap.data() as Record<string, unknown>;
        const sizes = (product.sizes as ProductSize[] | undefined) || [];
        const sizeIndex = sizes.findIndex((entry) => entry.size.toUpperCase() === String(item.size).toUpperCase());
        if (sizeIndex === -1) return;
        const previousStock = Number(sizes[sizeIndex].stock || 0);
        const returnedQty = Number(item.quantity || 0);
        const updatedSizes = [...sizes];
        updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: previousStock + returnedQty };
        const totalStock = updatedSizes.reduce((sum, s) => sum + Number(s.stock || 0), 0);
        transaction.update(productRefs[index], { sizes: updatedSizes, status: totalStock > 0 ? 'active' : 'sold_out', updatedAt: serverTime });
        transaction.set(db.collection('inventoryLogs').doc(), { productId: productRefs[index].id, sku: String(product.sku || ''), size: item.size, change: returnedQty, reason: status === 'returned' ? 'return_received' : 'order_cancelled', previousStock, newStock: previousStock + returnedQty, orderId, adminId: admin.uid, createdAt: serverTime });
      });
    }

    transaction.set(db.collection('auditLogs').doc(), { adminId: admin.uid, adminEmail: admin.email || '', action: 'order.status_updated', entityType: 'order', entityId: orderId, before: { status: previousStatus }, after: { status, message }, createdAt: serverTime });
  });

  return { ok: true };
});

export const trackCustomerOrder = onCall({ region: 'europe-west1' }, async (request) => {
  const orderNumber = sanitizeString((request.data as { orderNumber?: string }).orderNumber, 30);
  const phone = normalizePhone(sanitizeString((request.data as { phone?: string }).phone, 30));
  if (!orderNumber || !isValidEgyptPhone(phone)) throw new HttpsError('invalid-argument', 'Order number and valid phone are required.');
  const snapshot = await db.collection('orders').where('orderNumber', '==', orderNumber).where('customer.phone', '==', phone).limit(1).get();
  if (snapshot.empty) return { order: null };
  const doc = snapshot.docs[0];
  const data = doc.data();
  return { order: serialize({ id: doc.id, orderNumber: data.orderNumber, items: data.items, subtotal: data.subtotal, shippingFee: data.shippingFee, discount: data.discount, couponCode: data.couponCode, total: data.total, paymentMethod: data.paymentMethod, paymentStatus: data.paymentStatus, status: data.status, trackingUpdates: data.trackingUpdates, customer: { fullName: data.customer?.fullName, phone: data.customer?.phone, governorate: data.customer?.governorate, city: data.customer?.city }, createdAt: data.createdAt, updatedAt: data.updatedAt }) };
});
