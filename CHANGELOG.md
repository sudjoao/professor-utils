# Novidades do Professor Utils

Todas as mudanças importantes do projeto ficam registradas aqui, da mais nova para a mais antiga.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/). Enquanto o projeto estiver na versão 0.x, cada versão nova pode trazer mudanças grandes.

## [Não lançado]

## [0.5.0] - 2026-10-23

Cinco ferramentas novas, que usam a mesma turma já digitada nas outras.

### Adicionado

- **Etiquetas com nomes**: etiquetas para cadernos, pastas e livros, em folhas A4 de etiquetas (21, 14 ou 16 por folha, medidas Pimaco/Avery) ou em papel comum para recortar. Dá para fazer várias etiquetas por aluno, incluir a turma, a disciplina ou outro texto, e começar numa etiqueta escolhida para aproveitar uma folha já usada.
- **Sorteio e grupos**: marca quem faltou, sorteia um aluno (sem repetir até todos saírem) e forma grupos equilibrados por número de grupos ou por alunos em cada grupo. Os grupos podem ser copiados ou impressos.
- **Mapa de sala**: define fileiras e carteiras, coloca os alunos em ordem alfabética ou em lugares sorteados e troca dois alunos de lugar com dois cliques. O mapa fica salvo por turma e sai pronto para imprimir.
- **Bilhete aos responsáveis**: um texto escrito uma vez vira um bilhete por aluno, com escola, local, data e assinatura já preenchidos e uma parte "Ciente" para recortar e devolver. Cabem de 1 a 4 bilhetes por folha.
- **Ficha de conselho de classe**: colunas prontas (faltas, nota ou conceito, aprendizagens, dificuldades, encaminhamentos...) e colunas próprias, com o bimestre sugerido pelo calendário. Sai em Excel ou impressa.
- No menu do topo, "Outras ferramentas" leva à nova seção da página inicial, com as ferramentas acima.

### Corrigido

- O relatório começava sempre no 1º bimestre. Agora ele segue o bimestre atual do calendário até a pessoa escolher outro.

### Para quem desenvolve

- Testes ponta a ponta no navegador (`pnpm test:e2e`, com Playwright) e auditoria de acessibilidade WCAG 2.2 AA (axe) em todas as páginas, no computador, no celular e nos temas escuro e de alto contraste.
- CI no GitHub Actions: lint, tipos, formatação, testes unitários, build e testes ponta a ponta em cada push e PR.

## [0.4.0] - 2026-10-23

Mais recursos nas três ferramentas principais e uma forma de levar os dados para outro computador.

### Adicionado

- **Cópia de segurança** (página "Meus dados"): salva num arquivo as turmas, a turma em preparo, os dados da escola, as avaliações, as frases, os mapas de sala, a aparência das planilhas e a imagem do cabeçalho. O arquivo pode ser carregado em outro computador. A página inicial lembra de fazer uma cópia a cada 30 dias.
- **Relatório**:
  - a avaliação e o total de faltas de cada aluno podem ser escritos no próprio app, com o botão "Próximo aluno";
  - banco de frases prontas por tema, que já entram com o nome do aluno, e "Minhas frases" para guardar as suas;
  - prévia da página de cada aluno antes de baixar;
  - opção de baixar um arquivo do Word por aluno, todos juntos num `.zip`.
- **Lista de chamada**:
  - colunas "Faltas" e "Freq." calculadas pelo Excel com as marcas P, F e J de todas as páginas, com a frequência em vermelho abaixo de 75%;
  - legenda em cada página;
  - novo tipo de lista, "Folha para assinar", para reuniões e eventos.
- **Lista de notas**: pesos diferentes por nota, colunas de recuperação e de nota final, e coluna de situação ("Na média" / "Abaixo da média", em vermelho) com média mínima configurável.
- **Imprimir ou salvar em PDF** direto do navegador em todas as ferramentas, para quem não tem Excel nem Word.

### Alterado

