import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StepCardProps = {
  step: number;
  totalSteps: number;
  title: string;
  description?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
};

/** One numbered step of a form ("Passo 2 de 4"), with a real heading for screen readers. */
export const StepCard = ({
  step,
  totalSteps,
  title,
  description,
  contentClassName,
  children,
}: StepCardProps) => (
  <Card className="text-base">
    <CardHeader className="gap-1">
      <p className="text-sm font-medium text-muted-foreground">
        Passo {step} de {totalSteps}
      </p>
      <h2 className="font-heading text-xl font-semibold">{title}</h2>
      {description && <CardDescription className="text-base">{description}</CardDescription>}
    </CardHeader>
    <CardContent className={cn('space-y-6', contentClassName)}>{children}</CardContent>
  </Card>
);
