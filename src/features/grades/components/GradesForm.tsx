'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { GradeColumnsField } from '@/features/grades/components/GradeColumnsField';
import { GradeColumnsPreview } from '@/features/grades/components/GradeColumnsPreview';
import { GradeSettingsField } from '@/features/grades/components/GradeSettingsField';
import { useGradesForm } from '@/features/grades/hooks/useGradesForm';
import { useWorkbookExport } from '@/lib/excel/useWorkbookExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

export const GradesForm = () => {
  const { values, updateValues, sheetData, errors, summaryColumnTitle } = useGradesForm();

  const { visibleErrors, isExporting, exportError, exportWorkbook } = useWorkbookExport({
    errors,
    fileName: toFileName('Lista de notas', values.classroomName),
    loadWorkbook: async () => {
      const { buildGradesWorkbook } =
        await import('@/features/grades/services/buildGradesWorkbook');
      return buildGradesWorkbook(sheetData);
    },
  });

  return (
    <div className="space-y-6">
      <ClassroomCard
        title="1. Turma e alunos"
        values={values}
        studentNames={sheetData.studentNames}
        onChange={updateValues}
      />

      <Card>
        <CardHeader>
          <CardTitle>2. Notas</CardTitle>
          <CardDescription>
            Escolha quantas notas a turma vai ter ou digite o título de cada uma.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <GradeColumnsField
              columnMode={values.columnMode}
              gradeCount={values.gradeCount}
              gradeTitlesText={values.gradeTitlesText}
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
            onChange={updateValues}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Exportar</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportPanel
            summary={
              <p className="text-sm">
                {pluralize(sheetData.studentNames.length, 'aluno', 'alunos')} ·{' '}
                {pluralize(sheetData.gradeTitles.length, 'nota', 'notas')}
              </p>
            }
            errors={visibleErrors}
            isExporting={isExporting}
            exportError={exportError}
            onExport={exportWorkbook}
          />
        </CardContent>
      </Card>
    </div>
  );
};
