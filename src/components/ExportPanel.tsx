import { CircleCheck, Download } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import { ErrorSummary } from '@/components/ErrorSummary';
import { MobileDownloadBar } from '@/components/MobileDownloadBar';
import { Button } from '@/components/ui/button';
import type { FileExport } from '@/lib/files/useFileExport';

type ExportPanelProps = {
  summary: ReactNode;
  downloadLabel: string;
  /** Programs that open the file, e.g. "o Excel (ou Google Planilhas, LibreOffice)". */
  openWith: string;
  fileExport: FileExport;
  /** Shown next to the download button, e.g. "Imprimir ou salvar em PDF". */
  secondaryAction?: ReactNode;
};

export const ExportPanel = ({
  summary,
  downloadLabel,
  openWith,
  fileExport,
  secondaryAction,
}: ExportPanelProps) => {
  const { visibleErrors, failedAttempts, isExporting, exportError, downloadedFileName } =
    fileExport;
  const { preload } = fileExport;
  const panelRef = useRef<HTMLDivElement>(null);

  // Starts downloading the file libraries a bit before the teacher reaches this step.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preload();
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, [preload]);

  return (
    <div ref={panelRef} className="space-y-4">
      {summary}

      <ErrorSummary errors={visibleErrors} failedAttempts={failedAttempts} />
      {exportError && (
        <p className="font-medium text-destructive" role="alert">
          {exportError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="h-12 px-5 text-base"
          disabled={isExporting}
          onPointerEnter={preload}
          onFocus={preload}
          onClick={fileExport.exportFile}
        >
          <Download data-icon="inline-start" className="size-5" />
          {isExporting ? 'Preparando o arquivo, aguarde...' : downloadLabel}
        </Button>
        {secondaryAction}
      </div>

      <div role="status">
        {downloadedFileName && (
          <div className="flex items-start gap-2 rounded-xl border-2 border-success-border bg-success p-4 text-success-foreground">
            <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p>
              <strong>Pronto!</strong> O arquivo <strong>{downloadedFileName}</strong> foi baixado.
              Procure na pasta <strong>Downloads</strong> do computador e abra com {openWith}.
            </p>
          </div>
        )}
      </div>

      <MobileDownloadBar
        panelRef={panelRef}
        label={downloadLabel}
        isExporting={isExporting}
        onDownload={fileExport.exportFile}
      />
    </div>
  );
};
