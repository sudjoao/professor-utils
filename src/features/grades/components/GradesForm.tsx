'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { PrintButton } from '@/components/print/PrintButton';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { PrintableSheetView } from '@/features/classroom/components/PrintableSheetView';
import { SheetStyleField } from '@/features/classroom/components/SheetStyleField';
import { DOWNLOAD_HELP, SHEET_STYLE_HELP } from '@/features/classroom/help';
import { GradeColumnsField } from '@/features/grades/components/GradeColumnsField';
import { GradeColumnsPreview } from '@/features/grades/components/GradeColumnsPreview';
import { GradeSettingsField } from '@/features/grades/components/GradeSettingsField';
import { GRADES_HELP } from '@/features/grades/help';
import { useGradesForm } from '@/features/grades/hooks/useGradesForm';
import { buildGradesPrint } from '@/features/grades/services/buildGradesPrint';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 4;

// ExcelJS is heavy: it downloads only when the download step comes near (see ExportPanel).
const loadWorkbookBuilder = () => import('@/features/grades/services/buildGradesWorkbook');

export const GradesForm = () => {
  const { values, updateValues, sheetData, sheetStyle, errors, resultTitles } = useGradesForm();

  const fileExport = useFileExport({
    errors,
    fileName: `${toFileName('Lista de notas', values.classroomName)}.xlsx`,
    buildFile: async () => {
      const { buildGradesWorkbook } = await loadWorkbookBuilder();
      return workbookToBlob(buildGradesWorkbook(sheetData));
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
          <GradeColumnsPreview gradeTitles={sheetData.gradeTitles} resultTitles={resultTitles} />
        </div>
        <GradeSettingsField
          summary={values.summary}
          maxGrade={values.maxGrade}
          weighted={values.weighted}
          weights={values.weights}
          includeRecovery={values.includeRecovery}
          includeStatus={values.includeStatus}
          passingGrade={values.passingGrade}
          gradeTitles={sheetData.gradeTitles}
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
          columnTitles={[...sheetData.gradeTitles, ...resultTitles]}
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
          secondaryAction={
            <PrintButton
              orientation={buildGradesPrint(sheetData).orientation}
              onBeforePrint={fileExport.validate}
              renderContent={() => (
                <PrintableSheetView
                  sheet={buildGradesPrint(sheetData)}
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
