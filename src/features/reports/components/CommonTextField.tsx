import { UserRound } from 'lucide-react';
import { useRef } from 'react';

import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { STUDENT_PLACEHOLDER } from '@/features/reports/constants';
import { buildEvaluationParagraphs } from '@/features/reports/services/buildReportData';
import { fieldId } from '@/lib/forms/formErrors';
import { insertText } from '@/lib/text/insertText';

/** Used in the preview while the teacher has not typed any student yet. */
const EXAMPLE_STUDENT_NAME = 'Ana Souza';

type CommonTextFieldProps = {
  commonText: string;
  firstStudentName?: string;
  onChange: (commonText: string) => void;
};

export const CommonTextField = ({
  commonText,
  firstStudentName = EXAMPLE_STUDENT_NAME,
  onChange,
}: CommonTextFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewParagraphs = buildEvaluationParagraphs(commonText, firstStudentName);

  const insertStudentName = () => {
    const textarea = textareaRef.current;
    const { text, cursor } = insertText(
      commonText,
      STUDENT_PLACEHOLDER,
      textarea?.selectionStart ?? commonText.length,
      textarea?.selectionEnd ?? commonText.length,
    );

    onChange(text);
    // Waits for React to render the new text before putting the cursor back where it was.
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="space-y-4">
      <FormField
        id={fieldId('commonText')}
        label="Texto que se repete em todos os relatórios"
        optional
        hint={
          <>
            Onde o nome do aluno deve aparecer, clique em &quot;Inserir o nome do aluno&quot; (ou
            escreva {STUDENT_PLACEHOLDER}): cada relatório sai com o nome do seu aluno. Se deixar em
            branco, o espaço da avaliação vem vazio e já formatado (Arial 12, espaçamento 1,5) para
            você escrever no Word.
          </>
        }
      >
        {(control) => (
          <Textarea
            {...control}
            ref={textareaRef}
            rows={10}
            className="min-h-56 text-base md:text-base"
            value={commonText}
            placeholder={`Ex.: Ao longo do bimestre, ${STUDENT_PLACEHOLDER} participou das atividades de leitura e escrita...`}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </FormField>

      <Button variant="outline" size="lg" className="h-10" onClick={insertStudentName}>
        <UserRound data-icon="inline-start" />
        Inserir o nome do aluno
      </Button>

      {previewParagraphs.length > 0 && (
        <section
          aria-labelledby="common-text-preview"
          className="space-y-2 rounded-xl bg-muted p-4"
        >
          <h3 id="common-text-preview" className="font-medium">
            Como vai ficar no relatório de {firstStudentName}:
          </h3>
          <div className="space-y-2">
            {previewParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph || ' '}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
