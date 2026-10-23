import { Check, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Long enough to be noticed; the browser saves in a fraction of it. */
const SAVING_FEEDBACK_MS = 800;

type SaveStatusProps = {
  /** What is saved, as text: every change shows "Salvando..." for a moment. */
  value: string;
};

/** Reassures that what the teacher types is kept, without a "Salvar" button to remember. */
export const SaveStatus = ({ value }: SaveStatusProps) => {
  const [lastValue, setLastValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  // Adjusting state while rendering: React's recommended way to react to a changed prop.
  if (value !== lastValue) {
    setLastValue(value);
    setIsSaving(true);
  }

  useEffect(() => {
    if (!isSaving) {
      return;
    }
    const timeout = setTimeout(() => setIsSaving(false), SAVING_FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [isSaving, lastValue]);

  // Visual only: announcing "salvo" on every keystroke would be noise for screen readers.
  return (
    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
      {isSaving ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden />
      ) : (
        <Check className="size-4" aria-hidden />
      )}
      {isSaving ? 'Salvando...' : 'Salvo neste computador'}
    </p>
  );
};
