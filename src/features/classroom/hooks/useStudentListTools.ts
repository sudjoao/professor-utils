import { type ClipboardEvent, type RefObject, useState } from 'react';

import { readStudentFile } from '@/features/classroom/services/readStudentFile';
import {
  cleanStudentList,
  hasMostlyUpperCaseNames,
  type StudentListFix,
  toNameCase,
} from '@/features/classroom/services/studentList';
import { insertText } from '@/lib/text/insertText';
import { parseLines } from '@/lib/text/parseLines';
import { pluralize } from '@/lib/text/pluralize';

const FIX_MESSAGES: Record<StudentListFix, string> = {
  columns: 'ficou só a coluna dos nomes',
  header: 'saiu o título da coluna',
  numbers: 'saíram os números e códigos em volta dos nomes',
};

const FILE_ERRORS = {
  oldExcel:
    'Arquivos .xls (Excel antigo) não abrem aqui. No Excel, use "Salvar como" e escolha "Pasta de Trabalho do Excel (.xlsx)".',
  unsupported:
    'Esse tipo de arquivo não serve. Use uma planilha do Excel (.xlsx) ou um arquivo .csv.',
  empty: 'Não encontramos nomes de alunos nesse arquivo.',
  failed: 'Não foi possível abrir esse arquivo. Confira se ele abre no Excel e tente de novo.',
};

/** A change the teacher can undo: the message says what happened. */
type Notice = {
  message: string;
  previousText: string;
  resultText: string;
};

const describeFixes = (fixes: StudentListFix[]): string =>
  fixes.map((fix) => FIX_MESSAGES[fix]).join(', ');

type StudentListToolsOptions = {
  studentsText: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (text: string) => void;
};

/** Paste cleanup, file import and name case fixing for the students field, all undoable. */
export const useStudentListTools = ({
  studentsText,
  textareaRef,
  onChange,
}: StudentListToolsOptions) => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [fileError, setFileError] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);

  const replaceText = (text: string, message: string) => {
    setNotice({ message, previousText: studentsText, resultText: text });
    setFileError('');
    onChange(text);
  };

  /** Pasted lists with numbers, headers or several columns go in already cleaned. */
  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const { names, fixes } = cleanStudentList(event.clipboardData.getData('text/plain'));

    if (fixes.length === 0 || names.length === 0) {
      return;
    }

    event.preventDefault();
    const textarea = event.currentTarget;
    const { text } = insertText(
      studentsText,
      names.join('\n'),
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    replaceText(text, `Arrumamos a lista colada: ${describeFixes(fixes)}.`);
  };

  const importFile = async (file: File) => {
    setIsReadingFile(true);
    setFileError('');

    try {
      const result = await readStudentFile(file);

      if (result.status !== 'ok') {
        setFileError(FILE_ERRORS[result.status]);
        return;
      }

      const fixes = result.fixes.length > 0 ? ` (${describeFixes(result.fixes)})` : '';
      replaceText(
        result.names.join('\n'),
        `Colocamos ${pluralize(result.names.length, 'nome', 'nomes')} do arquivo "${file.name}"${fixes}.`,
      );
      textareaRef.current?.focus();
    } catch (error) {
      console.error(error);
      setFileError(FILE_ERRORS.failed);
    } finally {
      setIsReadingFile(false);
    }
  };

  const hasUpperCaseNames = hasMostlyUpperCaseNames(parseLines(studentsText));

  const fixNameCase = () =>
    replaceText(
      studentsText.split('\n').map(toNameCase).join('\n'),
      'Os nomes agora têm só as iniciais maiúsculas.',
    );

  // Once the teacher edits the list again, undoing would throw that work away: the notice goes.
  const activeNotice = notice?.resultText === studentsText ? notice : null;

  const undo = () => {
    if (activeNotice) {
      onChange(activeNotice.previousText);
      setNotice(null);
    }
  };

  return {
    notice: activeNotice,
    fileError,
    isReadingFile,
    hasUpperCaseNames,
    handlePaste,
    importFile,
    fixNameCase,
    undo,
    dismissNotice: () => setNotice(null),
  };
};
