// ============================================================
// NEXORA V3.4 — Hidden Studio Access Gate
// A lightweight PIN gate for link-only Studio access. Keep Firestore rules protected for production.
// ============================================================

import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { Shield } from 'lucide-react';

const SESSION_KEY = 'nexora-studio-access-v34';

export default function StudioGate({ children }: { children: ReactNode }) {
  const configuredCode = import.meta.env.VITE_STUDIO_ACCESS_CODE as string | undefined;
  const accessCode = configuredCode?.trim() || 'NEXORA-STUDIO';
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const hint = useMemo(() => configuredCode ? 'Private studio access' : 'Default code: NEXORA-STUDIO', [configuredCode]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim() !== accessCode) {
      setError('Access code is not valid.');
      return;
    }
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsUnlocked(true);
  };

  if (isUnlocked) return <>{children}</>;

  return (
    <main className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)] flex items-center justify-center px-5">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--v33-accent) 22%, transparent), transparent 26rem), linear-gradient(135deg, var(--v33-card), var(--v33-bg))' }} />
      <form onSubmit={submit} className="relative w-full max-w-md v34-admin-panel p-6 sm:p-8 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full v34-logo-plate">
          <img src="/assets/nexora-logo.png" alt="NEXORA" className="h-16 w-16 object-contain v34-logo-img" />
        </div>
        <p className="v3-kicker mb-3">NEXORA Studio</p>
        <h1 className="text-2xl font-semibold tracking-[-0.04em]">Enter the private studio</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--v33-muted)]">{hint}</p>
        <label className="mt-7 block text-left text-[10px] font-black uppercase tracking-[0.22em] text-[var(--v33-muted)]">Access Code</label>
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          autoFocus
          type="password"
          className="nexora-input mt-2 text-center tracking-[0.18em]"
          placeholder="••••••••"
        />
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <button className="nexora-button-primary mt-6 w-full" type="submit"><Shield className="h-4 w-4" /> Enter Studio</button>
        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-[var(--v33-subtle)]">Link-only access. No storefront entry.</p>
      </form>
    </main>
  );
}
