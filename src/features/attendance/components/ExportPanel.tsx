import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';

type ExportPanelProps = {
  studentCount: number;
  lessonCount: number;
  pageCount: number;
  errors: string[];
  isExporting: boolean;
  exportError: string;
  onExport: () => void;
};

const pluralize = (count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`;

export const ExportPanel = ({
  studentCount,
  lessonCount,
  pageCount,
  errors,
  isExporting,
  exportError,
  onExport,
}: ExportPanelProps) => (
  <div className="space-y-4">
    <p className="text-sm">
      {pluralize(studentCount, 'aluno', 'alunos')} · {pluralize(lessonCount, 'aula', 'aulas')} ·{' '}
      {pluralize(pageCount, 'página', 'páginas')}
    </p>
    {pageCount > 1 && (
      <p className="text-xs text-muted-foreground">
        Cada página tem até {MAX_COLUMNS_PER_PAGE} aulas para caber na largura de uma folha A4
        deitada. As páginas ficam em abas separadas da planilha; para imprimir todas, escolha
        &quot;Imprimir pasta de trabalho inteira&quot;.
      </p>
    )}

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
      {isExporting ? 'Gerando planilha...' : 'Baixar planilha (.xlsx)'}
    </Button>
  </div>
);
