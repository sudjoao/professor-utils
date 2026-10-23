import { useState } from 'react';

export type UndoableNotice = {
  message: string;
  /** Puts things back as they were; without it the notice only informs. */
  undo?: () => void;
};

const UNDONE_MESSAGE = 'Pronto, voltou como estava.';

/**
 * Lets an action happen right away and offers "Desfazer", instead of asking "Tem certeza?"
 * first: fewer steps, and a mistake costs one click.
 */
export const useUndoNotice = () => {
  const [notice, setNotice] = useState<UndoableNotice | null>(null);

  const show = (message: string, undo?: () => void) => setNotice({ message, undo });

  const undo = () => {
    notice?.undo?.();
    setNotice({ message: UNDONE_MESSAGE });
  };

  return { notice, show, undo, dismiss: () => setNotice(null) };
};

export type UndoNoticeState = ReturnType<typeof useUndoNotice>;
