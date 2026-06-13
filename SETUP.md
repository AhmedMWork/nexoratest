# NEXORA Setup

## Required Runtime
Use Node 20.

Recommended on Windows:
```powershell
nvm install 20
nvm use 20
node -v
```

If you do not use nvm, install Node 20 LTS directly.

## Install
From project root:
```powershell
npm install
```

Or with pnpm:
```powershell
pnpm install
```

The project includes `pnpm.onlyBuiltDependencies` for `@firebase/util`, `esbuild`, and `protobufjs` to prevent pnpm ignored-build errors.

## Frontend Build
```powershell
npm run build
```

## Functions Build
```powershell
cd functions
npm install
npm run build
```

## Firebase Deploy
```powershell
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```

## Vercel Deploy
Set the variables from `.env.example`, then deploy the frontend.

## Admin Setup
1. Create an admin user in Firebase Authentication.
2. Copy the user UID.
3. Create document `admins/{uid}` in Firestore.
4. Add fields: `email`, `displayName`, `role: "owner"`, `createdAt`, `lastLoginAt`.

---

# V1.1 Notes

This package includes the Midnight Atelier visual upgrade and easier admin access.

Use:

```bash
npm install
npm run dev
```

Admin shortcuts:

- `http://localhost:5173/admin`
- `http://localhost:5173/nexora-admin`

Production build verification:

```bash
npm run lint
npm run build
cd functions
npm run build
```

## Windows install note

This package intentionally does not include `node_modules` or npm `package-lock.json` files. Run `npm install` in the project root and again inside `functions` before building.

If npm tries to download from any non-public registry, run:

```powershell
npm config set registry https://registry.npmjs.org/
```

Then perform a clean install as documented in `INSTALL_FIX_WINDOWS.md`.
