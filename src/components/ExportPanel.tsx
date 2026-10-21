import { Download } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type ExportPanelProps = {
  summary: ReactNode;
  errors: string[];
  isExporting: boolean;
  exportError: string;
  downloadLabel: string;
  onExport: () => void;
};

export const ExportPanel = ({
  summary,
  errors,
  isExporting,
  exportError,
  downloadLabel,
  onExport,
}: ExportPanelProps) => (
  <div className="space-y-4">
    {summary}

    {errors.length > 0 && (
      <ul className="list-inside list-disc space-y-1 text-sm text-destructive" role="alert">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    )}
    {exportError && (
      <p className="text-sm text-destructive" role="alert">
        {exportError}
      </p>
    )}

    <Button size="lg" disabled={isExporting} onClick={onExport}>
      <Download data-icon="inline-start" />
      {isExporting ? 'Gerando arquivo...' : downloadLabel}
    </Button>
  </div>
);
