import { ClipboardCheck, FileText, GraduationCap, type LucideIcon } from 'lucide-react';

export type Tool = {
  href: string;
  title: string;
  description: string;
  /** What the teacher gets at the end, shown at the top of the tool page. */
  result: string;
  icon: LucideIcon;
};

export const TOOLS = {
  attendance: {
    href: '/attendance',
    title: 'Lista de chamada',
    description:
      'Escreva os nomes dos alunos e escolha as datas das aulas (ou só quantas aulas são). A lista sai pronta para imprimir.',
    result: 'uma planilha do Excel com a chamada, que cabe numa folha A4 deitada.',
    icon: ClipboardCheck,
  },
  grades: {
    href: '/grades',
    title: 'Lista de notas',
    description:
      'Uma planilha para lançar as notas da turma. A média (ou a soma) é calculada sozinha.',
    result:
      'uma planilha do Excel com uma coluna para cada nota e, no final, a média ou a soma já calculada.',
    icon: GraduationCap,
  },
  reports: {
    href: '/reports',
    title: 'Relatórios de alunos',
    description:
      'O Registro de Avaliação (RAv) da turma inteira, com os dados da escola e de cada aluno já preenchidos.',
    result:
      'um arquivo do Word com um RAv para cada aluno. Você só escreve a avaliação e as faltas.',
    icon: FileText,
  },
} satisfies Record<string, Tool>;

export const TOOL_LIST: Tool[] = Object.values(TOOLS);
