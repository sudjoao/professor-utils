'use client';

import { Shuffle, SortAsc } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ErrorSummary } from '@/components/ErrorSummary';
import { FormField } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { PrintButton } from '@/components/print/PrintButton';
import { StepCard } from '@/components/StepCard';
import { UndoNotice } from '@/components/UndoNotice';
import { Button } from '@/components/ui/button';
import { ClassroomCard } from '@/features/classroom/components/ClassroomCard';
import { useClassDraft } from '@/features/classroom/hooks/useClassDraft';
import { getStudentNames, validateStudents } from '@/features/classroom/services/classForm';
import { formatClassInfo } from '@/features/classroom/services/classSheet';
import { SeatingGrid } from '@/features/seating/components/SeatingGrid';
import { useSeatingChart } from '@/features/seating/hooks/useSeatingChart';
import { MAX_COLUMNS, MAX_ROWS } from '@/features/seating/services/seatingChart';
import { useValidation } from '@/lib/forms/useValidation';
import { useUndoNotice } from '@/lib/react/useUndoNotice';
import { pluralize } from '@/lib/text/pluralize';

const TOTAL_STEPS = 4;

export const SeatingForm = () => {
  const { classDraft, splitChanges } = useClassDraft();
  const studentNames = useMemo(() => getStudentNames(classDraft), [classDraft]);
  const { chart, unseated, resize, swap, rearrange } = useSeatingChart(
    classDraft.classroomName,
    studentNames,
  );
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [swapMessage, setSwapMessage] = useState('');
  const notice = useUndoNotice();
  const errors = validateStudents(classDraft);
  const { visibleErrors, failedAttempts, validate } = useValidation(errors);
  const seatCount = chart.rows * chart.columns;

  const handleSeatClick = (seat: number) => {
    if (selectedSeat === null) {
      setSelectedSeat(seat);
      setSwapMessage(
        chart.seats[seat]
          ? `Você escolheu ${chart.seats[seat]}. Agora clique no outro lugar.`
          : 'Você escolheu uma carteira vazia. Agora clique no aluno que vai para ela.',
      );
      return;
    }
    if (selectedSeat !== seat) {
      const [first, second] = [chart.seats[selectedSeat], chart.seats[seat]];
      swap(selectedSeat, seat);
      setSwapMessage(
        first && second
          ? `${first} e ${second} trocaram de lugar.`
          : `${first ?? second} mudou de carteira.`,
      );
    } else {
      setSwapMessage('');
    }
    setSelectedSeat(null);
  };

  const handleRearrange = (order: 'alphabetical' | 'random') => {
    const undo = rearrange(order);
    setSelectedSeat(null);
    notice.show(
      order === 'random' ? 'Alunos sorteados nas carteiras.' : 'Alunos em ordem alfabética.',
      undo,
    );
  };

  return (
    <div className="space-y-6">
      <ClassroomCard
        step={1}
        totalSteps={TOTAL_STEPS}
        values={classDraft}
        studentNames={studentNames}
        optionalFields={['classroomName', 'subject', 'teacherName']}
        errors={visibleErrors}
        onChange={(changes) => splitChanges(changes)}
      />

      <StepCard
        step={2}
        totalSteps={TOTAL_STEPS}
        title="Carteiras da sala"
        description="Quantas fileiras e quantas carteiras em cada fileira. O mapa fica salvo para esta turma."
      >
        <div className="flex flex-wrap gap-6">
          <FormField id="seating-rows" label="Fileiras (da frente para o fundo)">
            {(control) => (
              <NumberField
                {...control}
                name="as fileiras"
                min={1}
                max={MAX_ROWS}
                value={chart.rows}
                onChange={(rows) =>
                  rows >= 1 && rows <= MAX_ROWS && resize({ rows, columns: chart.columns })
                }
              />
            )}
          </FormField>
          <FormField id="seating-columns" label="Carteiras em cada fileira">
            {(control) => (
              <NumberField
                {...control}
                name="as carteiras por fileira"
                min={1}
                max={MAX_COLUMNS}
                value={chart.columns}
                onChange={(columns) =>
                  columns >= 1 && columns <= MAX_COLUMNS && resize({ rows: chart.rows, columns })
                }
              />
            )}
          </FormField>
        </div>
        <p className="font-medium">
          {pluralize(seatCount, 'carteira', 'carteiras')} para{' '}
          {pluralize(studentNames.length, 'aluno', 'alunos')}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-10"
            onClick={() => handleRearrange('alphabetical')}
          >
            <SortAsc data-icon="inline-start" />
            Arrumar em ordem alfabética
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-10"
            onClick={() => handleRearrange('random')}
          >
            <Shuffle data-icon="inline-start" />
            Sortear os lugares
          </Button>
        </div>
        <UndoNotice notice={notice.notice} onUndo={notice.undo} onDismiss={notice.dismiss} />
      </StepCard>

      <StepCard
        step={3}
        totalSteps={TOTAL_STEPS}
        title="Mapa da sala"
        description="Para trocar dois alunos de lugar, clique num e depois no outro (ou numa carteira vazia)."
      >
        {unseated.length > 0 && (
          <p role="alert" className="rounded-xl border-2 border-destructive p-3 font-medium">
            Faltam carteiras para: {unseated.join(', ')}. Aumente as fileiras ou as carteiras por
            fileira.
          </p>
        )}
        <SeatingGrid chart={chart} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} />
        <p aria-live="polite" className="min-h-6 font-medium">
          {swapMessage}
        </p>
      </StepCard>

      <StepCard step={4} totalSteps={TOTAL_STEPS} title="Imprimir o mapa">
        <ErrorSummary
          errors={visibleErrors}
          failedAttempts={failedAttempts}
          title="Antes de imprimir, falta arrumar:"
        />
        <PrintButton
          label="Imprimir o mapa da sala"
          orientation="landscape"
          onBeforePrint={validate}
          renderContent={() => (
            <section className="print-page space-y-3 text-black">
              <h1 className="text-center text-[16pt] font-bold">Mapa da sala</h1>
              <p className="text-[11pt]">{formatClassInfo(classDraft)}</p>
              <SeatingGrid chart={chart} isPrint />
            </section>
          )}
        />
      </StepCard>
    </div>
  );
};
