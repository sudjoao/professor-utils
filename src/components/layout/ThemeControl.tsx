'use client';

import { Button } from '@/components/ui/button';
import { THEME_LABELS, THEMES } from '@/lib/display/theme';
import { useTheme } from '@/lib/display/useTheme';

export const ThemeControl = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-labelledby="theme-label" className="flex flex-wrap items-center gap-2">
      <span id="theme-label" className="text-sm text-muted-foreground">
        Cores:
      </span>
      {THEMES.map((option) => (
        <Button
          key={option}
          variant={option === theme ? 'default' : 'outline'}
          size="lg"
          aria-pressed={option === theme}
          onClick={() => setTheme(option)}
        >
          {THEME_LABELS[option]}
        </Button>
      ))}
    </div>
  );
};
