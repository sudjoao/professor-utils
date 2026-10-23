import { Check } from 'lucide-react';

import { FieldGroup } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { pluralize } from '@/lib/text/pluralize';

type PresentStudentsFieldProps = {
  studentNames: string[];
  absentNames: string[];
  onToggle: (name: string) => void;
  onMarkAll: () => void;
};

export const PresentStudentsField = ({
  studentNames,
  absentNames,
  onToggle,
  onMarkAll,
}: PresentStudentsFieldProps) => {
  if (studentNames.length === 0) {
    return (
      <p className="text-muted-foreground">
        Os alunos aparecem aqui depois que você escrever os nomes no passo 1.
      </p>
    );
  }

  const presentCount = studentNames.length - absentNames.length;

  return (
    <FieldGroup
      id="draw-present"
      legend="Quem está na sala?"
      hint="Desmarque quem faltou: só quem está marcado entra no sorteio e nos grupos."
    >
      <p className="font-medium" aria-live="polite">
        {pluralize(presentCount, 'aluno presente', 'alunos presentes')} de {studentNames.length}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {studentNames.map((name, index) => {
          const isPresent = !absentNames.includes(name);
          return (
            <li key={`${index}-${name}`}>
              <label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 outline-ring outline-offset-2 hover:bg-muted has-checked:border-primary has-focus-visible:outline-3 has-focus-visible:outline-solid [&:not(:has(:checked))]:text-muted-foreground [&:not(:has(:checked))]:line-through">
                <input
                  type="checkbox"
                  className="size-5 accent-primary"
                  checked={isPresent}
                  onChange={() => onToggle(name)}
                />
                {name}
              </label>
            </li>
          );
        })}
      </ul>
      {absentNames.length > 0 && (
        <Button variant="outline" onClick={onMarkAll}>
          <Check data-icon="inline-start" />
          Marcar todos como presentes
        </Button>
      )}
    </FieldGroup>
  );
};
