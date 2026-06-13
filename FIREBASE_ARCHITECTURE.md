# NEXORA V2 Firebase Architecture

V2 removes the previous Firebase module shadowing risk by moving all local Firebase files from `src/firebase` to `src/lib/firebase`.

## Approved structure

```txt
src/lib/firebase/
  auth.ts
  config.ts
  db.ts
  storage.ts
```

## Forbidden structure

Do not create these paths again:

```txt
src/firebase/
firebase/auth.ts
firebase/storage.ts
firebase/config.ts
```

They can collide with official SDK imports such as:

```ts
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
```

## TypeScript alias

The only project alias is:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

There must never be a `firebase/*` path alias.

## Server authority

Critical commerce operations are handled through Cloud Functions:

- `createCheckoutOrder`
- `validateCoupon`
- `updateOrderStatus`
- `trackCustomerOrder`

The browser should not be trusted to calculate final order totals, apply discounts, or reduce inventory.
