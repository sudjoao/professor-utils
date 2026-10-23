# Professor Utils

Ferramentas simples para facilitar o dia a dia do professor: gerar listas de chamada, listas de notas e modelos de relatórios sobre os alunos.

O que mudou em cada versão está no [CHANGELOG.md](CHANGELOG.md).

## Funcionalidades planejadas

- [x] **Lista de chamada em Excel**: a partir de uma lista de nomes, gera a planilha de chamada por datas (um ou vários períodos, escolhendo os dias da semana e removendo feriados) ou por quantidade de aulas. Com o calendário da SEEDF, o período já começa no bimestre atual e feriados e recessos saem sozinhos (podem ser colocados de volta). A lista cabe na largura de uma folha A4 deitada; o que passar disso vai para novas páginas. No final, as colunas "Faltas" e "Freq." são calculadas pelo Excel com as marcas P/F/J de todas as páginas (abaixo de 75% fica em vermelho). Também gera uma folha para assinar (reuniões e eventos)
- [x] **Lista de notas**: planilha para lançar as notas, com colunas por quantidade ("Nota 1", "Nota 2"...) ou pelo título de cada avaliação, coluna final de média ou soma calculada pelo Excel e validação de 0 até a nota máxima; opcionalmente, pesos por nota (linha "Peso" editável no Excel), colunas de recuperação (a "Final" é a maior entre média e recuperação) e de situação ("Na média" / "Abaixo da média", em vermelho), com média mínima configurável
- [x] **Relatórios (RAv – Registro de Avaliação)**: gera em Word (`.docx`) o Formulário 1 da SEEDF para a turma inteira, um aluno por página, com cabeçalho (brasão), dados da escola, turma, turno, bimestre, dias letivos, local/data e matrículas já preenchidos. Opcionalmente, um texto comum com `[ALUNO]` é repetido para cada aluno com o nome dele, e cada aluno pode ter a sua avaliação e o total de faltas escritos no próprio app (com banco de frases prontas e "Minhas frases"); o que ficar em branco é completado no Word. Textos e dados da escola ficam salvos no navegador, por turma e bimestre. Antes de baixar, uma prévia mostra a página de cada aluno; dá para baixar tudo num arquivo só ou um `.docx` por aluno num `.zip`
- [x] **Aparência das planilhas**: paletas de cores prontas (cabeçalho e linhas alternadas), opção sem linhas alternadas e letra grande, com prévia; a escolha vale para chamada e notas e fica salva
- [x] **Lista de alunos de qualquer jeito**: ao colar, saem números, matrículas, datas e o título da coluna, e de uma tabela do Excel fica só a coluna dos nomes (com "Desfazer"); também abre .xlsx e .csv (inclusive CSV do Excel em Windows-1252) e passa nomes em MAIÚSCULAS para "Ana Souza"
- [x] **Turma compartilhada**: turma, disciplina, professor(a) e alunos ficam salvos como rascunho e já aparecem preenchidos nas três ferramentas, inclusive depois de recarregar a página

- [x] **Cópia de segurança** (`/data`, "Meus dados"): salva num arquivo `.json` as turmas, o rascunho, os dados da escola, a aparência das planilhas e a imagem do cabeçalho, e carrega de volta (com "Desfazer") em outro computador; a página inicial lembra de fazer uma cópia a cada 30 dias quando há turmas salvas

- [x] **Imprimir ou salvar em PDF** sem Excel ou Word: as três ferramentas montam a folha para impressão no próprio navegador (mesmas páginas, cores e legenda), e a janela de impressão já oferece "Salvar como PDF"

- [x] **Etiquetas com nomes**: para folhas A4 de etiquetas comuns (21, 14 ou 16 por folha, medidas Pimaco/Avery) ou papel comum para recortar, com várias por aluno, turma, disciplina ou outro texto, e "começar na etiqueta nº" para reaproveitar folhas

