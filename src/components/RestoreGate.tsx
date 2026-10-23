'use client';

import { LoaderCircle } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import { useIsRestored } from '@/store/hooks';

/** Most browsers restore in a blink; the message only shows up when it takes longer. */
const MESSAGE_DELAY_MS = 300;

type RestoreGateProps = {
  children: ReactNode;
};

/**
 * Waits for the data saved in the browser before showing a form, so it never looks empty
 * for a moment (as if everything was lost) and nothing typed is overwritten when it arrives.
 */
export const RestoreGate = ({ children }: RestoreGateProps) => {
  const isRestored = useIsRestored();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowMessage(true), MESSAGE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  if (isRestored) {
    return children;
  }

  return (
    <div role="status" className="flex min-h-[50vh] items-start justify-center pt-16">
      {showMessage && (
        <p className="inline-flex items-center gap-2 text-lg text-muted-foreground">
          <LoaderCircle className="size-6 animate-spin" aria-hidden />
          Carregando seus dados salvos...
        </p>
      )}
    </div>
  );
};
