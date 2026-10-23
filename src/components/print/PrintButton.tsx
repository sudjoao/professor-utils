import { Printer } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';

export const PRINT_ROOT_ID = 'print-root';

type PrintButtonProps = {
  label?: string;
  orientation: 'portrait' | 'landscape';
  /** Runs first; returning `false` cancels (e.g. the form still has errors). */
  onBeforePrint?: () => boolean;
  /** Renders the pages to print, only when printing. */
  renderContent: () => ReactNode;
};

/**
 * Prints a document straight from the browser, for teachers without Excel or Word.
 * The browser's print window also has "Salvar como PDF".
 */
export const PrintButton = ({
  label = 'Imprimir ou salvar em PDF',
  orientation,
  onBeforePrint,
  renderContent,
}: PrintButtonProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!isPrinting) {
      return;
    }

    const stopPrinting = () => setIsPrinting(false);
    window.addEventListener('afterprint', stopPrinting);
    // Waits one frame so the pages are on the page before the print window opens.
    const frame = requestAnimationFrame(() => window.print());

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', stopPrinting);
    };
  }, [isPrinting]);

  const handleClick = () => {
    if (onBeforePrint && !onBeforePrint()) {
      return;
    }
    setIsPrinting(true);
  };

  return (
    <>
      <Button variant="outline" size="lg" className="h-12 px-5 text-base" onClick={handleClick}>
        <Printer data-icon="inline-start" className="size-5" />
        {label}
      </Button>
      {isPrinting &&
        createPortal(
          <div id={PRINT_ROOT_ID}>
            <style>{`@page { size: A4 ${orientation}; margin: 10mm; }`}</style>
            {renderContent()}
          </div>,
          document.body,
        )}
    </>
  );
};
