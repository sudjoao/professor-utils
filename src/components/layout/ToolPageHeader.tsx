import type { Tool } from '@/config/tools';

type ToolPageHeaderProps = {
  tool: Tool;
};

export const ToolPageHeader = ({ tool: { title, description, result } }: ToolPageHeaderProps) => (
  <section className="space-y-3">
    <h1 className="font-heading text-3xl font-semibold">{title}</h1>
    <p className="text-lg text-muted-foreground">{description}</p>
    <p className="rounded-xl border-l-4 border-primary bg-muted px-4 py-3">
      <strong>Você vai receber:</strong> {result}
    </p>
  </section>
);
