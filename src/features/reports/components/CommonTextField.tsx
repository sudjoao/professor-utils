import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';

type CommonTextFieldProps = {
  commonText: string;
  onChange: (commonText: string) => void;
};

export const CommonTextField = ({ commonText, onChange }: CommonTextFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="report-common-text">Texto que se repete em todos os relatórios</Label>
    <Textarea
      id="report-common-text"
      rows={10}
      value={commonText}
      placeholder={`Ex.: Ao longo do bimestre, ${STUDENT_PLACEHOLDER} participou das atividades de leitura e escrita...`}
      onChange={(event) => onChange(event.target.value)}
    />
    <p className="text-xs text-muted-foreground">
      Opcional. Escreva {STUDENT_PLACEHOLDER} onde o nome do estudante deve aparecer; cada relatório
      sai com o nome do seu aluno. Se deixar em branco, a área da avaliação vem vazia e já formatada
      (Arial 12, espaçamento 1,5) para você escrever no Word.
    </p>
  </div>
);
