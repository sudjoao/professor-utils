'use client';

import { useState } from 'react';

import { ChoiceCards } from '@/components/ChoiceCards';
import { ExportPanel } from '@/components/ExportPanel';
import { FieldGroup } from '@/components/FormField';
import { SaveStatus } from '@/components/SaveStatus';
import { StepCard } from '@/components/StepCard';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { DOWNLOAD_HELP } from '@/features/classroom/help';
import { CommonTextField } from '@/features/reports/components/CommonTextField';
import { HeaderImageField } from '@/features/reports/components/HeaderImageField';
import { ReportPreview } from '@/features/reports/components/ReportPreview';
import { StudentEvaluationsField } from '@/features/reports/components/StudentEvaluationsField';
import { TermFields } from '@/features/reports/components/TermFields';
import { type TextField, TextFieldsGrid } from '@/features/reports/components/TextFieldsGrid';
import {
  EVALUATION_HELP,
  SCHOOL_HELP,
  SIGNATURES_HELP,
  STUDENT_EVALUATIONS_HELP,
} from '@/features/reports/help';
import { useReportForm } from '@/features/reports/hooks/useReportForm';
import { REPORT_SETTINGS_KEYS } from '@/features/reports/reportSettingsSlice';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const TOTAL_STEPS = 6;

// docx is heavy: it downloads only when the download step comes near (see ExportPanel).
const loadReportGenerator = () => import('@/features/reports/services/generateReportFile');

type ExportMode = 'single' | 'perStudent';

const EXPORT_MODE_CHOICES: { value: ExportMode; label: string; description: string }[] = [
  {
    value: 'single',
    label: 'Um arquivo com todos os alunos',
    description: 'Cada aluno começa numa página nova. Mais fácil para imprimir tudo de uma vez.',
  },
  {
    value: 'perStudent',
    label: 'Um arquivo para cada aluno',
    description: 'Vêm todos juntos num arquivo .zip. Bom para enviar o relatório de cada um.',
  },
];

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
  const {
    values,
    updateValues,
    saveHeaderImage,
    getEvaluation,
    updateEvaluation,
    clearEvaluations,
    studentNames,
    errors,
    currentTerm,
    isSchoolDaysFromCalendar,
  } = useReportForm();

  const [exportMode, setExportMode] = useState<ExportMode>('single');

  const fileExport = useFileExport({
    errors,
    fileName: `${toFileName('RAv', `${values.term}º bimestre`, values.classroomName)}.${
      exportMode === 'perStudent' ? 'zip' : 'docx'
    }`,
    buildFile: async () => {
      const { generateReportFile, generateReportZip } = await loadReportGenerator();
      return exportMode === 'perStudent' ? generateReportZip(values) : generateReportFile(values);
    },
    preload: loadReportGenerator,
  });
  const visibleErrors = fileExport.visibleErrors;
  const evaluatedCount = studentNames.filter((name) => getEvaluation(name)?.text.trim()).length;
  const savedSettings = JSON.stringify([
    ...REPORT_SETTINGS_KEYS.map((key) => values[key]),
    // The length is enough to notice a new image, without comparing ~1 MB of text.
    values.headerImage?.length,
  ]);

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
        status={<SaveStatus value={savedSettings} />}
        help={SCHOOL_HELP}
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

      <StepCard
        step={3}
        totalSteps={TOTAL_STEPS}
        title="Local, data e assinaturas"
        status={<SaveStatus value={savedSettings} />}
        help={SIGNATURES_HELP}
      >
        <TextFieldsGrid
          fields={SIGNATURE_FIELDS}
          values={values}
          errors={visibleErrors}
          onChange={updateValues}
        />
        <HeaderImageField headerImage={values.headerImage} onChange={saveHeaderImage} />
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Texto da avaliação" help={EVALUATION_HELP}>
        <CommonTextField
          commonText={values.commonText}
          firstStudentName={studentNames[0]}
          onChange={(commonText) => updateValues({ commonText })}
        />
      </StepCard>

      <StepCard
        step={5}
        totalSteps={TOTAL_STEPS}
        title="Avaliação de cada aluno"
        description="Opcional. Escreva aqui a avaliação e as faltas de cada aluno; o que ficar em branco você completa no Word."
        status={<SaveStatus value={JSON.stringify(values.evaluations).length.toString()} />}
        help={STUDENT_EVALUATIONS_HELP}
      >
        <StudentEvaluationsField
          studentNames={studentNames}
          schoolDays={values.schoolDays}
          getEvaluation={getEvaluation}
          onChange={updateEvaluation}
          onClear={clearEvaluations}
        />
      </StepCard>

      <StepCard step={6} totalSteps={TOTAL_STEPS} title="Baixar os relatórios" help={DOWNLOAD_HELP}>
        <details className="rounded-xl border-2">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 text-lg font-medium">
            Ver como vai ficar (prévia)
          </summary>
          <div className="px-4 pb-4">
            <ReportPreview values={values} />
          </div>
        </details>

        <FieldGroup id="report-export-mode" legend="Como você quer os arquivos?">
          <ChoiceCards choices={EXPORT_MODE_CHOICES} value={exportMode} onChange={setExportMode} />
        </FieldGroup>

        <ExportPanel
          summary={
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {pluralize(studentNames.length, 'relatório', 'relatórios')}{' '}
                {exportMode === 'perStudent'
                  ? '(um arquivo para cada aluno, dentro de um .zip)'
                  : '(num arquivo só, cada aluno começando numa página nova)'}
              </p>
              <p className="text-muted-foreground">
                {evaluatedCount === studentNames.length && studentNames.length > 0
                  ? 'Todos os alunos já têm avaliação escrita aqui.'
                  : `${evaluatedCount} de ${studentNames.length} alunos com avaliação escrita aqui; o que faltar (avaliação ou faltas) você completa no Word.`}
              </p>
            </div>
          }
          downloadLabel={
            exportMode === 'perStudent'
              ? 'Baixar um arquivo do Word por aluno (.zip)'
              : 'Baixar relatórios do Word'
          }
          openWith={
            exportMode === 'perStudent'
              ? 'um clique duplo para ver os arquivos de cada aluno (no Windows, se pedir, use "Extrair tudo") e abra cada um no Word'
              : 'o Word (ou Google Documentos, LibreOffice)'
          }
          fileExport={fileExport}
        />
      </StepCard>
    </div>
  );
};
