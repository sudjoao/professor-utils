import { Download } from 'lucide-react';
import { type RefObject, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

type MobileDownloadBarProps = {
  /** The download step: while it is on screen, its own button is enough. */
  panelRef: RefObject<HTMLElement | null>;
  label: string;
  isExporting: boolean;
  onDownload: () => void;
};

/**
 * On phones the download button sits at the bottom of a long form; this bar keeps it in reach.
 * It hides on larger screens and whenever the download step itself is visible.
 */
export const MobileDownloadBar = ({
  panelRef,
  label,
  isExporting,
  onDownload,
}: MobileDownloadBarProps) => {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setIsPanelVisible(entry.isIntersecting));
    observer.observe(panel);
    return () => observer.disconnect();
  }, [panelRef]);

  const handleClick = () => {
    // Errors, the "Pronto!" message and the download progress are all in the download step.
    panelRef.current?.scrollIntoView({ block: 'center' });
    onDownload();
  };

  if (isPanelVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 shadow-lg backdrop-blur sm:hidden">
      <Button
        size="lg"
        className="h-12 w-full text-base"
        disabled={isExporting}
        onClick={handleClick}
      >
        <Download data-icon="inline-start" className="size-5" />
        {isExporting ? 'Preparando o arquivo, aguarde...' : label}
      </Button>
    </div>
  );
};
