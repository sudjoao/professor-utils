import {
  ClipboardCheck,
  Dices,
  FileText,
  GraduationCap,
  LayoutGrid,
  type LucideIcon,
  Tags,
} from 'lucide-react';

/** The main tools have their own link in the header; the others are listed on the home page. */
export type ToolGroup = 'main' | 'other';

export type Tool = {
  href: string;
  group: ToolGroup;
  title: string;
  description: string;
  /** What the teacher gets at the end, shown at the top of the tool page. */
  result: string;
  icon: LucideIcon;
};

export const TOOLS = {
  attendance: {
    href: '/attendance',
    group: 'main',
    title: 'Lista de chamada',
    description:
      'Escreva os nomes dos alunos e escolha as datas das aulas (ou só quantas aulas são). A lista sai pronta para imprimir.',
    result: 'uma planilha do Excel com a chamada, que cabe numa folha A4 deitada.',
    icon: ClipboardCheck,
  },
  grades: {
    href: '/grades',
    group: 'main',
    title: 'Lista de notas',
    description:
      'Uma planilha para lançar as notas da turma. A média (ou a soma) é calculada sozinha.',
    result:
      'uma planilha do Excel com uma coluna para cada nota e, no final, a média ou a soma já calculada.',
    icon: GraduationCap,
  },
  reports: {
    href: '/reports',
    group: 'main',
    title: 'Relatórios de alunos',
    description:
      'O Registro de Avaliação (RAv) da turma inteira, com os dados da escola e de cada aluno já preenchidos.',
    result:
      'um arquivo do Word com um RAv para cada aluno. Você só escreve a avaliação e as faltas.',
    icon: FileText,
  },
  labels: {
    href: '/labels',
    group: 'other',
    title: 'Etiquetas com nomes',
    description:
      'Etiquetas com o nome de cada aluno para cadernos, pastas e livros, em folhas A4 de etiquetas ou papel comum.',
    result: 'uma folha pronta para imprimir, com uma etiqueta para cada aluno.',
    icon: Tags,
  },
  draw: {
    href: '/draw',
    group: 'other',
    title: 'Sorteio e grupos',
    description:
      'Sorteie um aluno sem repetir ou forme grupos equilibrados só com quem está na sala.',
    result: 'o nome sorteado em letras grandes e os grupos prontos para copiar ou imprimir.',
    icon: Dices,
  },
  seating: {
    href: '/seating',
    group: 'other',
    title: 'Mapa de sala',
    description:
      'Monte o mapa de onde cada aluno senta, troque lugares com dois cliques e imprima.',
    result: 'o mapa da sala salvo para a turma e pronto para imprimir.',
    icon: LayoutGrid,
  },
} satisfies Record<string, Tool>;

export const TOOL_LIST: Tool[] = Object.values(TOOLS);

export const MAIN_TOOLS = TOOL_LIST.filter(({ group }) => group === 'main');
export const OTHER_TOOLS = TOOL_LIST.filter(({ group }) => group === 'other');

/** Where the home page lists the other tools; the header links to it. */
export const OTHER_TOOLS_ANCHOR = 'outras-ferramentas';
