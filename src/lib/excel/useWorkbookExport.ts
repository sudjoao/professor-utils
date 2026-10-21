import type { Workbook } from 'exceljs';
import { useState } from 'react';

import { downloadWorkbook } from '@/lib/excel/downloadWorkbook';

type WorkbookExportOptions = {
  errors: string[];
  fileName: string;
  /** Builds the workbook lazily, so ExcelJS (heavy) is only downloaded when the teacher exports. */
  loadWorkbook: () => Promise<Workbook>;
};

export const useWorkbookExport = ({ errors, fileName, loadWorkbook }: WorkbookExportOptions) => {
  const [hasTriedExport, setHasTriedExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const exportWorkbook = async () => {
    setHasTriedExport(true);
    setExportError('');

    if (errors.length > 0) {
      return;
    }

    setIsExporting(true);
    try {
      await downloadWorkbook(await loadWorkbook(), fileName);
    } catch (error) {
      console.error(error);
      setExportError('Não foi possível gerar a planilha. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    // Errors only show up after the first attempt, so the form does not start all red.
    visibleErrors: hasTriedExport ? errors : [],
    isExporting,
    exportError,
    exportWorkbook,
  };
};
