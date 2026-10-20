import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_LESSON_COLUMNS } from '@/features/attendance/constants';

type LessonCountFieldProps = {
  lessonCount: number;
  onChange: (lessonCount: number) => void;
};

export const LessonCountField = ({ lessonCount, onChange }: LessonCountFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="attendance-lesson-count">Quantidade de aulas</Label>
    <Input
      id="attendance-lesson-count"
      type="number"
      inputMode="numeric"
      min={1}
      max={MAX_LESSON_COLUMNS}
      className="w-32"
      value={lessonCount || ''}
      onChange={(event) => onChange(event.target.valueAsNumber || 0)}
    />
    <p className="text-xs text-muted-foreground">
      As colunas saem numeradas, com espaço em branco para você escrever a data de cada aula.
    </p>
  </div>
);
