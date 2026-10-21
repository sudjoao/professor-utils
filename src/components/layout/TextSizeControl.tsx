'use client';

import { Button } from '@/components/ui/button';
import { stepTextSize, TEXT_SIZE_LABELS, TEXT_SIZES } from '@/lib/display/textSize';
import { useTextSize } from '@/lib/display/useTextSize';

export const TextSizeControl = () => {
  const { textSize, setTextSize } = useTextSize();
  const isSmallest = textSize === TEXT_SIZES[0];
  const isLargest = textSize === TEXT_SIZES[TEXT_SIZES.length - 1];

  return (
    <div role="group" aria-labelledby="text-size-label" className="flex items-center gap-2">
      <span id="text-size-label" className="text-sm text-muted-foreground">
        Tamanho do texto:
      </span>
      <Button
        variant="outline"
        size="lg"
        aria-label="Diminuir o texto"
        disabled={isSmallest}
        onClick={() => setTextSize(stepTextSize(textSize, -1))}
      >
        A−
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="text-lg"
        aria-label="Aumentar o texto"
        disabled={isLargest}
        onClick={() => setTextSize(stepTextSize(textSize, 1))}
      >
        A+
      </Button>
      <span className="sr-only" role="status">
        Texto {TEXT_SIZE_LABELS[textSize]}
      </span>
    </div>
  );
};
