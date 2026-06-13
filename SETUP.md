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
