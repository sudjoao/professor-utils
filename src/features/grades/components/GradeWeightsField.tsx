import { FieldGroup } from '@/components/FormField';
import { NumberField } from '@/components/NumberField';
import { MAX_WEIGHT } from '@/features/grades/constants';
import { getGradeWeights } from '@/features/grades/services/buildGradesSheetData';
import { fieldId } from '@/lib/forms/formErrors';

type GradeWeightsFieldProps = {
  gradeTitles: string[];
  weights: number[];
  error?: string;
  onChange: (weights: number[]) => void;
};

export const GradeWeightsField = ({
  gradeTitles,
  weights,
  error,
  onChange,
}: GradeWeightsFieldProps) => {
  const gradeWeights = getGradeWeights(weights, gradeTitles.length);

  const changeWeight = (index: number, weight: number) =>
    onChange(gradeWeights.map((current, position) => (position === index ? weight : current)));

  return (
    <FieldGroup
      id={fieldId('weights')}
      legend="Peso de cada nota"
      hint="Ex.: a prova vale 2 e os trabalhos valem 1. Os pesos também vão para a planilha e podem ser mudados lá."
      error={error}
    >
      <ul className="space-y-2">
        {gradeTitles.map((title, index) => (
          <li
            key={`${index}-${title}`}
            className="flex flex-wrap items-center justify-between gap-2"
          >
            <span className="font-medium" aria-hidden>
              {title}
            </span>
            <NumberField
              id={`weight-${index}`}
              aria-label={`Peso de ${title}`}
              name={`o peso de ${title}`}
              allowDecimals
              min={0}
              max={MAX_WEIGHT}
              value={gradeWeights[index]}
              onChange={(weight) => changeWeight(index, weight)}
            />
          </li>
        ))}
      </ul>
    </FieldGroup>
  );
};