- O texto que se repete em todos os relatórios agora fica salvo por turma e bimestre. Antes, ele se perdia ao recarregar a página.
- Corretor ortográfico em português nas caixas de texto do relatório e desligado na lista de nomes, onde só marcava sobrenomes.

## [0.3.0] - 2026-10-23

Menos digitação, menos medo de errar e uso sem internet.

### Adicionado

- **Calendário da SEEDF 2026**:
  - a chamada já começa no bimestre atual, com botões para os outros bimestres;
  - feriados e recessos saem sozinhos (e podem voltar), e os dias letivos móveis ficam marcados;
  - no relatório, os dias letivos vêm preenchidos.
- **Lista de alunos de qualquer jeito**:
  - ao colar, saem números, matrículas e datas, e de uma tabela do Excel fica só a coluna dos nomes;
  - dá para abrir um arquivo `.xlsx` ou `.csv`;
  - nomes em MAIÚSCULAS podem virar "Ana Souza".
- **"Desfazer"** no lugar das perguntas "Tem certeza?": carregar, salvar, atualizar e apagar turmas acontecem na hora e podem ser desfeitos.
- Cores da tela: Claro, Escuro e Alto contraste.
- "Como fazer este passo?" em cada passo e a página **Ajuda**, com perguntas frequentes.
- Aviso "Salvo neste computador" nos passos que guardam dados.
- No celular, o botão de baixar fica fixo embaixo da tela.
- O app pode ser instalado no computador ou no celular e, depois da primeira visita, abre e gera planilhas sem internet.

### Alterado

- As turmas salvas viraram botões ("Usar esta turma", "Apagar"), no lugar do menu suspenso.
- Os formulários esperam os dados salvos antes de aparecer, para não parecer que tudo sumiu.

### Desempenho

- Digitar ficou mais leve: antes, cada tecla regravava a imagem do cabeçalho inteira (~1,3 MB) no navegador; agora grava ~1 KB.
- As bibliotecas do Excel e do Word começam a carregar quando a pessoa se aproxima do botão de baixar.
- O brasão do DF caiu de 136 KB para 8 KB, sem diferença visível, e o arquivo do Word ficou bem menor.

## [0.2.0] - 2026-10-21

O app pensado para quem tem 50 anos ou mais.

### Adicionado

- Controle **A− / A+** no topo para aumentar o texto, e a escolha fica salva.
- Link "Pular para o conteúdo" e foco sempre visível para quem usa o teclado.
- Erros ao lado de cada campo e num resumo com links que levam direto ao campo.
- Aviso depois do download, dizendo onde encontrar o arquivo.
- **Turma compartilhada**: turma, disciplina, professor(a) e alunos digitados numa ferramenta aparecem nas outras, mesmo depois de recarregar a página.
- **Aparência das planilhas**: 7 paletas de cores, opção de linhas alternadas e letra grande, com prévia.
- Página inicial com "Como funciona" e aviso de que os dados ficam só no computador.

### Alterado

- Interface maior por padrão (texto de 18px), com mais contraste e botões maiores.
- Textos revistos para linguagem simples e um passo por vez ("Passo 1 de 4").
- Abas trocadas por opções grandes e explicadas, e campos de número com botões − e +.

## [0.1.0] - 2026-10-21

Primeira versão.

### Adicionado

- **Lista de chamada** em Excel, por datas (com dias da semana e sem feriados) ou por quantidade de aulas, em folha A4 deitada.
- **Lista de notas** em Excel, com colunas numeradas ou com nomes, média ou soma calculada pelo Excel e aviso para notas acima da máxima.
- **Relatórios (RAv – Formulário 1 da SEEDF)** em Word, um aluno por página, com os dados da escola e da turma já preenchidos.
- Turmas salvas no navegador para usar de novo.

[Não lançado]: https://github.com/sudjoao/professor-utils/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/sudjoao/professor-utils/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/sudjoao/professor-utils/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/sudjoao/professor-utils/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/sudjoao/professor-utils/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/sudjoao/professor-utils/releases/tag/v0.1.0
