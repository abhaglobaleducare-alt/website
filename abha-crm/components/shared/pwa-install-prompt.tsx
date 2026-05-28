'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setVisible(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !deferred) return null;

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-3xl border border-saffron/40 bg-slate-900 p-4 shadow-soft">
      <div>
        <p className="text-sm font-semibold text-white">Install ABHA CRM</p>
        <p className="text-xs text-slate-400">Add to your home screen for quick access.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="rounded-full px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={install}
          className="rounded-full bg-saffron px-4 py-1.5 text-sm font-semibold text-brand-900"
        >
          Install
        </button>
      </div>
    </div>
  );
}
