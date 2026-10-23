'use client';

import { ChoiceCards } from '@/components/ChoiceCards';
import { ExportPanel } from '@/components/ExportPanel';
import { FieldGroup } from '@/components/FormField';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { DateRangesField } from '@/features/attendance/components/DateRangesField';
import { LessonCountField } from '@/features/attendance/components/LessonCountField';
import { LessonDatesPreview } from '@/features/attendance/components/LessonDatesPreview';
import { WeekdaysField } from '@/features/attendance/components/WeekdaysField';
import { COLUMN_MODE_CHOICES, MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { LESSONS_HELP } from '@/features/attendance/help';
import { useAttendanceForm } from '@/features/attendance/hooks/useAttendanceForm';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { SheetStyleField } from '@/features/classroom/components/SheetStyleField';
import { DOWNLOAD_HELP, SHEET_STYLE_HELP } from '@/features/classroom/help';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { getFieldError } from '@/lib/forms/formErrors';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 4;

export const AttendanceForm = () => {
  const form = useAttendanceForm();
  const { values, sheetData, sheetStyle, pageCount } = form;

  const fileExport = useFileExport({
    errors: form.errors,
    fileName: `${toFileName('Lista de chamada', values.classroomName)}.xlsx`,
    buildFile: async () => {
      const { buildAttendanceWorkbook } =
        await import('@/features/attendance/services/buildAttendanceWorkbook');
      return workbookToBlob(buildAttendanceWorkbook(sheetData));
    },
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
        title="Aulas"
        description="Escolha como as colunas das aulas vão aparecer na lista."
        help={LESSONS_HELP}
      >
        <FieldGroup id="attendance-column-mode" legend="Como você quer as colunas?">
          <ChoiceCards
            choices={COLUMN_MODE_CHOICES}
            value={values.columnMode}
            onChange={(columnMode) => form.updateValues({ columnMode })}
          />
        </FieldGroup>

        {values.columnMode === 'dates' ? (
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
        ) : (
          <LessonCountField
            lessonCount={values.lessonCount}
            error={getFieldError(errors, 'lessonCount')}
            onChange={(lessonCount) => form.updateValues({ lessonCount })}
          />
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
          columnTitles={sheetData.columns.map(({ label, caption }) =>
            [label, caption].filter(Boolean).join(' '),
          )}
          studentNames={sheetData.studentNames}
          onChange={sheetStyle.updatePreferences}
        />
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Baixar a lista" help={DOWNLOAD_HELP}>
        <ExportPanel
          summary={
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {pluralize(sheetData.studentNames.length, 'aluno', 'alunos')} ·{' '}
                {pluralize(sheetData.columns.length, 'aula', 'aulas')} ·{' '}
                {pluralize(pageCount, 'página', 'páginas')}
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
        />
      </StepCard>
    </div>
  );
};
