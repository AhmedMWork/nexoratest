// ============================================================
// NEXORA — Firebase Storage Helpers
// Admin-only product/brand asset uploads. Rules enforce ownership.
// ============================================================

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';
import { generateSlug } from '@/lib/utils';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP product images are allowed.');
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image size must be less than 5MB.');
  }
}

export async function uploadProductImage(file: File, productNameOrSku: string): Promise<string> {
  validateImageFile(file);
  const safeBase = generateSlug(productNameOrSku || 'product');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `products/${safeBase}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file, {
    contentType: file.type,
    customMetadata: { source: 'nexora-admin' },
  });
  return getDownloadURL(imageRef);
}
