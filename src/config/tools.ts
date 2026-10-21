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
    description:
      'Gere uma planilha em Excel para lançar as notas da turma, com média ou soma calculada automaticamente.',
    icon: GraduationCap,
  },
  reports: {
    href: '/reports',
    title: 'Relatórios de alunos',
    description:
      'Gere o Registro de Avaliação (RAv) de toda a turma em Word, com os dados de cada aluno já preenchidos.',
    icon: FileText,
  },
} satisfies Record<string, Tool>;

export const TOOL_LIST: Tool[] = Object.values(TOOLS);
