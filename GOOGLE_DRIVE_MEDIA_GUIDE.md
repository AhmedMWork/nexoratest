# Google Drive Media Guide — NEXORA V3.3

Firebase Storage is not required in V3.3. Product images are managed with public Google Drive links.

## Steps
1. Upload product images to a Google Drive folder.
2. Right-click the image file and choose **Share**.
3. Set access to **Anyone with the link**.
4. Copy the share link.
5. Open Studio → Products → Add/Edit Product.
6. Paste one image link per line into **Google Drive / public image links**.
7. Click **Normalize Drive Links**.
8. Save the product.

## Supported link formats
- `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- `https://drive.google.com/open?id=FILE_ID`
- `https://drive.google.com/uc?export=view&id=FILE_ID`
- Existing direct public image URLs
- Local `/assets/...` paths

## Notes
Google Drive is practical for early launch, but it is not a high-performance CDN. For heavier traffic, consider Cloudinary or ImageKit later.
