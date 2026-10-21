'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { GradeColumnsField } from '@/features/grades/components/GradeColumnsField';
import { GradeColumnsPreview } from '@/features/grades/components/GradeColumnsPreview';
import { GradeSettingsField } from '@/features/grades/components/GradeSettingsField';
import { useGradesForm } from '@/features/grades/hooks/useGradesForm';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 3;

export const GradesForm = () => {
  const { values, updateValues, sheetData, errors, summaryColumnTitle } = useGradesForm();

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

      <StepCard step={3} totalSteps={TOTAL_STEPS} title="Baixar a lista">
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
