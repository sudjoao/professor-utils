import { FormField } from '@/components/FormField';
import { Textarea } from '@/components/ui/textarea';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import { fieldId } from '@/lib/forms/formErrors';

type CommonTextFieldProps = {
  commonText: string;
  onChange: (commonText: string) => void;
};

export const CommonTextField = ({ commonText, onChange }: CommonTextFieldProps) => (
  <FormField
    id={fieldId('commonText')}
    label="Texto que se repete em todos os relatórios"
    optional
    hint={
      <>
        Escreva {STUDENT_PLACEHOLDER} onde o nome do aluno deve aparecer: cada relatório sai com o
        nome do seu aluno. Se deixar em branco, o espaço da avaliação vem vazio e já formatado
        (Arial 12, espaçamento 1,5) para você escrever no Word.
      </>
    }
  >
    {(control) => (
      <Textarea
        {...control}
        rows={10}
        className="min-h-56 text-base md:text-base"
        value={commonText}
        placeholder={`Ex.: Ao longo do bimestre, ${STUDENT_PLACEHOLDER} participou das atividades de leitura e escrita...`}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
  </FormField>
);
