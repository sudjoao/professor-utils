'use client';

import { useMemo, useState } from 'react';

import { ChoiceCards } from '@/components/ChoiceCards';
import { ErrorSummary } from '@/components/ErrorSummary';
import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { PrintButton } from '@/components/print/PrintButton';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { getStudentNames } from '@/features/classroom/services/classForm';
import type { ClassFormValues } from '@/features/classroom/types';
import { LabelSheetView } from '@/features/labels/components/LabelSheetView';
import {
  INITIAL_LABELS_VALUES,
  LABEL_MODELS,
  MAX_COPIES_PER_STUDENT,
} from '@/features/labels/constants';
import { LABELS_HELP, PRINT_LABELS_HELP } from '@/features/labels/help';
import {
  buildLabelDetails,
  buildLabelSheets,
  getLabelModel,
  labelsPerSheet,
} from '@/features/labels/services/buildLabelSheets';
import { validateLabelsForm } from '@/features/labels/services/validateLabelsForm';
import type { LabelsFormValues } from '@/features/labels/types';
import { fieldId, getFieldError } from '@/lib/forms/formErrors';
import { useValidation } from '@/lib/forms/useValidation';
import { pluralize } from '@/lib/text/pluralize';

const TOTAL_STEPS = 3;

/** Shows the first sheet at about half its size, which fits the form column. */
const PREVIEW_SCALE = 0.42;

const MODEL_CHOICES = LABEL_MODELS.map(({ id, label, description }) => ({
  value: id,
  label,
  description,
}));

export const LabelsForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const [labelValues, setLabelValues] = useState<LabelsFormValues>(INITIAL_LABELS_VALUES);
  const values = { ...classDraft, ...labelValues };
  const studentNames = useMemo(() => getStudentNames(classDraft), [classDraft]);
  const model = getLabelModel(labelValues.modelId);
  const errors = validateLabelsForm(values);
  const { visibleErrors, failedAttempts, validate } = useValidation(errors);

  const updateValues = (changes: Partial<ClassFormValues & LabelsFormValues>) => {
    const labelChanges = splitChanges(changes);
    setLabelValues((current) => ({ ...current, ...labelChanges }));
  };

  const sheets = useMemo(() => {
    const details = buildLabelDetails({ ...classDraft, ...labelValues });
    return buildLabelSheets({
      labels: studentNames.map((name) => ({ name, details })),
      model,
      copiesPerStudent: labelValues.copiesPerStudent,
      startAt: labelValues.startAt,
    });
  }, [classDraft, labelValues, model, studentNames]);

  const labelCount = studentNames.length * labelValues.copiesPerStudent;

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={values}
        studentNames={studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={visibleErrors}
        onChange={updateValues}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Etiquetas"
        description="Escolha a folha de etiquetas que você tem e o que vai em cada uma."
        help={LABELS_HELP}
        contentClassName="grid gap-8 space-y-0 lg:grid-cols-2"
      >
        <div className="space-y-6">
          <FieldGroup
            id="labels-model"
            legend="Qual folha você vai usar?"
            hint="O tamanho está escrito na embalagem das etiquetas."
          >
            <ChoiceCards
              className="sm:grid-cols-1"
              choices={MODEL_CHOICES}
              value={labelValues.modelId}
              onChange={(modelId) => updateValues({ modelId, startAt: 1 })}
            />
          </FieldGroup>

          <FormField
            id={fieldId('copiesPerStudent')}
            label="Etiquetas para cada aluno"
            hint="Ex.: 3, para o caderno, a pasta e o livro."
            error={getFieldError(visibleErrors, 'copiesPerStudent')}
          >
            {(control) => (
              <NumberField
                {...control}
                name="as etiquetas por aluno"
                min={1}
                max={MAX_COPIES_PER_STUDENT}
                value={labelValues.copiesPerStudent}
                onChange={(copiesPerStudent) => updateValues({ copiesPerStudent })}
              />
            )}
          </FormField>

          <FormField
            id={fieldId('startAt')}
            label="Começar na etiqueta número"
            hint={`Para aproveitar uma folha já usada em parte. Conte da esquerda para a direita, de cima para baixo (1 a ${labelsPerSheet(model)}).`}
            error={getFieldError(visibleErrors, 'startAt')}
          >
            {(control) => (
              <NumberField
                {...control}
                name="a etiqueta de começo"
                min={1}
                max={labelsPerSheet(model)}
                value={labelValues.startAt}
                onChange={(startAt) => updateValues({ startAt })}
              />
            )}
          </FormField>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-base font-medium">Além do nome, escrever:</legend>
            <Label className="text-base font-normal">
              <input
                type="checkbox"
                className="size-5 accent-primary"
                checked={labelValues.showClassroom}
                onChange={(event) => updateValues({ showClassroom: event.target.checked })}
              />
              A turma
            </Label>
            <Label className="text-base font-normal">
              <input
                type="checkbox"
                className="size-5 accent-primary"
                checked={labelValues.showSubject}
                onChange={(event) => updateValues({ showSubject: event.target.checked })}
              />
              A disciplina
            </Label>
            <FormField id={fieldId('extraText')} label="Outro texto" optional>
              {(control) => (
                <Input
                  {...control}
                  className="h-10 text-base md:text-base"
                  value={labelValues.extraText}
                  placeholder="Ex.: Escola Classe 18 do Gama"
                  onChange={(event) => updateValues({ extraText: event.target.value })}
                />
              )}
            </FormField>
          </fieldset>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Como a primeira folha vai ficar</h3>
          <div
            className="overflow-hidden rounded-lg border bg-muted"
            style={{ width: `${210 * PREVIEW_SCALE}mm`, height: `${297 * PREVIEW_SCALE}mm` }}
            aria-hidden
          >
            <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left' }}>
              <LabelSheetView sheet={sheets[0] ?? []} model={model} />
            </div>
          </div>
        </div>
      </StepCard>

      <StepCard step={3} totalSteps={TOTAL_STEPS} title="Imprimir" help={PRINT_LABELS_HELP}>
        <p className="text-lg font-medium">
          {pluralize(labelCount, 'etiqueta', 'etiquetas')} ·{' '}
          {pluralize(sheets.length, 'folha', 'folhas')}
        </p>
        <p className="rounded-xl border-l-4 border-note bg-muted px-4 py-3">
          Na janela de impressão, deixe o tamanho em <strong>100%</strong> (ou &quot;Tamanho
          real&quot;), sem &quot;Ajustar à página&quot;. Na primeira vez, imprima numa folha comum e
          coloque-a por cima da folha de etiquetas, contra a luz, para conferir.
        </p>
        <ErrorSummary
          errors={visibleErrors}
          failedAttempts={failedAttempts}
          title="Antes de imprimir, falta arrumar:"
        />
        <PrintButton
          label="Imprimir as etiquetas"
          orientation="portrait"
          pageMargin="0"
          onBeforePrint={validate}
          renderContent={() =>
            sheets.map((sheet, index) => (
              <LabelSheetView key={index} sheet={sheet} model={model} isPrint />
            ))
          }
        />
      </StepCard>
    </div>
  );
};
