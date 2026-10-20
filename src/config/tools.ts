import { ClipboardCheck, FileText, GraduationCap, type LucideIcon } from 'lucide-react';

export type Tool = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const TOOLS = {
  attendance: {
    href: '/attendance',
    title: 'Lista de chamada',
    description:
      'Gere uma planilha de chamada em Excel a partir dos nomes dos alunos, escolhendo a quantidade de aulas.',
    icon: ClipboardCheck,
  },
  grades: {
    href: '/grades',
    title: 'Lista de notas',
    description: 'Monte uma planilha para lançar as notas das avaliações da turma.',
    icon: GraduationCap,
  },
  reports: {
    href: '/reports',
    title: 'Relatórios de alunos',
    description: 'Crie modelos de relatórios descritivos sobre o desempenho dos alunos.',
    icon: FileText,
  },
} satisfies Record<string, Tool>;

export const TOOL_LIST: Tool[] = Object.values(TOOLS);
