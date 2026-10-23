import { Badge } from '@/components/ui/badge';

type GradeColumnsPreviewProps = {
  gradeTitles: string[];
  /** Calculated columns (Média, Recup., Final, Situação), shown in a darker color. */
  resultTitles: string[];
};

export const GradeColumnsPreview = ({ gradeTitles, resultTitles }: GradeColumnsPreviewProps) => (
  <div className="space-y-2">
    <h3 className="font-medium">Colunas que vão aparecer na planilha</h3>
    {gradeTitles.length === 0 ? (
      <p className="text-muted-foreground">As colunas aparecem aqui.</p>
    ) : (
      <div className="flex flex-wrap gap-1">
        {gradeTitles.map((title, index) => (
          <Badge
            key={`${index}-${title}`}
            variant="secondary"
            className="h-auto px-2.5 py-1 text-sm"
          >
            {title}
          </Badge>
        ))}
        {resultTitles.map((title) => (
          <Badge key={title} className="h-auto px-2.5 py-1 text-sm">
            {title}
          </Badge>
        ))}
      </div>
    )}
  </div>
);
