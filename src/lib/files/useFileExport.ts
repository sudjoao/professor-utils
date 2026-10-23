import { useCallback, useState } from 'react';

import { downloadBlob } from '@/lib/files/downloadBlob';
import type { FormError } from '@/lib/forms/formErrors';
import { useValidation } from '@/lib/forms/useValidation';

type FileExportOptions = {
  errors: FormError[];
  /** Full file name, extension included. */
  fileName: string;
  /** Builds the file lazily, so heavy libraries (ExcelJS, docx) only load when the teacher exports. */
  buildFile: () => Promise<Blob>;
  /** Downloads those libraries ahead of time, when the download step comes near. */
  preload?: () => Promise<unknown>;
};

const ignoreError = () => undefined;

export const useFileExport = ({ errors, fileName, buildFile, preload }: FileExportOptions) => {
  const validation = useValidation(errors);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [downloadedFileName, setDownloadedFileName] = useState('');

  // Stable while `preload` is (a module-level loader), so effects can depend on it.
  const preloadFile = useCallback(() => void preload?.().catch(ignoreError), [preload]);

  /** Shows the errors (and brings the teacher to them); `true` when there are none. */
  const validate = (): boolean => {
    setExportError('');
    setDownloadedFileName('');
    return validation.validate();
  };

  const exportFile = async () => {
    if (!validate()) {
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
    visibleErrors: validation.visibleErrors,
    /** Grows on every click blocked by errors, so the page can bring the teacher to them. */
    failedAttempts: validation.failedAttempts,
    isExporting,
    exportError,
    downloadedFileName,
    exportFile,
    validate,
    // A failed preload is not a problem: the download tries again, and reports errors itself.
    preload: preloadFile,
  };
};

export type FileExport = ReturnType<typeof useFileExport>;
