'use client';

import { ExportPanel } from '@/components/ExportPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangesField } from '@/features/attendance/components/DateRangesField';
import { LessonCountField } from '@/features/attendance/components/LessonCountField';
import { LessonDatesPreview } from '@/features/attendance/components/LessonDatesPreview';
import { WeekdaysField } from '@/features/attendance/components/WeekdaysField';
import { MAX_COLUMNS_PER_PAGE } from '@/features/attendance/constants';
import { useAttendanceForm } from '@/features/attendance/hooks/useAttendanceForm';
import type { ColumnMode } from '@/features/attendance/types';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { workbookToBlob } from '@/lib/excel/workbookToBlob';
import { useFileExport } from '@/lib/files/useFileExport';
import { pluralize } from '@/lib/text/pluralize';
import { toFileName } from '@/lib/text/slugify';

export const AttendanceForm = () => {
  const form = useAttendanceForm();
  const { values, sheetData, pageCount } = form;

  const { visibleErrors, isExporting, exportError, exportFile } = useFileExport({
    errors: form.errors,
    fileName: `${toFileName('Lista de chamada', values.classroomName)}.xlsx`,
    buildFile: async () => {
      const { buildAttendanceWorkbook } =
        await import('@/features/attendance/services/buildAttendanceWorkbook');
      return workbookToBlob(buildAttendanceWorkbook(sheetData));
    },
  });

  return (
    <div className="space-y-6">
      <ClassroomCard
        title="1. Turma e alunos"
        values={values}
        studentNames={sheetData.studentNames}
        onChange={form.updateValues}
      />

      <Card>
        <CardHeader>
          <CardTitle>2. Aulas</CardTitle>
          <CardDescription>
            Escolha as datas que vão aparecer na lista ou apenas a quantidade de colunas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={values.columnMode}
            onValueChange={(mode) => form.updateValues({ columnMode: mode as ColumnMode })}
          >
            <TabsList>
              <TabsTrigger value="dates">Por datas</TabsTrigger>
              <TabsTrigger value="count">Por quantidade de aulas</TabsTrigger>
            </TabsList>

            <TabsContent value="dates" className="grid gap-6 pt-4 lg:grid-cols-2">
              <div className="space-y-6">
                <DateRangesField
                  dateRanges={values.dateRanges}
                  onAdd={form.addDateRange}
                  onUpdate={form.updateDateRange}
                  onRemove={form.removeDateRange}
                />
                <WeekdaysField
                  weekdays={values.weekdays}
                  onToggle={form.toggleWeekday}
                  onSelect={(weekdays) => form.updateValues({ weekdays })}
                />
              </div>
              <LessonDatesPreview
                candidateDates={form.candidateDates}
                excludedDates={values.excludedDates}
                onToggleDate={form.toggleExcludedDate}
              />
            </TabsContent>

            <TabsContent value="count" className="pt-4">
              <LessonCountField
                lessonCount={values.lessonCount}
                onChange={(lessonCount) => form.updateValues({ lessonCount })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Exportar</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportPanel
            summary={
              <>
                <p className="text-sm">
                  {pluralize(sheetData.studentNames.length, 'aluno', 'alunos')} ·{' '}
                  {pluralize(sheetData.columns.length, 'aula', 'aulas')} ·{' '}
                  {pluralize(pageCount, 'página', 'páginas')}
                </p>
                {pageCount > 1 && (
                  <p className="text-xs text-muted-foreground">
                    Cada página tem até {MAX_COLUMNS_PER_PAGE} aulas para caber na largura de uma
                    folha A4 deitada. As páginas ficam em abas separadas da planilha; para imprimir
                    todas, escolha &quot;Imprimir pasta de trabalho inteira&quot;.
                  </p>
                )}
              </>
            }
            errors={visibleErrors}
            isExporting={isExporting}
            exportError={exportError}
            downloadLabel="Baixar planilha (.xlsx)"
            onExport={exportFile}
          />
        </CardContent>
      </Card>
    </div>
  );
};
