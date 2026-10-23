'use client';

import { UserRound } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { ErrorSummary } from '@/components/ErrorSummary';
import { FieldGroup, FormField } from '@/components/FormField';
import { OptionButtons } from '@/components/OptionButtons';
import { PrintButton } from '@/components/print/PrintButton';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { getStudentNames, validateStudents } from '@/features/classroom/services/classForm';
import { ParentNoteView } from '@/features/parentNotes/components/ParentNoteView';
import { selectParentNote, updateParentNote } from '@/features/parentNotes/parentNoteSlice';
import {
  buildParentNotes,
  INITIAL_PARENT_NOTE,
  NOTES_PER_PAGE_OPTIONS,
} from '@/features/parentNotes/services/buildParentNotes';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import {
  INITIAL_REPORT_SETTINGS,
  selectReportSettings,
  updateReportSettings,
} from '@/features/reports/reportSettingsSlice';
import { chunk } from '@/lib/array/chunk';
import { useToday } from '@/lib/date/useToday';
import { fieldId, type FormError, getFieldError } from '@/lib/forms/formErrors';
import { useValidation } from '@/lib/forms/useValidation';
import { insertText } from '@/lib/text/insertText';
import { pluralize } from '@/lib/text/pluralize';
import { useAppDispatch, usePersistedSelector } from '@/store/hooks';

const TOTAL_STEPS = 3;

export const ParentNotesForm = () => {
  const dispatch = useAppDispatch();
  const { classDraft, splitChanges } = useClassDraft();
  const draft = usePersistedSelector(selectParentNote, INITIAL_PARENT_NOTE);
  const { schoolName, city } = usePersistedSelector(selectReportSettings, INITIAL_REPORT_SETTINGS);
  const today = useToday();
  const [date, setDate] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const studentNames = useMemo(() => getStudentNames(classDraft), [classDraft]);
  const noteDate = date || today || '';

  const notes = buildParentNotes(draft, {
    studentNames,
    teacherName: classDraft.teacherName,
    schoolName,
    city,
    date: noteDate,
  });

  const errors: FormError[] = [
    ...validateStudents(classDraft),
    ...(draft.message.trim() ? [] : [{ field: 'message', message: 'Escreva o texto do bilhete.' }]),
  ];
  const { visibleErrors, failedAttempts, validate } = useValidation(errors);

  const update = (changes: Parameters<typeof updateParentNote>[0]) =>
    dispatch(updateParentNote(changes));

  const insertStudentName = () => {
    const textarea = textareaRef.current;
    const { text, cursor } = insertText(
      draft.message,
      STUDENT_PLACEHOLDER,
      textarea?.selectionStart ?? draft.message.length,
      textarea?.selectionEnd ?? draft.message.length,
    );
    update({ message: text });
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={classDraft}
        studentNames={studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={visibleErrors}
        onChange={(changes) => splitChanges(changes)}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Texto do bilhete"
        description="Escreva uma vez: cada aluno recebe o seu, com o nome dele."
        status={<SaveStatus value={JSON.stringify(draft)} />}
        contentClassName="grid gap-8 space-y-0 lg:grid-cols-2"
      >
        <div className="space-y-5">
          <FormField id={fieldId('noteTitle')} label="Título" optional>
            {(control) => (
              <Input
                {...control}
                className="h-10 text-base md:text-base"
                value={draft.title}
                onChange={(event) => update({ title: event.target.value })}
              />
            )}
          </FormField>
          <FormField
            id={fieldId('message')}
            label="Mensagem"
            hint={`Clique em "Inserir o nome do aluno" (ou escreva ${STUDENT_PLACEHOLDER}) onde o nome deve aparecer.`}
            error={getFieldError(visibleErrors, 'message')}
          >
            {(control) => (
              <Textarea
                {...control}
                ref={textareaRef}
                lang="pt-BR"
                spellCheck
                className="min-h-48 text-base md:text-base"
                value={draft.message}
                placeholder={`Ex.: Senhores responsáveis por ${STUDENT_PLACEHOLDER}, convidamos para a reunião do dia 30, às 19h.`}
                onChange={(event) => update({ message: event.target.value })}
              />
            )}
          </FormField>
          <Button variant="outline" size="lg" className="h-10" onClick={insertStudentName}>
            <UserRound data-icon="inline-start" />
            Inserir o nome do aluno
          </Button>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id={fieldId('noteSchool')}
              label="Escola"
              optional
              hint="É a mesma dos relatórios."
            >
              {(control) => (
                <Input
                  {...control}
                  className="h-10 text-base md:text-base"
                  value={schoolName}
                  onChange={(event) =>
                    dispatch(updateReportSettings({ schoolName: event.target.value }))
                  }
                />
              )}
            </FormField>
            <FormField id={fieldId('noteCity')} label="Local" optional>
              {(control) => (
                <Input
                  {...control}
                  className="h-10 text-base md:text-base"
                  value={city}
                  placeholder="Ex.: Gama/DF"
                  onChange={(event) => dispatch(updateReportSettings({ city: event.target.value }))}
                />
              )}
            </FormField>
            <FormField id={fieldId('noteDate')} label="Data">
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  className="h-10 text-base md:text-base"
                  value={noteDate}
                  onChange={(event) => setDate(event.target.value)}
                />
              )}
            </FormField>
          </div>
          <Label className="items-start text-base font-normal leading-snug">
            <input
              type="checkbox"
              className="mt-0.5 size-5 shrink-0 accent-primary"
              checked={draft.includeReceipt}
              onChange={(event) => update({ includeReceipt: event.target.checked })}
            />
            Incluir a parte &quot;Ciente&quot; para o responsável recortar, assinar e devolver
          </Label>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Como vai ficar</h3>
          {notes[0] ? (
            <ParentNoteView note={notes[0]} notesPerPage={1} />
          ) : (
            <p className="text-muted-foreground">A prévia aparece quando houver alunos.</p>
          )}
        </div>
      </StepCard>

      <StepCard step={3} totalSteps={TOTAL_STEPS} title="Imprimir os bilhetes">
        <FieldGroup
          id="notes-per-page"
          legend="Quantos bilhetes em cada folha?"
          hint="Com mais bilhetes por folha, gasta menos papel; a letra fica um pouco menor."
        >
          <OptionButtons
            options={NOTES_PER_PAGE_OPTIONS}
            value={draft.notesPerPage}
            onChange={(notesPerPage) => update({ notesPerPage })}
          />
        </FieldGroup>
        <p className="text-lg font-medium">
          {pluralize(notes.length, 'bilhete', 'bilhetes')} ·{' '}
          {pluralize(Math.ceil(notes.length / draft.notesPerPage), 'folha', 'folhas')}
        </p>
        <ErrorSummary
          errors={visibleErrors}
          failedAttempts={failedAttempts}
          title="Antes de imprimir, falta arrumar:"
        />
        <PrintButton
          label="Imprimir os bilhetes"
          orientation="portrait"
          onBeforePrint={validate}
          renderContent={() =>
            chunk(notes, draft.notesPerPage).map((pageNotes, pageIndex) => (
              <section
                key={pageIndex}
                className="print-page flex flex-col"
                style={{ height: '277mm' }}
              >
                {pageNotes.map((note, index) => (
                  <div
                    key={index}
                    className="border-b border-dashed border-gray-400 last:border-b-0"
                    style={{ height: `${100 / draft.notesPerPage}%` }}
                  >
                    <ParentNoteView note={note} notesPerPage={draft.notesPerPage} isPrint />
                  </div>
                ))}
              </section>
            ))
          }
        />
      </StepCard>
    </div>
  );
};
