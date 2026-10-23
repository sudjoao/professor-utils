import { Dices, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { StepCard } from '@/components/StepCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { drawStudent } from '@/features/draw/services/draw';

type DrawStudentCardProps = {
  step: number;
  totalSteps: number;
  presentNames: string[];
};

export const DrawStudentCard = ({ step, totalSteps, presentNames }: DrawStudentCardProps) => {
  const [drawnName, setDrawnName] = useState('');
  const [alreadyDrawn, setAlreadyDrawn] = useState<string[]>([]);
  const [avoidRepeats, setAvoidRepeats] = useState(true);
  // Students who left the room (unchecked) no longer count as drawn.
  const drawnPresent = alreadyDrawn.filter((name) => presentNames.includes(name));

  const handleDraw = () => {
    const result = drawStudent(presentNames, avoidRepeats ? drawnPresent : []);
    if (result) {
      setDrawnName(result.name);
      setAlreadyDrawn(result.drawn);
    }
  };

  return (
    <StepCard
      step={step}
      totalSteps={totalSteps}
      title="Sortear um aluno"
      description="Para escolher quem lê, quem vai ao quadro ou quem responde."
    >
      <div
        className="flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed p-6 text-center"
        aria-live="polite"
      >
        {drawnName ? (
          <p className="font-heading text-4xl font-bold break-words sm:text-5xl">{drawnName}</p>
        ) : (
          <p className="text-muted-foreground">O nome sorteado aparece aqui.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          className="h-12 px-5 text-base"
          disabled={presentNames.length === 0}
          onClick={handleDraw}
        >
          <Dices data-icon="inline-start" className="size-5" />
          {drawnName ? 'Sortear outro' : 'Sortear um aluno'}
        </Button>
        {avoidRepeats && drawnPresent.length > 0 && (
          <Button variant="outline" size="lg" className="h-12" onClick={() => setAlreadyDrawn([])}>
            <RotateCcw data-icon="inline-start" />
            Recomeçar
          </Button>
        )}
      </div>

      <Label className="text-base font-normal">
        <input
          type="checkbox"
          className="size-5 accent-primary"
          checked={avoidRepeats}
          onChange={(event) => setAvoidRepeats(event.target.checked)}
        />
        Não repetir até todos serem sorteados
      </Label>
      {avoidRepeats && presentNames.length > 0 && (
        <p className="text-muted-foreground">
          Já saíram {drawnPresent.length} de {presentNames.length}.
        </p>
      )}
    </StepCard>
  );
};
