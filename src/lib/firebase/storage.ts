// ============================================================
// NEXORA V3.3 — Firebase Storage disabled
// Product images are managed through Google Drive public URLs.
// This module is kept as a safe compatibility guard so old imports
// fail with a clear message instead of referencing Firebase Storage.
// ============================================================

export function validateImageFile(file: File): void {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) throw new Error('Only JPG, PNG, and WEBP images are supported.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be smaller than 5MB.');
}

export async function uploadProductImage(): Promise<string> {
  throw new Error('Firebase Storage is disabled. Add a public Google Drive image link instead.');
}

export async function uploadBrandAsset(): Promise<string> {
  throw new Error('Firebase Storage is disabled. Add a public image link instead.');
}
