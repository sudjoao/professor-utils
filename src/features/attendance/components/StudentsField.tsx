import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type StudentsFieldProps = {
  studentsText: string;
  sortStudents: boolean;
  studentCount: number;
  onStudentsTextChange: (text: string) => void;
  onSortStudentsChange: (sortStudents: boolean) => void;
};

export const StudentsField = ({
  studentsText,
  sortStudents,
  studentCount,
  onStudentsTextChange,
  onSortStudentsChange,
}: StudentsFieldProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor="attendance-students">Alunos (um por linha)</Label>
      <span className="text-xs text-muted-foreground">
        {studentCount} {studentCount === 1 ? 'aluno' : 'alunos'}
      </span>
    </div>
    <Textarea
      id="attendance-students"
      rows={10}
      value={studentsText}
      placeholder={'Ana Souza\nBruno Lima\nCarla Dias'}
      onChange={(event) => onStudentsTextChange(event.target.value)}
    />
    <Label className="font-normal">
      <Checkbox checked={sortStudents} onCheckedChange={onSortStudentsChange} />
      Ordenar em ordem alfabética
    </Label>
  </div>
);
