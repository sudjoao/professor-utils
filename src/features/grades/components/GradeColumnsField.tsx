import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { MAX_GRADE_COLUMNS } from '@/features/grades/constants';
import type { GradeColumnMode, GradesFormValues } from '@/features/grades/types';

type GradeColumnsFieldProps = Pick<
  GradesFormValues,
  'columnMode' | 'gradeCount' | 'gradeTitlesText'
> & {
  onChange: (changes: Partial<GradesFormValues>) => void;
};

export const GradeColumnsField = ({
  columnMode,
  gradeCount,
  gradeTitlesText,
  onChange,
}: GradeColumnsFieldProps) => (
  <Tabs
    value={columnMode}
    onValueChange={(mode) => onChange({ columnMode: mode as GradeColumnMode })}
  >
    <TabsList>
      <TabsTrigger value="count">Por quantidade</TabsTrigger>
      <TabsTrigger value="titles">Por título</TabsTrigger>
    </TabsList>

    <TabsContent value="count" className="space-y-2 pt-4">
      <Label htmlFor="grades-count">Quantidade de notas</Label>
      <Input
        id="grades-count"
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_GRADE_COLUMNS}
        className="w-32"
        value={gradeCount || ''}
        onChange={(event) => onChange({ gradeCount: event.target.valueAsNumber || 0 })}
      />
      <p className="text-xs text-muted-foreground">
        As colunas saem como &quot;Nota 1&quot;, &quot;Nota 2&quot;...
      </p>
    </TabsContent>

    <TabsContent value="titles" className="space-y-2 pt-4">
      <Label htmlFor="grades-titles">Títulos das notas (um por linha)</Label>
      <Textarea
        id="grades-titles"
        rows={6}
        value={gradeTitlesText}
        placeholder={'Prova 1\nTrabalho em grupo\nParticipação'}
        onChange={(event) => onChange({ gradeTitlesText: event.target.value })}
      />
    </TabsContent>
  </Tabs>
);
