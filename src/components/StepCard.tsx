import { CircleHelp } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StepCardProps = {
  step: number;
  totalSteps: number;
  title: string;
  description?: ReactNode;
  /** Shown at the top right, e.g. a `SaveStatus`. */
  status?: ReactNode;
  /** Step-by-step instructions, opened by "Como fazer este passo?". */
  help?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
};

/** One numbered step of a form ("Passo 2 de 4"), with a real heading for screen readers. */
export const StepCard = ({
  step,
  totalSteps,
  title,
  description,
  status,
  help,
  contentClassName,
  children,
}: StepCardProps) => (
  <Card className="text-base">
    <CardHeader className="gap-1">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-muted-foreground">
          Passo {step} de {totalSteps}
        </p>
        {status}
      </div>
      <h2 className="font-heading text-xl font-semibold">{title}</h2>
      {description && <CardDescription className="text-base">{description}</CardDescription>}
      {help && (
        <details className="group mt-2 rounded-lg border bg-muted/50">
          <summary className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 font-medium">
            <CircleHelp className="size-5" aria-hidden />
            Como fazer este passo?
          </summary>
          <div className="space-y-2 px-4 pt-1 pb-4 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1">
            {help}
          </div>
        </details>
      )}
    </CardHeader>
    <CardContent className={cn('space-y-6', contentClassName)}>{children}</CardContent>
  </Card>
);
