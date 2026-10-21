import { CircleCheck, Download } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type { FileExport } from '@/lib/files/useFileExport';
import { focusField } from '@/lib/forms/focusField';
import { fieldId } from '@/lib/forms/formErrors';

type ExportPanelProps = {
  summary: ReactNode;
  downloadLabel: string;
  /** Programs that open the file, e.g. "o Excel (ou Google Planilhas, LibreOffice)". */
  openWith: string;
  fileExport: FileExport;
};

export const ExportPanel = ({ summary, downloadLabel, openWith, fileExport }: ExportPanelProps) => {
  const { visibleErrors, failedAttempts, isExporting, exportError, downloadedFileName } =
    fileExport;
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // A blocked download brings the teacher to the list of what is missing.
  useEffect(() => {
    if (failedAttempts > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [failedAttempts]);

  return (
    <div className="space-y-4">
      {summary}

      {visibleErrors.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="space-y-2 rounded-xl border-2 border-destructive p-4"
        >
          <p className="font-semibold text-destructive">Antes de baixar, falta arrumar:</p>
          <ul className="list-inside list-disc space-y-1">
            {visibleErrors.map(({ field, message }) => (
              <li key={`${field}-${message}`}>
                {field ? (
                  <a
                    href={`#${fieldId(field)}`}
                    className="underline underline-offset-4"
                    onClick={(event) => {
                      event.preventDefault();
                      focusField(field);
                    }}
                  >
                    {message}
                  </a>
                ) : (
                  message
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {exportError && (
        <p className="font-medium text-destructive" role="alert">
          {exportError}
        </p>
      )}

      <Button
        size="lg"
        className="h-12 px-5 text-base"
        disabled={isExporting}
        onClick={fileExport.exportFile}
      >
        <Download data-icon="inline-start" className="size-5" />
        {isExporting ? 'Preparando o arquivo, aguarde...' : downloadLabel}
      </Button>

      <div role="status">
        {downloadedFileName && (
          <div className="flex items-start gap-2 rounded-xl border-2 border-green-700 bg-green-50 p-4 text-green-950">
            <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p>
              <strong>Pronto!</strong> O arquivo <strong>{downloadedFileName}</strong> foi baixado.
              Procure na pasta <strong>Downloads</strong> do computador e abra com {openWith}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
