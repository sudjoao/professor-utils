import { backupSaved } from '@/features/backup/backupSlice';
import {
  getBackupFileName,
  parseBackup,
  serializeBackup,
  summarizeBackup,
} from '@/features/backup/services/backup';
import type { BackupData } from '@/features/backup/types';
import { headerImageStorage } from '@/features/reports/headerImageStorage';
import { formatLongDate, getTodayIsoDate } from '@/lib/date/isoDate';
import { decodeText } from '@/lib/files/decodeText';
import { downloadBlob } from '@/lib/files/downloadBlob';
import { useUndoNotice } from '@/lib/react/useUndoNotice';
import { pluralize } from '@/lib/text/pluralize';
import { stateRestored } from '@/store/actions';
import { useAppDispatch, useAppStore } from '@/store/hooks';

const PARSE_ERRORS = {
  invalid: 'Esse arquivo não é uma cópia do Professor Utils, ou está danificado.',
  notBackup: 'Esse arquivo não é uma cópia do Professor Utils.',
  newer:
    'Essa cópia foi feita por uma versão mais nova do Professor Utils. Recarregue a página e tente de novo.',
};

/** Saves the browser data to a file and brings it back, with "Desfazer" for the restore. */
export const useBackup = () => {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const saveNotice = useUndoNotice();
  const restoreNotice = useUndoNotice();

  const readCurrentData = (): BackupData => {
    const { classroom, classDraft, sheetStyle, reportSettings } = store.getState();
    return {
      classrooms: classroom.classrooms,
      classDraft,
      sheetStyle,
      reportSettings,
      headerImage: headerImageStorage.read(),
    };
  };

  const applyData = ({ classrooms, headerImage, ...slices }: BackupData): boolean => {
    dispatch(stateRestored({ classroom: { classrooms }, ...slices }));
    return headerImageStorage.write(headerImage);
  };

  const saveBackup = () => {
    const today = getTodayIsoDate();
    const json = serializeBackup(readCurrentData(), new Date().toISOString());

    downloadBlob(new Blob([json], { type: 'application/json' }), getBackupFileName(today));
    dispatch(backupSaved(today));
    saveNotice.show(
      `Cópia salva no arquivo "${getBackupFileName(today)}", na pasta Downloads. Guarde num pendrive, no Google Drive ou mande por e-mail para você mesmo.`,
    );
  };

  /** Returns an error message, or an empty text when the copy was loaded. */
  const restoreBackup = async (file: File): Promise<string> => {
    const result = parseBackup(decodeText(await file.arrayBuffer()));

    if (result.status !== 'ok') {
      return PARSE_ERRORS[result.status];
    }

    const previousData = readCurrentData();
    const isImageSaved = applyData(result.backup.data);
    const { classroomCount, hasSchoolData } = summarizeBackup(result.backup.data);
    const madeOn = result.backup.createdAt
      ? ` de ${formatLongDate(result.backup.createdAt.slice(0, 10))}`
      : '';

    restoreNotice.show(
      [
        `Cópia${madeOn} carregada: ${pluralize(classroomCount, 'turma salva', 'turmas salvas')}`,
        hasSchoolData ? ', dados da escola' : '',
        ' e a turma que estava sendo preparada.',
        isImageSaved ? '' : ' A imagem do cabeçalho não coube neste navegador.',
      ].join(''),
      () => applyData(previousData),
    );
    return '';
  };

  return { saveBackup, restoreBackup, saveNotice, restoreNotice };
};
