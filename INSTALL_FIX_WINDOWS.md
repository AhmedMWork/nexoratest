# Windows Install Fix — NEXORA V2

Use this when you see:

- `tsc is not recognized`
- npm trying to use a wrong/internal registry
- `EPERM` while removing `node_modules`
- old pnpm lock conflicts

## Steps

Close VS Code and all terminals, then open PowerShell as Administrator.

```powershell
cd D:\nexora\NEXORA_V2
npm config set registry https://registry.npmjs.org/
.\scripts\windows-reset.ps1
```

## Manual version

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-lock.yaml -ErrorAction SilentlyContinue
Remove-Item -Force pnpm-workspace.yaml -ErrorAction SilentlyContinue
npm config set registry https://registry.npmjs.org/
npm install
npm run build
```

Functions:

```powershell
cd functions
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run build
```
