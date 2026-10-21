import { useState } from 'react';

import { downloadBlob } from '@/lib/files/downloadBlob';

type FileExportOptions = {
  errors: string[];
  /** Full file name, extension included. */
  fileName: string;
  /** Builds the file lazily, so heavy libraries (ExcelJS, docx) only load when the teacher exports. */
  buildFile: () => Promise<Blob>;
};

export const useFileExport = ({ errors, fileName, buildFile }: FileExportOptions) => {
  const [hasTriedExport, setHasTriedExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const exportFile = async () => {
    setHasTriedExport(true);
    setExportError('');

    if (errors.length > 0) {
      return;
    }

    setIsExporting(true);
    try {
      downloadBlob(await buildFile(), fileName);
    } catch (error) {
      console.error(error);
      setExportError('Não foi possível gerar o arquivo. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    // Errors only show up after the first attempt, so the form does not start all red.
    visibleErrors: hasTriedExport ? errors : [],
    isExporting,
    exportError,
    exportFile,
  };
};
