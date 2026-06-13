# NEXORA V3 — Studio Access Guide

## Hidden studio routes
There are no visible Admin buttons, icons, or footer links in the public storefront.

Use one of these routes directly:

- `/studio`
- `/admin`
- `/nexora-admin/dashboard`

## Reviews
Customers cannot add reviews from the public website.

Use Studio → Reviews to:
- Add review
- Publish/hide review
- Mark featured
- Delete review

## Catalog
Use Studio → Products to manage:
- Men
- Women
- Unisex
- Price
- Stock by size
- Images
- Publishing status
- Featured / New / Best seller / Limited drop flags

## Production security note
V3 implements hidden link-only Studio access at the UI level as requested. Hidden routes are convenient, but they are not a full security boundary. For a high-traffic public launch, enable Firebase Auth or a server-side PIN gate.