- [x] **Sorteio e grupos**: marca quem faltou, sorteia um aluno (sem repetir até todos saírem) e forma grupos equilibrados por quantidade ou tamanho, para copiar ou imprimir

- [x] **Mapa de sala**: fileiras e carteiras, alunos em ordem alfabética ou sorteados, troca de lugares com dois cliques (sem arrastar), salvo por turma e pronto para imprimir

- [x] **Bilhete aos responsáveis**: um texto com `[ALUNO]` vira um bilhete por aluno (escola, local, data e assinatura já preenchidos), com parte "Ciente" para recortar e devolver, de 1 a 4 por folha

- [x] **Ficha de conselho de classe**: colunas prontas (faltas, nota, aprendizagens, dificuldades, encaminhamentos...) e próprias, bimestre sugerido pelo calendário, em Excel ou impressa

## Público e acessibilidade

A maior parte das pessoas que usam o app tem 50 anos ou mais. Por isso:

- texto base de 18px, controle **A− / A+** e cores **Claro / Escuro / Alto contraste** no topo (salvos no navegador e aplicados antes da primeira pintura);
- linguagem simples, um passo por card ("Passo 1 de 4") e exemplos em todos os campos;
- erros aparecem ao lado do campo e num resumo que recebe o foco, com links para cada campo;
- tudo funciona pelo teclado (link "Pular para o conteúdo", foco sempre visível) e com leitor de tela;
- depois do download, um aviso diz onde encontrar o arquivo.
- cada passo tem "Como fazer este passo?", e `/help` reúne as perguntas frequentes;
- o que fica salvo mostra "Salvo neste computador", e os formulários esperam os dados salvos (`RestoreGate`) para não parecerem vazios;
- turmas salvas são botões ("Usar esta turma", "Apagar"), não um menu suspenso;
- no celular, o botão de baixar fica fixo embaixo enquanto o último passo não está na tela.
- nada de "Tem certeza?": as ações acontecem na hora e um aviso ao lado oferece **Desfazer** (`UndoNotice` + `useUndoNotice`), sem sumir sozinho.

Ao criar telas novas, use os componentes de `src/components` (abaixo) em vez de montar label/erro à mão, e prefira `ChoiceCards`/`OptionButtons` a abas para escolhas.

## Desempenho e uso sem internet

