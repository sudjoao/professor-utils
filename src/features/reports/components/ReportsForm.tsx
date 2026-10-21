'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { CommonTextField } from '@/features/reports/components/CommonTextField';
import { HeaderImageField } from '@/features/reports/components/HeaderImageField';
import { TermFields } from '@/features/reports/components/TermFields';
import { type TextField, TextFieldsGrid } from '@/features/reports/components/TextFieldsGrid';
import { useReportForm } from '@/features/reports/hooks/useReportForm';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

const SCHOOL_FIELDS: TextField[] = [
  {
    name: 'regionalCoordination',
    label: 'Coordenação Regional de Ensino',
    placeholder: 'Ex.: Gama',
  },
  { name: 'schoolName', label: 'Unidade Escolar', placeholder: 'Ex.: Escola Classe 18 do Gama' },
  { name: 'stage', label: 'Etapa', placeholder: 'Ex.: Ensino Fundamental – Anos Iniciais' },
  { name: 'grade', label: 'Ano', placeholder: 'Ex.: 3º' },
  { name: 'schoolYear', label: 'Ano letivo', placeholder: 'Ex.: 2026' },
];

const SIGNATURE_FIELDS: TextField[] = [
  { name: 'city', label: 'Local', placeholder: 'Ex.: Gama/DF' },
  { name: 'documentDate', label: 'Data do documento', type: 'date' },
  {
    name: 'teacherRegistration',
    label: 'Matrícula do(a) professor(a)',
    placeholder: 'Ex.: 32215-6',
  },
  {
    name: 'coordinatorRegistration',
    label: 'Matrícula do(a) coordenador(a)',
    placeholder: 'Ex.: 210825-9',
  },
];

export const ReportsForm = () => {
  const { values, updateValues, studentNames, errors } = useReportForm();

  const { visibleErrors, isExporting, exportError, exportFile } = useFileExport({
    errors,
    fileName: `${toFileName('RAv', `${values.term}º bimestre`, values.classroomName)}.docx`,
    buildFile: async () => {
      // docx is heavy, so it is only downloaded when the teacher exports.
      const { generateReportFile } = await import('@/features/reports/services/generateReportFile');
      return generateReportFile(values);
    },
  });

  return (
    <div className="space-y-6">
      <ClassroomCard
        title="1. Turma e alunos"
        values={values}
        studentNames={studentNames}
        hiddenFields={['subject']}
        onChange={updateValues}
      />

      <Card>
        <CardHeader>
          <CardTitle>2. Escola e período</CardTitle>
          <CardDescription>
            Os dados da escola ficam salvos neste navegador para os próximos bimestres.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextFieldsGrid fields={SCHOOL_FIELDS} values={values} onChange={updateValues} />
          <TermFields
            term={values.term}
            shift={values.shift}
            schoolDays={values.schoolDays}
            onChange={updateValues}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Assinaturas e cabeçalho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextFieldsGrid fields={SIGNATURE_FIELDS} values={values} onChange={updateValues} />
          <HeaderImageField
            headerImage={values.headerImage}
            onChange={(headerImage) => updateValues({ headerImage })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Texto da avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <CommonTextField
            commonText={values.commonText}
            onChange={(commonText) => updateValues({ commonText })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Exportar</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportPanel
            summary={
              <>
                <p className="text-sm">
                  {pluralize(studentNames.length, 'relatório', 'relatórios')} (um por aluno, cada um
                  começando em uma nova página)
                </p>
                <p className="text-xs text-muted-foreground">
                  O total de faltas e a avaliação de cada aluno ficam para você preencher no Word.
                </p>
              </>
            }
            errors={visibleErrors}
            isExporting={isExporting}
            exportError={exportError}
            downloadLabel="Baixar relatórios (.docx)"
            onExport={exportFile}
          />
        </CardContent>
      </Card>
    </div>
  );
};
