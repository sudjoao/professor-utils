'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { SheetStyleField } from '@/features/classroom/components/SheetStyleField';
import { DOWNLOAD_HELP, SHEET_STYLE_HELP } from '@/features/classroom/help';
import { GradeColumnsField } from '@/features/grades/components/GradeColumnsField';
import { GradeColumnsPreview } from '@/features/grades/components/GradeColumnsPreview';
import { GradeSettingsField } from '@/features/grades/components/GradeSettingsField';
import { GRADES_HELP } from '@/features/grades/help';
import { useGradesForm } from '@/features/grades/hooks/useGradesForm';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 4;

export const GradesForm = () => {
  const { values, updateValues, sheetData, sheetStyle, errors, summaryColumnTitle } =
    useGradesForm();

  const fileExport = useFileExport({
    errors,
    fileName: `${toFileName('Lista de notas', values.classroomName)}.xlsx`,
    buildFile: async () => {
      const { buildGradesWorkbook } =
        await import('@/features/grades/services/buildGradesWorkbook');
      return workbookToBlob(buildGradesWorkbook(sheetData));
    },
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
        title="Notas"
        description="Escolha quantas notas a turma vai ter ou dê um nome para cada uma."
        help={GRADES_HELP}
        contentClassName="grid gap-8 space-y-0 lg:grid-cols-2"
      >
        <div className="space-y-6">
          <GradeColumnsField
            columnMode={values.columnMode}
            gradeCount={values.gradeCount}
            gradeTitlesText={values.gradeTitlesText}
            errors={visibleErrors}
            onChange={updateValues}
          />
          <GradeColumnsPreview
            gradeTitles={sheetData.gradeTitles}
            summaryColumnTitle={summaryColumnTitle}
          />
        </div>
        <GradeSettingsField
          summary={values.summary}
          maxGrade={values.maxGrade}
          errors={visibleErrors}
          onChange={updateValues}
        />
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
            summaryColumnTitle
              ? [...sheetData.gradeTitles, summaryColumnTitle]
              : sheetData.gradeTitles
          }
          studentNames={sheetData.studentNames}
          onChange={sheetStyle.updatePreferences}
        />
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Baixar a lista" help={DOWNLOAD_HELP}>
        <ExportPanel
          summary={
            <p className="text-lg font-medium">
              {pluralize(sheetData.studentNames.length, 'aluno', 'alunos')} ·{' '}
              {pluralize(sheetData.gradeTitles.length, 'nota', 'notas')}
            </p>
          }
          downloadLabel="Baixar planilha do Excel"
          openWith="o Excel (ou Google Planilhas, LibreOffice)"
          fileExport={fileExport}
        />
      </StepCard>
    </div>
  );
};
