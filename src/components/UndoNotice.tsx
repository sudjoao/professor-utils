import { CircleCheck, Undo2 } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import type { UndoableNotice } from '@/lib/react/useUndoNotice';

type UndoNoticeProps = {
  notice: UndoableNotice | null;
  onUndo: () => void;
  onDismiss: () => void;
};

/**
 * Says what just happened, next to where it happened, with "Desfazer" when it can be undone.
 * It never disappears by itself, so nobody has to hurry to read it.
 */
export const UndoNotice = ({ notice, onUndo, onDismiss }: UndoNoticeProps) => {
  const noticeRef = useRef<HTMLDivElement>(null);

  const handleUndo = () => {
    onUndo();
    // The "Desfazer" button goes away; the focus stays on the notice instead of the page top.
    noticeRef.current?.focus();
  };

  // The live region is always on the page, so screen readers announce every new message.
  return (
    <div ref={noticeRef} role="status" tabIndex={-1} className="rounded-xl outline-none">
      {notice && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-green-700 bg-green-50 p-3 text-green-950">
          <CircleCheck className="size-5 shrink-0" aria-hidden />
          <p className="min-w-48 flex-1">{notice.message}</p>
          {notice.undo && (
            <Button variant="outline" className="bg-background" onClick={handleUndo}>
              <Undo2 data-icon="inline-start" />
              Desfazer
            </Button>
          )}
          <Button variant="ghost" onClick={onDismiss}>
            Ok
          </Button>
        </div>
      )}
    </div>
  );
};
