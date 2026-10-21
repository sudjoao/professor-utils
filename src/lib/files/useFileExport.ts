import { useState } from 'react';

import { downloadBlob } from '@/lib/files/downloadBlob';
import type { FormError } from '@/lib/forms/formErrors';

type FileExportOptions = {
  errors: FormError[];
  /** Full file name, extension included. */
  fileName: string;
  /** Builds the file lazily, so heavy libraries (ExcelJS, docx) only load when the teacher exports. */
  buildFile: () => Promise<Blob>;
};

export const useFileExport = ({ errors, fileName, buildFile }: FileExportOptions) => {
  const [hasTriedExport, setHasTriedExport] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [downloadedFileName, setDownloadedFileName] = useState('');

  const exportFile = async () => {
    setHasTriedExport(true);
    setExportError('');
    setDownloadedFileName('');

    if (errors.length > 0) {
      setFailedAttempts((count) => count + 1);
      return;
    }

    setIsExporting(true);
    try {
      downloadBlob(await buildFile(), fileName);
      setDownloadedFileName(fileName);
    } catch (error) {
      console.error(error);
      setExportError('Não foi possível preparar o arquivo. Tente de novo em alguns segundos.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    // Errors only show up after the first attempt, so the form does not start all red.
    visibleErrors: hasTriedExport ? errors : [],
    /** Grows on every click blocked by errors, so the page can bring the teacher to them. */
    failedAttempts,
    isExporting,
    exportError,
    downloadedFileName,
    exportFile,
  };
};

export type FileExport = ReturnType<typeof useFileExport>;
