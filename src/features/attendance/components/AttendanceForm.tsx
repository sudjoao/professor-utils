'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassInfoFields } from '@/features/attendance/components/ClassInfoFields';
import { DateRangesField } from '@/features/attendance/components/DateRangesField';
import { ExportPanel } from '@/features/attendance/components/ExportPanel';
import { LessonCountField } from '@/features/attendance/components/LessonCountField';
import { LessonDatesPreview } from '@/features/attendance/components/LessonDatesPreview';
import { SavedClassrooms } from '@/features/attendance/components/SavedClassrooms';
import { StudentsField } from '@/features/attendance/components/StudentsField';
import { WeekdaysField } from '@/features/attendance/components/WeekdaysField';
import { useAttendanceForm } from '@/features/attendance/hooks/useAttendanceForm';
import type { ColumnMode } from '@/features/attendance/types';
import { downloadWorkbook } from '@/lib/excel/downloadWorkbook';
import { slugify } from '@/lib/text/slugify';

const buildFileName = (classroomName: string): string =>
  ['lista-de-chamada', slugify(classroomName)].filter(Boolean).join('-');

export const AttendanceForm = () => {
  const form = useAttendanceForm();
  const { values, sheetData, errors } = form;

  const [hasTriedExport, setHasTriedExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const handleExport = async () => {
    setHasTriedExport(true);
    setExportError('');

    if (errors.length > 0) {
      return;
    }

    setIsExporting(true);
    try {
      // ExcelJS is heavy, so it is only downloaded when the teacher actually exports.
      const { buildAttendanceWorkbook } =
        await import('@/features/attendance/services/buildAttendanceWorkbook');
      await downloadWorkbook(
        buildAttendanceWorkbook(sheetData),
        buildFileName(values.classroomName),
      );
    } catch (error) {
      console.error(error);
      setExportError('Não foi possível gerar a planilha. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Turma e alunos</CardTitle>
          <CardDescription>
            Cole a lista de alunos ou carregue uma turma que você já salvou.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClassInfoFields
            classroomName={values.classroomName}
            subject={values.subject}
            teacherName={values.teacherName}
            onFieldChange={form.setField}
          />
          <StudentsField
            studentsText={values.studentsText}
            sortStudents={values.sortStudents}
            studentCount={sheetData.studentNames.length}
            onStudentsTextChange={(text) => form.setField('studentsText', text)}
            onSortStudentsChange={(sortStudents) => form.setField('sortStudents', sortStudents)}
          />
          <SavedClassrooms
            classroomName={values.classroomName}
            studentNames={sheetData.studentNames}
            onLoad={form.loadClassroom}
          />
        </CardContent>
      </Card>

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
            onValueChange={(mode) => form.setField('columnMode', mode as ColumnMode)}
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
                  onSelect={(weekdays) => form.setField('weekdays', weekdays)}
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
                onChange={(lessonCount) => form.setField('lessonCount', lessonCount)}
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
            studentCount={sheetData.studentNames.length}
            lessonCount={sheetData.columns.length}
            pageCount={form.pageCount}
            errors={hasTriedExport ? errors : []}
            isExporting={isExporting}
            exportError={exportError}
            onExport={handleExport}
          />
        </CardContent>
      </Card>
    </div>
  );
};
