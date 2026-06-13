# NEXORA V2 Admin Guide

## Access

Admin can be reached from:

- `/admin`
- `/nexora-admin`
- Header admin icon
- Mobile menu
- Footer Admin Access link

The shortcut `/admin` redirects to `/nexora-admin`.

## Required admin setup

Create a Firebase Authentication user, then add a Firestore document:

```txt
admins/{uid}
```

Example:

```json
{
  "email": "owner@nexora.com",
  "name": "NEXORA Owner",
  "role": "owner",
  "status": "active",
  "permissions": ["all"]
}
```

## Admin modules

- Dashboard
- Products
- Orders
- Inventory
- Reviews
- Coupons
- Promotions
- Drops
- Settings
- Audit Logs

## Production rule

Do not add products, coupons, drops, or settings directly from Firestore unless you are migrating data. Use the admin panel so audit logs and validation stay consistent.
