import { Copy, Shuffle, Users } from 'lucide-react';
import { useState } from 'react';

import { ChoiceCards } from '@/components/ChoiceCards';
import { FieldGroup, FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { PrintButton } from '@/components/print/PrintButton';
import { StepCard } from '@/components/StepCard';
import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { formatGroupsText, type GroupingMode, makeGroups } from '@/features/draw/services/draw';
import { useUndoNotice } from '@/lib/react/useUndoNotice';
import { pluralize } from '@/lib/text/pluralize';

const MODE_CHOICES: { value: GroupingMode; label: string; description: string }[] = [
  { value: 'groupCount', label: 'Quantos grupos', description: 'Ex.: 5 grupos para a turma.' },
  { value: 'groupSize', label: 'Quantos alunos por grupo', description: 'Ex.: grupos de 4.' },
];

type GroupsCardProps = {
  step: number;
  totalSteps: number;
  presentNames: string[];
  classroomName: string;
};

export const GroupsCard = ({ step, totalSteps, presentNames, classroomName }: GroupsCardProps) => {
  const [mode, setMode] = useState<GroupingMode>('groupCount');
  const [value, setValue] = useState(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const notice = useUndoNotice();
  const maxValue = Math.max(presentNames.length, 1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatGroupsText(groups));
      notice.show('Grupos copiados. Cole numa mensagem ou num documento.');
    } catch {
      notice.show('Não foi possível copiar. Selecione os nomes na tela e copie com Ctrl + C.');
    }
  };

  return (
    <StepCard
      step={step}
      totalSteps={totalSteps}
      title="Formar grupos"
      description="Grupos sorteados e equilibrados, só com quem está na sala."
    >
      <FieldGroup id="groups-mode" legend="Como você quer dividir?">
        <ChoiceCards choices={MODE_CHOICES} value={mode} onChange={setMode} />
      </FieldGroup>
      <FormField
        id="groups-value"
        label={mode === 'groupCount' ? 'Número de grupos' : 'Alunos em cada grupo'}
        hint={
          mode === 'groupSize'
            ? 'Se sobrar gente, ela entra nos outros grupos, para ninguém ficar sozinho.'
            : undefined
        }
      >
        {(control) => (
          <NumberField
            {...control}
            name={mode === 'groupCount' ? 'o número de grupos' : 'os alunos por grupo'}
            min={1}
            max={maxValue}
            value={value}
            onChange={setValue}
          />
        )}
      </FormField>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          className="h-12 px-5 text-base"
          disabled={presentNames.length === 0 || !Number.isInteger(value) || value < 1}
          onClick={() => setGroups(makeGroups(presentNames, { mode, value }))}
        >
          {groups.length > 0 ? (
            <Shuffle data-icon="inline-start" className="size-5" />
          ) : (
            <Users data-icon="inline-start" className="size-5" />
          )}
          {groups.length > 0 ? 'Sortear de novo' : 'Formar os grupos'}
        </Button>
        {groups.length > 0 && (
          <>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-5 text-base"
              onClick={handleCopy}
            >
              <Copy data-icon="inline-start" className="size-5" />
              Copiar os grupos
            </Button>
            <PrintButton
              label="Imprimir os grupos"
              orientation="portrait"
              renderContent={() => (
                <section className="print-page space-y-4 text-[12pt] text-black">
                  <h1 className="text-[16pt] font-bold">
                    Grupos{classroomName.trim() ? ` – ${classroomName.trim()}` : ''}
                  </h1>
                  <div className="grid grid-cols-2 gap-4">
                    {groups.map((group, index) => (
                      <div key={index} className="break-inside-avoid border border-black p-3">
                        <p className="font-bold">Grupo {index + 1}</p>
                        <ul className="list-inside list-disc">
                          {group.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            />
          </>
        )}
      </div>

      <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />

      {groups.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Grupos sorteados">
          {groups.map((group, index) => (
            <li key={index} className="rounded-xl border-2 p-4">
              <h3 className="font-semibold">
                Grupo {index + 1}{' '}
                <span className="font-normal text-muted-foreground">
                  ({pluralize(group.length, 'aluno', 'alunos')})
                </span>
              </h3>
              <ul className="mt-2 space-y-1">
                {group.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </StepCard>
  );
};
