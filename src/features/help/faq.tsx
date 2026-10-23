import type { ReactNode } from 'react';

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Onde fica o arquivo que eu baixei?',
    answer: (
      <>
        <p>
          No computador, na pasta <strong>Downloads</strong>. No Chrome, ele também aparece no canto
          de cima da janela, numa setinha para baixo: clique nele para abrir.
        </p>
        <p>No celular, ele aparece nas notificações e no app &quot;Arquivos&quot;.</p>
      </>
    ),
  },
  {
    question: 'Não tenho Excel nem Word. Consigo abrir os arquivos?',
    answer: (
      <>
        <p>
          Dá até para não precisar deles: no último passo, clique em{' '}
          <strong>Imprimir ou salvar em PDF</strong>. Na janela que abrir, escolha a impressora ou
          &quot;Salvar como PDF&quot;.
        </p>
        <p>
          Para abrir os arquivos baixados, use o <strong>Google Planilhas</strong> e o{' '}
          <strong>Google Documentos</strong> (envie o arquivo para o Google Drive e clique duas
          vezes nele) ou o <strong>LibreOffice</strong>, que é gratuito. No celular, os apps do
          Excel e do Word também são gratuitos para abrir arquivos.
        </p>
      </>
    ),
  },
  {
    question: 'Meus dados ficam salvos? Alguém mais vê?',
    answer: (
      <>
        <p>
          Ficam salvos <strong>só neste navegador, neste computador</strong>, e não são enviados
          pela internet. Por isso:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>em outro computador, ou em outro navegador, as turmas não aparecem;</li>
          <li>limpar o histórico com &quot;dados de navegação&quot; apaga as turmas salvas;</li>
          <li>numa janela anônima, nada fica salvo depois de fechar.</li>
        </ul>
        <p>
          Para não correr esse risco, guarde uma cópia em <strong>Meus dados</strong>.
        </p>
      </>
    ),
  },
  {
    question: 'Como levo minhas turmas para outro computador?',
    answer: (
      <p>
        Em <strong>Meus dados</strong>, clique em &quot;Salvar uma cópia no computador&quot;. Leve o
        arquivo (pendrive, Google Drive ou e-mail) e, no outro computador, abra{' '}
        <strong>Meus dados</strong> e clique em &quot;Escolher o arquivo da cópia&quot;. Fazer uma
        cópia de vez em quando também protege se o navegador for limpo.
      </p>
    ),
  },
  {
    question: 'Copiei a lista de alunos do sistema e veio com números. E agora?',
    answer: (
      <p>
        É só colar: os números, matrículas e datas em volta dos nomes saem sozinhos, e de uma tabela
        do Excel fica só a coluna dos nomes. Se algo sair diferente do que você queria, clique em{' '}
        <strong>Desfazer</strong> no aviso que aparece embaixo da caixa.
      </p>
    ),
  },
  {
    question: 'Apaguei uma coisa sem querer. Dá para voltar?',
    answer: (
      <p>
        Dá. Sempre que algo é apagado ou trocado, aparece um aviso verde ao lado com o botão{' '}
        <strong>Desfazer</strong>. Ele fica na tela até você clicar em &quot;Ok&quot;.
      </p>
    ),
  },
  {
    question: 'Como imprimir todas as páginas da lista de chamada?',
    answer: (
      <p>
        Quando a lista tem muitas aulas, cada página fica numa aba embaixo da planilha. No Excel, vá
        em <strong>Arquivo</strong> → <strong>Imprimir</strong> e, em &quot;Configurações&quot;,
        escolha <strong>Imprimir pasta de trabalho inteira</strong>.
      </p>
    ),
  },
  {
    question: 'A letra da planilha impressa ficou pequena.',
    answer: (
      <p>
        No passo &quot;Aparência da planilha&quot;, escolha a letra <strong>Grande</strong>. A folha
        já sai ajustada para A4; com letra grande, a lista pode ocupar mais folhas.
      </p>
    ),
  },
  {
    question: 'Como os feriados saem da lista de chamada?',
    answer: (
      <>
        <p>
          A lista usa o calendário escolar da SEEDF: feriados e recessos saem sozinhos e aparecem
          marcados nas datas. Se a sua escola tiver aula num desses dias, clique na data para
          colocá-la de volta.
        </p>
        <p>
          Os dias letivos móveis ficam na lista, marcados como &quot;Dia móvel&quot;: se a escola
          trocou por recesso, desmarque.
        </p>
      </>
    ),
  },
  {
    question: 'Minha escola tem outro calendário (CIL, EJA, escola particular).',
    answer: (
      <p>
        Escreva as datas em &quot;De&quot; e &quot;Até&quot; e desmarque os dias sem aula. Se
        preferir, desligue a opção &quot;Tirar sozinho os feriados e recessos&quot;. No relatório, o
        total de dias letivos pode ser trocado à vontade.
      </p>
    ),
  },
  {
    question: 'Como coloco o brasão ou o logotipo da minha escola no relatório?',
    answer: (
      <p>
        No passo &quot;Local, data e assinaturas&quot;, clique em{' '}
        <strong>Escolher outra imagem</strong> e escolha uma imagem PNG ou JPG de até 1 MB. Ela fica
        salva para os próximos relatórios.
      </p>
    ),
  },
  {
    question: 'Está difícil de ler a tela.',
    answer: (
      <p>
        No topo da página, use <strong>A+</strong> para aumentar o texto e, em &quot;Cores&quot;,
        experimente <strong>Alto contraste</strong> ou <strong>Escuro</strong>. A escolha fica
        salva. Também dá para segurar a tecla <kbd>Ctrl</kbd> e apertar <kbd>+</kbd>.
      </p>
    ),
  },
  {
    question: 'Funciona no celular?',
    answer: (
      <p>
        Funciona, mas no computador é mais confortável para colar listas, abrir os arquivos e
        imprimir.
      </p>
    ),
  },
];
