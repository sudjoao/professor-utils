'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { CommonTextField } from '@/features/reports/components/CommonTextField';
import { HeaderImageField } from '@/features/reports/components/HeaderImageField';
import { TermFields } from '@/features/reports/components/TermFields';
import { type TextField, TextFieldsGrid } from '@/features/reports/components/TextFieldsGrid';
import { useReportForm } from '@/features/reports/hooks/useReportForm';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 5;

const SCHOOL_FIELDS: TextField[] = [
  {
    name: 'regionalCoordination',
    label: 'Coordenação Regional de Ensino',
    placeholder: 'Ex.: Gama',
    hint: 'Só o nome da regional.',
  },
  { name: 'schoolName', label: 'Unidade Escolar', placeholder: 'Ex.: Escola Classe 18 do Gama' },
  { name: 'stage', label: 'Etapa', placeholder: 'Ex.: Ensino Fundamental – Anos Iniciais' },
  { name: 'grade', label: 'Ano', placeholder: 'Ex.: 3º' },
  { name: 'schoolYear', label: 'Ano letivo', placeholder: 'Ex.: 2026' },
];

const SIGNATURE_FIELDS: TextField[] = [
  {
    name: 'city',
    label: 'Local',
    placeholder: 'Ex.: Gama/DF',
    hint: 'Cidade que vai antes da data.',
  },
  { name: 'documentDate', label: 'Data do documento', type: 'date' },
  {
    name: 'teacherRegistration',
    label: 'Matrícula do(a) professor(a)',
    placeholder: 'Ex.: 32215-6',
    optional: true,
  },
  {
    name: 'coordinatorRegistration',
    label: 'Matrícula do(a) coordenador(a)',
    placeholder: 'Ex.: 210825-9',
    optional: true,
  },
];

export const ReportsForm = () => {
  const { values, updateValues, studentNames, errors, currentTerm, isSchoolDaysFromCalendar } =
    useReportForm();

  const fileExport = useFileExport({
    errors,
    fileName: `${toFileName('RAv', `${values.term}º bimestre`, values.classroomName)}.docx`,
    buildFile: async () => {
      // docx is heavy, so it is only downloaded when the teacher exports.
      const { generateReportFile } = await import('@/features/reports/services/generateReportFile');
      return generateReportFile(values);
    },
  });
  const visibleErrors = fileExport.visibleErrors;

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={values}
        studentNames={studentNames}
        hiddenFields={['subject']}
        errors={visibleErrors}
        onChange={updateValues}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Escola e bimestre"
        description="Os dados da escola ficam salvos neste computador para os próximos bimestres."
      >
        <TextFieldsGrid
          fields={SCHOOL_FIELDS}
          values={values}
          errors={visibleErrors}
          onChange={updateValues}
        />
        <TermFields
          term={values.term}
          shift={values.shift}
          schoolDays={values.schoolDays}
          currentTerm={currentTerm}
          isSchoolDaysFromCalendar={isSchoolDaysFromCalendar}
          errors={visibleErrors}
          onChange={updateValues}
        />
      </StepCard>

      <StepCard step={3} totalSteps={TOTAL_STEPS} title="Local, data e assinaturas">
        <TextFieldsGrid
          fields={SIGNATURE_FIELDS}
          values={values}
          errors={visibleErrors}
          onChange={updateValues}
        />
        <HeaderImageField
          headerImage={values.headerImage}
          onChange={(headerImage) => updateValues({ headerImage })}
        />
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Texto da avaliação">
        <CommonTextField
          commonText={values.commonText}
          firstStudentName={studentNames[0]}
          onChange={(commonText) => updateValues({ commonText })}
        />
      </StepCard>

      <StepCard step={5} totalSteps={TOTAL_STEPS} title="Baixar os relatórios">
        <ExportPanel
          summary={
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {pluralize(studentNames.length, 'relatório', 'relatórios')} (um por aluno, cada um
                começando numa página nova)
              </p>
              <p className="text-muted-foreground">
                O total de faltas e a avaliação de cada aluno ficam para você preencher no Word.
              </p>
            </div>
          }
          downloadLabel="Baixar relatórios do Word"
          openWith="o Word (ou Google Documentos, LibreOffice)"
          fileExport={fileExport}
        />
      </StepCard>
    </div>
  );
};
