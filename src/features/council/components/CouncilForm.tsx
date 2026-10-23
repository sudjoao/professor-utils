'use client';

import { useMemo, useState } from 'react';

import { ExportPanel } from '@/components/ExportPanel';
import { FieldGroup, FormField } from '@/components/FormField';
import { OptionButtons } from '@/components/OptionButtons';
import { PrintButton } from '@/components/print/PrintButton';
import { StepCard } from '@/components/StepCard';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { PrintableSheetView } from '@/features/classroom/components/PrintableSheetView';
import { DOWNLOAD_HELP } from '@/features/classroom/help';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { useSheetStyle } from '@/features/classroom/hooks/useSheetStyle';
import type { ClassFormValues } from '@/features/classroom/types';
import { COUNCIL_COLUMNS, DEFAULT_COUNCIL_COLUMNS } from '@/features/council/constants';
import {
  buildCouncilPrint,
  buildCouncilSheetData,
  validateCouncilForm,
} from '@/features/council/services/buildCouncilSheet';
import type { CouncilColumnKey, CouncilFormValues } from '@/features/council/types';
import { TERM_OPTIONS } from '@/features/reports/constants';
import { findCurrentOrLastTerm } from '@/features/schoolCalendar/services/schoolCalendar';
import { getTodayIsoDate } from '@/lib/date/isoDate';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { fieldId, getFieldError } from '@/lib/forms/formErrors';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 3;

// ExcelJS is heavy: it downloads only when the download step comes near (see ExportPanel).
const loadWorkbookBuilder = () => import('@/features/council/services/buildCouncilWorkbook');

const getInitialValues = (): CouncilFormValues => ({
  term: findCurrentOrLastTerm(getTodayIsoDate())?.term ?? 1,
  columns: DEFAULT_COUNCIL_COLUMNS,
  customColumnsText: '',
  tallRows: true,
});

export const CouncilForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const sheetStyle = useSheetStyle();
  // Rendered only in the browser (inside RestoreGate), so reading today here is safe.
  const [councilValues, setCouncilValues] = useState<CouncilFormValues>(getInitialValues);
  const values = { ...classDraft, ...councilValues };
  const sheetData = useMemo(
    () => buildCouncilSheetData({ ...classDraft, ...councilValues }, sheetStyle.style),
    [classDraft, councilValues, sheetStyle.style],
  );
  const errors = validateCouncilForm(values);

  const updateValues = (changes: Partial<ClassFormValues & CouncilFormValues>) => {
    const councilChanges = splitChanges(changes);
    setCouncilValues((current) => ({ ...current, ...councilChanges }));
  };

  const toggleColumn = (key: CouncilColumnKey) =>
    updateValues({
      columns: councilValues.columns.includes(key)
        ? councilValues.columns.filter((column) => column !== key)
        : [...councilValues.columns, key],
    });

  const fileExport = useFileExport({
    errors,
    fileName: `${toFileName('Conselho de classe', `${councilValues.term}º bimestre`, classDraft.classroomName)}.xlsx`,
    buildFile: async () => {
      const { buildCouncilWorkbook } = await loadWorkbookBuilder();
      return workbookToBlob(buildCouncilWorkbook(sheetData));
    },
    preload: loadWorkbookBuilder,
  });
  const visibleErrors = fileExport.visibleErrors;

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={values}
        studentNames={sheetData.studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={visibleErrors}
        onChange={updateValues}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="O que vai na ficha"
        description="Escolha as colunas para preencher na reunião do conselho de classe."
      >
        <FieldGroup id={fieldId('councilTerm')} legend="Bimestre">
          <OptionButtons
            options={TERM_OPTIONS}
            value={councilValues.term}
            onChange={(term) => updateValues({ term })}
          />
        </FieldGroup>

        <FieldGroup
          id={fieldId('councilColumns')}
          legend="Colunas"
          error={getFieldError(visibleErrors, 'councilColumns')}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {COUNCIL_COLUMNS.map(({ key, title }) => (
              <Label key={key} className="text-base font-normal">
                <input
                  type="checkbox"
                  className="size-5 accent-primary"
                  checked={councilValues.columns.includes(key)}
                  onChange={() => toggleColumn(key)}
                />
                {title}
              </Label>
            ))}
          </div>
        </FieldGroup>

        <FormField
          id={fieldId('customColumnsText')}
          label="Outras colunas"
          optional
          hint="Uma por linha. Entram depois das colunas marcadas acima, com espaço para texto."
        >
          {(control) => (
            <Textarea
              {...control}
              className="min-h-24 text-base md:text-base"
              value={councilValues.customColumnsText}
              placeholder={'Ex.:\nAdequação curricular\nAtendimento na sala de recursos'}
              onChange={(event) => updateValues({ customColumnsText: event.target.value })}
            />
          )}
        </FormField>

        <Label className="text-base font-normal">
          <input
            type="checkbox"
            className="size-5 accent-primary"
            checked={councilValues.tallRows}
            onChange={(event) => updateValues({ tallRows: event.target.checked })}
          />
          Linhas altas, para escrever à mão
        </Label>
      </StepCard>

      <StepCard step={3} totalSteps={TOTAL_STEPS} title="Baixar ou imprimir" help={DOWNLOAD_HELP}>
        <ExportPanel
          summary={
            <p className="text-lg font-medium">
              {pluralize(sheetData.studentNames.length, 'aluno', 'alunos')} ·{' '}
              {pluralize(sheetData.columns.length, 'coluna', 'colunas')}
            </p>
          }
          downloadLabel="Baixar planilha do Excel"
          openWith="o Excel (ou Google Planilhas, LibreOffice)"
          fileExport={fileExport}
          secondaryAction={
            <PrintButton
              orientation="landscape"
              onBeforePrint={fileExport.validate}
              renderContent={() => (
                <PrintableSheetView
                  sheet={buildCouncilPrint(sheetData)}
                  preferences={sheetStyle.preferences}
                />
              )}
            />
          }
        />
      </StepCard>
    </div>
  );
};
