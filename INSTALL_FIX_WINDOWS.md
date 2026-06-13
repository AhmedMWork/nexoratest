# NEXORA V1.1 — Windows Clean Install Fix

This package removes npm lockfiles that were generated in a private build environment. Use a clean install on your machine so npm resolves packages from the public npm registry.

## Required

- Node.js 20.x recommended
- npm 10+ or pnpm

## Clean install from PowerShell

Run PowerShell as Administrator, close VS Code terminals that may lock `node_modules`, then run:

```powershell
cd D:\nexora\NEXORA_v1_1_midnight_atelier_fixed_install

# Force npm to use the public registry
npm config set registry https://registry.npmjs.org/
npm cache verify

# Clean root install artifacts if they exist
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build

# Functions
cd functions
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
```

## If you see `tsc is not recognized`

Dependencies are not installed in the folder where you are running the command. Run `npm install` in that exact folder first.

For the storefront:

```powershell
cd <project-root>
npm install
npm run build
```

For Firebase Functions:

```powershell
cd <project-root>\functions
npm install
npm run build
```

## If you see EPERM cleanup warnings

Windows is locking files. Close VS Code, terminals, dev server, antivirus scan if active, then delete `node_modules` and install again.

## If you are on Node 24

The project can install with warnings, but production Firebase Functions require Node 20. Install Node 20 or use nvm-windows.
