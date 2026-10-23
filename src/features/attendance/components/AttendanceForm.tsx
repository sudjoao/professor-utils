'use client';

import { ChoiceCards } from '@/components/ChoiceCards';
import { ExportPanel } from '@/components/ExportPanel';
import { FieldGroup, FormField } from '@/components/FormField';
import { PrintButton } from '@/components/print/PrintButton';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateRangesField } from '@/features/attendance/components/DateRangesField';
import { LessonCountField } from '@/features/attendance/components/LessonCountField';
import { LessonDatesPreview } from '@/features/attendance/components/LessonDatesPreview';
import { WeekdaysField } from '@/features/attendance/components/WeekdaysField';
import { COLUMN_MODE_CHOICES, MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { LESSONS_HELP } from '@/features/attendance/help';
import { buildAttendancePrint } from '@/features/attendance/services/buildAttendancePrint';
import { useAttendanceForm } from '@/features/attendance/hooks/useAttendanceForm';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { PrintableSheetView } from '@/features/classroom/components/PrintableSheetView';
import { SheetStyleField } from '@/features/classroom/components/SheetStyleField';
import { DOWNLOAD_HELP, SHEET_STYLE_HELP } from '@/features/classroom/help';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { fieldId, getFieldError } from '@/lib/forms/formErrors';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 4;

// ExcelJS is heavy: it downloads only when the download step comes near (see ExportPanel).
const loadWorkbookBuilder = () => import('@/features/attendance/services/buildAttendanceWorkbook');

export const AttendanceForm = () => {
  const form = useAttendanceForm();
  const { values, sheetData, sheetStyle, pageCount } = form;

  const fileExport = useFileExport({
    errors: form.errors,
    fileName: `${toFileName(
      values.columnMode === 'signature'
        ? values.signatureTitle || 'Lista de assinaturas'
        : 'Lista de chamada',
      values.classroomName,
    )}.xlsx`,
    buildFile: async () => {
      const { buildAttendanceWorkbook } = await loadWorkbookBuilder();
      return workbookToBlob(buildAttendanceWorkbook(sheetData));
    },
    preload: loadWorkbookBuilder,
  });
  const errors = fileExport.visibleErrors;

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={values}
        studentNames={sheetData.studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={errors}
        onChange={form.updateValues}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Tipo de lista e aulas"
        description="Escolha o tipo de lista e, se for de chamada, as aulas."
        help={LESSONS_HELP}
      >
        <FieldGroup id="attendance-column-mode" legend="Que lista você quer?">
          <ChoiceCards
            className="lg:grid-cols-3"
            choices={COLUMN_MODE_CHOICES}
            value={values.columnMode}
            onChange={(columnMode) => form.updateValues({ columnMode })}
          />
        </FieldGroup>

        {values.columnMode === 'dates' && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <DateRangesField
                dateRanges={values.dateRanges}
                schoolTerms={form.schoolTerms}
                currentTerm={form.currentTerm}
                error={getFieldError(errors, 'dateRanges')}
                onApplyTerm={form.applyTerm}
                onAdd={form.addDateRange}
                onUpdate={form.updateDateRange}
                onRemove={form.removeDateRange}
              />
              <WeekdaysField
                weekdays={values.weekdays}
                error={getFieldError(errors, 'weekdays')}
                onToggle={form.toggleWeekday}
                onSelect={(weekdays) => form.updateValues({ weekdays })}
              />
            </div>
            <LessonDatesPreview
              candidateDates={form.candidateDates}
              calendarNotes={form.calendarNotes}
              excludedDates={values.excludedDates}
              restoredDates={values.restoredDates}
              skipNoClassDays={values.skipNoClassDays}
              onToggleDate={form.toggleDate}
              onReset={form.resetDates}
              onSkipNoClassDaysChange={(skipNoClassDays) => form.updateValues({ skipNoClassDays })}
            />
          </div>
        )}
        {values.columnMode === 'count' && (
          <LessonCountField
            lessonCount={values.lessonCount}
            error={getFieldError(errors, 'lessonCount')}
            onChange={(lessonCount) => form.updateValues({ lessonCount })}
          />
        )}
        {values.columnMode === 'signature' ? (
          <FormField
            id={fieldId('signatureTitle')}
            label="Título da folha"
            optional
            hint='Aparece no topo. Se deixar em branco, sai "Lista de assinaturas".'
          >
            {(control) => (
              <Input
                {...control}
                className="h-10 max-w-xl text-base md:text-base"
                value={values.signatureTitle}
                placeholder="Ex.: Reunião de pais – 1º bimestre"
                onChange={(event) => form.updateValues({ signatureTitle: event.target.value })}
              />
            )}
          </FormField>
        ) : (
          <Label className="text-base font-normal">
            <input
              type="checkbox"
              className="size-5 accent-primary"
              checked={values.includeTotals}
              onChange={(event) => form.updateValues({ includeTotals: event.target.checked })}
            />
            Colocar no final as colunas &quot;Faltas&quot; e &quot;Frequência&quot;, calculadas pelo
            Excel conforme você marca P, F ou J
          </Label>
        )}
      </StepCard>

      <StepCard
        step={3}
        totalSteps={TOTAL_STEPS}
        title="Aparência da planilha"
        description="Escolha a cor e o tamanho da letra. Se preferir, é só pular este passo."
        status={<SaveStatus value={JSON.stringify(sheetStyle.preferences)} />}
        help={SHEET_STYLE_HELP}
      >
        <SheetStyleField
          preferences={sheetStyle.preferences}
          columnTitles={
            values.columnMode === 'signature'
              ? ['Assinatura']
              : sheetData.columns.map(({ label, caption }) =>
                  [label, caption].filter(Boolean).join(' '),
                )
          }
          studentNames={sheetData.studentNames}
          onChange={sheetStyle.updatePreferences}
        />
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Baixar a lista" help={DOWNLOAD_HELP}>
        <ExportPanel
          summary={
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {[
                  pluralize(sheetData.studentNames.length, 'aluno', 'alunos'),
                  values.columnMode === 'signature'
                    ? 'folha para assinar'
                    : pluralize(sheetData.columns.length, 'aula', 'aulas'),
                  pluralize(pageCount, 'página', 'páginas'),
                ].join(' · ')}
              </p>
              {pageCount > 1 && (
                <p className="text-muted-foreground">
                  Cada página tem até {MAX_COLUMNS_PER_PAGE} aulas, para caber numa folha A4
                  deitada. As páginas ficam em abas separadas embaixo da planilha. Na hora de
                  imprimir no Excel, escolha &quot;Imprimir pasta de trabalho inteira&quot; para
                  sair tudo de uma vez.
                </p>
              )}
            </div>
          }
          downloadLabel="Baixar planilha do Excel"
          openWith="o Excel (ou Google Planilhas, LibreOffice)"
          fileExport={fileExport}
          secondaryAction={
            <PrintButton
              orientation={values.columnMode === 'signature' ? 'portrait' : 'landscape'}
              onBeforePrint={fileExport.validate}
              renderContent={() => (
                <PrintableSheetView
                  sheet={buildAttendancePrint(sheetData)}
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
