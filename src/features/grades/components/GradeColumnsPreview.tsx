import { Badge } from '@/components/ui/badge';

type GradeColumnsPreviewProps = {
  gradeTitles: string[];
  summaryColumnTitle?: string;
};

export const GradeColumnsPreview = ({
  gradeTitles,
  summaryColumnTitle,
}: GradeColumnsPreviewProps) => (
  <div className="space-y-2">
    <p className="text-sm font-medium">Colunas da planilha</p>
    {gradeTitles.length === 0 ? (
      <p className="text-sm text-muted-foreground">As colunas aparecem aqui.</p>
    ) : (
      <div className="flex flex-wrap gap-1">
        {gradeTitles.map((title, index) => (
          <Badge key={`${index}-${title}`} variant="secondary">
            {title}
          </Badge>
        ))}
        {summaryColumnTitle && <Badge>{summaryColumnTitle}</Badge>}
      </div>
    )}
  </div>
);