- **App instalável e offline**: `src/app/manifest.ts` + `public/sw.js` (registrado só em produção). Depois da primeira visita, as páginas e os arquivos do app ficam guardados: dá para abrir, navegar e gerar as planilhas sem internet. Ao mudar a estratégia de cache, suba `VERSION` em `sw.js`.
- **ExcelJS e docx** só baixam quando o passo de baixar chega perto da tela (ou ao passar o mouse no botão), e não ao abrir a página.
- **Gravação no navegador**: o redux-persist grava com `throttle` e salva o que falta ao fechar a página (`pagehide`). A imagem do cabeçalho fica numa chave própria (`createStoredValue`), para não ser regravada a cada tecla.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Redux Toolkit](https://redux-toolkit.js.org) + [redux-persist](https://github.com/rt2zz/redux-persist) (dados salvos no `localStorage`, sem backend por enquanto)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [ExcelJS](https://github.com/exceljs/exceljs) e [docx](https://docx.js.org) para gerar `.xlsx` e `.docx` no navegador
- [Vitest](https://vitest.dev) para testes
- Deploy na [Vercel](https://vercel.com)

## Como rodar

Pré-requisitos: Node 22+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script           | O que faz                                                                        |
| ---------------- | -------------------------------------------------------------------------------- |
| `pnpm dev`       | Servidor de desenvolvimento                                                      |
| `pnpm build`     | Build de produção                                                                |
| `pnpm lint`      | ESLint (`pnpm lint:fix` corrige o que der)                                       |
| `pnpm typecheck` | Gera os tipos de rota do Next e roda o `tsc`                                     |
| `pnpm test`      | Testes com Vitest (`pnpm test:watch` em watch)                                   |
| `pnpm test:e2e`  | Testes ponta a ponta no navegador (Playwright + auditoria de acessibilidade axe) |
| `pnpm format`    | Formata o código com Prettier                                                    |

## Estrutura

```
src/
  app/                  # rotas (App Router): só compõem a página, sem regra de negócio
  features/             # um módulo por funcionalidade
    classroom/          # domínio compartilhado: turmas salvas, rascunho da turma (classDraft),
                        #   aparência das planilhas (sheetStyle), card "Turma e alunos"
                        #   e layout base das planilhas (classSheet)
    backup/             # cópia de segurança dos dados do navegador (salvar e carregar .json)
    labels/             # etiquetas com nomes (folhas A4 de etiquetas, medidas em mm)
    draw/               # sorteio de aluno e formação de grupos
    seating/            # mapa de sala (salvo por turma)
    parentNotes/        # bilhete aos responsáveis
    council/            # ficha de conselho de classe
    attendance/         # lista de chamada
    grades/             # lista de notas
    reports/            # relatórios (RAv); textos oficiais em services/officialTexts.ts
    schoolCalendar/     # calendário da SEEDF (bimestres, recessos, dias móveis) e feriados
                        #   calculados para qualquer ano; um ano novo entra em constants.ts
      components/       #   componentes React da feature
      services/         #   lógica pura (ex.: montar a planilha), sem React, fácil de testar
  components/
    StepCard.tsx        # card de um passo do formulário ("Passo 2 de 4"), com título h2
    FormField.tsx       # FormField / FieldGroup: rótulo, dica, erro e "(opcional)" já ligados ao campo
    NumberField.tsx     # campo numérico com botões − e +, aceita vírgula
    ChoiceCards.tsx     # escolha única com opções grandes e explicadas (substitui abas)
    OptionButtons.tsx   # escolha única compacta (bimestre, turno, cálculo...)
    ExportPanel.tsx     # resumo, erros com links, botão de download e aviso de sucesso
    MobileDownloadBar.tsx # botão de baixar fixo no celular
    UndoNotice.tsx      # aviso com "Desfazer" ao lado da ação (com lib/react/useUndoNotice)
    print/PrintButton.tsx # "Imprimir ou salvar em PDF": renderiza a folha só para a impressão
    SaveStatus.tsx      # "Salvando... / Salvo neste computador"
    RestoreGate.tsx     # espera os dados salvos no navegador antes de mostrar o formulário
    layout/             # header, navegação, controles de texto e cores, link "pular", container
    ui/                 # componentes gerados pelo shadcn (não editar à mão)
  config/tools.ts       # lista de ferramentas (título, descrição, rota, ícone)
  lib/                  # utilitários genéricos (texto, datas, números, excel, arquivos,
                        #   erros de formulário, tamanho do texto, cn)
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

## Testes ponta a ponta

`e2e/` tem testes que abrem o app de verdade no navegador (Playwright): auditoria de acessibilidade WCAG 2.2 AA (axe) em todas as páginas, no computador e no celular e nos temas escuro e de alto contraste, e os fluxos principais (erros, download da chamada, turma compartilhada, lista colada, relatório com avaliações, cópia de segurança). A data do navegador fica fixa em 23/10/2026, para o calendário não mudar os resultados.

Na primeira vez, instale o navegador: `pnpm exec playwright install --only-shell chromium`. O `pnpm test:e2e` faz o build e sobe o app sozinho (porta 3100).

O CI (`.github/workflows/ci.yml`) roda lint, tipos, formatação, testes unitários e ponta a ponta em cada push na `main` e em cada PR.

## Deploy

O deploy é feito na Vercel: basta importar o repositório em [vercel.com/new](https://vercel.com/new). O Next.js e o pnpm são detectados automaticamente, sem precisar de `vercel.json`. Cada push na branch principal gera um deploy de produção e cada PR ganha um preview.
