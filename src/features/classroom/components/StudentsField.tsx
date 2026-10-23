import { FileSpreadsheet } from 'lucide-react';
import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';

import { FormField } from '@/components/FormField';
import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudentListTools } from '@/features/classroom/hooks/useStudentListTools';
import {
  ACCEPTED_STUDENT_FILES,
  preloadStudentFileReader,
} from '@/features/classroom/services/readStudentFile';
import { fieldId } from '@/lib/forms/formErrors';
import { pluralize } from '@/lib/text/pluralize';
import { cn } from '@/lib/utils';

type StudentsFieldProps = {
  studentsText: string;
  sortStudents: boolean;
  studentCount: number;
  error?: string;
  onStudentsTextChange: (text: string) => void;
  onSortStudentsChange: (sortStudents: boolean) => void;
};

export const StudentsField = ({
  studentsText,
  sortStudents,
  studentCount,
  error,
  onStudentsTextChange,
  onSortStudentsChange,
}: StudentsFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const tools = useStudentListTools({
    studentsText,
    textareaRef,
    onChange: onStudentsTextChange,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) {
      tools.importFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    const file = event.dataTransfer.files[0];
    setIsDragging(false);
    if (file) {
      event.preventDefault();
      tools.importFile(file);
    }
  };

  return (
    <div className="space-y-3">
      <FormField
        id={fieldId('studentsText')}
        label="Nomes dos alunos"
        hint="Escreva ou cole um nome por linha. Pode colar direto do Excel ou de uma lista numerada: os números saem sozinhos. Também dá para arrastar um arquivo do Excel para cá."
        error={error ?? (tools.fileError || undefined)}
      >
        {(control) => (
          <div
            className={cn('relative rounded-lg', isDragging && 'ring-4 ring-ring')}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes('Files')) {
                event.preventDefault();
                setIsDragging(true);
              }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Textarea
              {...control}
              ref={textareaRef}
              rows={10}
              className="min-h-56 text-base md:text-base"
              value={studentsText}
              placeholder={'Exemplo:\nAna Souza\nBruno Lima\nCarla Dias'}
              onPaste={tools.handlePaste}
              onChange={(event) => onStudentsTextChange(event.target.value)}
            />
            {isDragging && (
              <p className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-background/90 text-lg font-semibold">
                Solte o arquivo aqui
              </p>
            )}
          </div>
        )}
      </FormField>

      <UndoNotice notice={tools.notice} onUndo={tools.undo} onDismiss={tools.dismissNotice} />

      {tools.hasUpperCaseNames && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted p-3">
          <p className="flex-1">Os nomes estão todos em MAIÚSCULAS.</p>
          <Button variant="outline" className="bg-background" onClick={tools.fixNameCase}>
            Deixar como &quot;Ana Souza&quot;
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label className="text-base font-normal">
          {/* Native checkbox: the shadcn one is not named by a wrapping <label>. */}
          <input
            type="checkbox"
            className="size-5 accent-primary"
            checked={sortStudents}
            onChange={(event) => onSortStudentsChange(event.target.checked)}
          />
          Colocar os nomes em ordem alfabética
        </Label>
        <p className="font-medium" aria-live="polite">
          {pluralize(studentCount, 'aluno', 'alunos')} na lista
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_STUDENT_FILES}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="lg"
        className="h-10"
        disabled={tools.isReadingFile}
        onPointerEnter={preloadStudentFileReader}
        onFocus={preloadStudentFileReader}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileSpreadsheet data-icon="inline-start" />
        {tools.isReadingFile
          ? 'Abrindo o arquivo...'
          : 'Abrir lista de alunos de um arquivo (Excel ou CSV)'}
      </Button>
    </div>
  );
};
