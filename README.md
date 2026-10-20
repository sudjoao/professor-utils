# Professor Utils

Ferramentas simples para facilitar o dia a dia do professor: gerar listas de chamada, listas de notas e modelos de relatórios sobre os alunos.

## Funcionalidades planejadas

- [ ] **Lista de chamada em Excel**: a partir de uma lista de nomes, gera a planilha de chamada com a quantidade de aulas escolhida pelo professor
- [ ] **Lista de notas**: planilha para lançar as notas das avaliações da turma
- [ ] **Modelos de relatórios**: modelos de relatórios descritivos sobre os alunos

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Redux Toolkit](https://redux-toolkit.js.org) + [redux-persist](https://github.com/rt2zz/redux-persist) (dados salvos no `localStorage`, sem backend por enquanto)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [ExcelJS](https://github.com/exceljs/exceljs) para gerar as planilhas `.xlsx` no navegador
- [Vitest](https://vitest.dev) para testes
- Deploy na [Vercel](https://vercel.com)

## Como rodar

Pré-requisitos: Node 22+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script           | O que faz                                      |
| ---------------- | ---------------------------------------------- |
| `pnpm dev`       | Servidor de desenvolvimento                    |
| `pnpm build`     | Build de produção                              |
| `pnpm lint`      | ESLint (`pnpm lint:fix` corrige o que der)     |
| `pnpm typecheck` | Gera os tipos de rota do Next e roda o `tsc`   |
| `pnpm test`      | Testes com Vitest (`pnpm test:watch` em watch) |
| `pnpm format`    | Formata o código com Prettier                  |

## Estrutura

```
src/
  app/                  # rotas (App Router): só compõem a página, sem regra de negócio
  features/             # um módulo por funcionalidade
    classroom/          # domínio compartilhado: turmas e alunos (slice do Redux)
    attendance/         # lista de chamada
    grades/             # lista de notas
    reports/            # relatórios
      components/       #   componentes React da feature
      services/         #   lógica pura (ex.: montar a planilha), sem React, fácil de testar
  components/
    layout/             # header, container de página etc.
    ui/                 # componentes gerados pelo shadcn (não editar à mão)
  config/tools.ts       # lista de ferramentas (título, descrição, rota, ícone)
  lib/                  # utilitários genéricos (texto, excel, cn)
  store/                # configuração do Redux, hooks tipados e Provider
```

Novos componentes do shadcn: `pnpm dlx shadcn@latest add <componente>`.

## Convenções

- **Arrow functions sempre** (funções, componentes e callbacks) — garantido pelo ESLint.
- **Código em inglês, interface em português (pt-BR).**
- `type` em vez de `interface` para tipos.
- Regra de negócio fica em `features/<feature>/services/` como funções puras; componentes só cuidam de UI.
- Use `useAppDispatch` / `useAppSelector` de `@/store/hooks`, nunca os hooks do `react-redux` direto.
- Estado global só para o que precisa ser compartilhado ou persistido; estado de formulário fica local no componente.
- Nomes que dizem o que a coisa faz, funções pequenas e com uma responsabilidade.
- Testes ao lado do arquivo testado: `algo.ts` → `algo.test.ts`.

## Deploy

O deploy é feito na Vercel: basta importar o repositório em [vercel.com/new](https://vercel.com/new). O Next.js e o pnpm são detectados automaticamente, sem precisar de `vercel.json`. Cada push na branch principal gera um deploy de produção e cada PR ganha um preview.
