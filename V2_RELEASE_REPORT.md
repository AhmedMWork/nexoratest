# NEXORA V2 Release Report

## Release name

NEXORA V2 — Enterprise Brand Commerce Foundation

## Main upgrades

- Fixed Firebase SDK import collision by moving local Firebase code to `src/lib/firebase`.
- Removed package-manager ambiguity and moved the project to npm-first installation.
- Added Node 20 enforcement files: `.nvmrc` and `.node-version`.
- Added registry-safe `.npmrc` for root and functions.
- Added service layer exports under `src/services`.
- Added customer-safe Firebase error mapper.
- Added Admin Audit Logs screen and sidebar route.
- Added `/admin` shortcut support from the existing router.
- Added Windows clean install helper.
- Added V2 documentation: Firebase Architecture, Admin Guide, QA, Deployment, Setup.

## Verification performed in this environment

- TypeScript app typecheck passed after Firebase restructuring.
- Vite bundling could not be completed in this container because the copied offline `node_modules` set is missing Rollup's optional native package. A clean local `npm install` from the public npm registry will install this optional dependency.

## Required local verification

```bash
npm install
npm run verify
cd functions
npm install
npm run verify
```

## Important production note

Paymob/Stripe are still intentionally disabled. V2 keeps COD stable until real payment gateway keys and webhook testing are available.
