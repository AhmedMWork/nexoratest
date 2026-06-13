# NEXORA V2 Setup

## Requirements

- Node.js 20.x
- npm 10+
- Firebase CLI

## Windows recommended setup

Use PowerShell as Administrator when resetting dependencies.

```powershell
node -v
npm -v
npm config set registry https://registry.npmjs.org/
```

If you previously used pnpm or a broken npm registry, run:

```powershell
.\scripts\windows-reset.ps1
```

## Manual install

```powershell
npm config set registry https://registry.npmjs.org/
npm install
npm run build
npm run dev
```

## Functions

```powershell
cd functions
npm install
npm run build
```

## Environment

Copy `.env.example` to `.env` and add Firebase web app keys.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ENABLE_SEED_FALLBACK=false
```

## Admin access

Open:

```txt
/admin
```

or:

```txt
/nexora-admin
```
