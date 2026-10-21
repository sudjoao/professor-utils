/*
 * Fixed texts of the SEEDF "RAv – Formulário 1", copied from the official template.
 * Rich texts are lists of runs so the document keeps the original bold/italic parts.
 */
export type RichText = { text: string; bold?: boolean; italics?: boolean }[];

export const HEADER_LINES = [
  'SECRETARIA DE ESTADO DE EDUCAÇÃO DO DISTRITO FEDERAL',
  'SUBSECRETARIA DE EDUCAÇÃO BÁSICA',
];

export const FORM_TITLE = 'REGISTRO DE AVALIAÇÃO – RAv';

export const FORM_SUBTITLE = 'Formulário 1: Descrição do Processo de Aprendizagem do Estudante';

export const GUIDANCE: RichText = [
  { text: 'Professor (a), ao elaborar o Registro de Avaliação (' },
  { text: 'RAv', bold: true },
  {
    text: ') - Descrição do Processo de Aprendizagem do Estudante, é importante considerar, conforme as DIRETRIZES DE AVALIAÇÃO (2014, p.49) “que o mesmo contenha elementos da avaliação diagnóstica observados pelo docente e/ou pelo Conselho de Classe: as aprendizagens evidenciadas e as dificuldades percebidas devem ser descritas na primeira parte do documento. Em seguida, ',
  },
  { text: 'devem-se', bold: true },
  {
    text: ' apresentar as estratégias utilizadas ou as intervenções conduzidas para sanar tais dificuldades, bem como os resultados das intervenções e outras orientações que se fizerem necessárias para que o registro cumpra a sua função formativa”. ',
  },
  { text: 'Importante considerar também', bold: true },
  {
    text: ' o Currículo em Movimento da Educação Básica, da SEEDF, e o Projeto Político Pedagógico da Unidade Escolar.',
  },
];

export const SIGNATURE_LABELS = {
  teacher: 'Assinatura/Matrícula do/a Professor/a',
  coordinator: 'Assinatura/Matrícula do/a Coordenador/a',
  guardian: 'Assinatura do/a Pai/Mãe ou Responsável Legal',
};

export const FINAL_RESULT_TITLE = 'Resultado Final (Preencher somente no 4º bimestre)';

export const FINAL_RESULT_OPTIONS = ['Aprovado', 'Reprovado', 'Abandono', 'Cursando'];

export const GENERAL_NOTES: RichText = [
  { text: 'OBSERVAÇÕES GERAIS: ' },
  { text: 'a)', bold: true, italics: true },
  { text: ' O RAv – ' },
  { text: 'Formulário 1', bold: true, italics: true },
  {
    text: ': Descrição do Processo de Aprendizagem do Estudante é o documento oficial da Secretaria de Estado de Educação do Distrito Federal, ',
  },
  { text: 'o qual', bold: true },
  { text: ', quando solicitado, ' },
  { text: 'deve', bold: true },
  {
    text: ' ser apresentado à Coordenação de Supervisão Institucional e Normas de Ensino – COSINE; ',
  },
  { text: 'b)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Constitui ', bold: true },
  { text: 'documento de escrituração escolar ' },
  { text: 'que também compõe', bold: true },
  { text: ' o dossiê do estudante, ' },
  { text: 'devendo o documento original', bold: true },
  { text: ', acompanhá-lo ' },
  { text: 'em caso de', bold: true },
  { text: ' transferência; ' },
  { text: 'c)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Deve', bold: true },
  { text: ' ser compartilhado com as famílias e/ou os responsáveis legais ' },
  { text: 'e com o', bold: true },
  { text: ' próprio estudante, ao final de cada bimestre; ' },
  { text: 'd)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Constitui', bold: true },
  { text: ' fonte informativa ' },
  { text: 'para', bold: true },
  { text: ' o trabalho pedagógico com o estudante; ' },
  { text: 'e)', bold: true, italics: true },
  { text: ' Deve ser preenchido sem emendas ou rasuras; ' },
  { text: 'f)', bold: true, italics: true },
  { text: ' O ' },
  { text: 'Campo', bold: true, italics: true },
  { text: ' ' },
  {
    text: '“Resultado Final” deve ser preenchido apenas ao final do 4º Bimestre, marcando:',
    bold: true,
  },
  { text: ' ' },
  { text: 'f.1.)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Cursando', bold: true, italics: true },
  {
    text: ' para todos os estudantes que estejam matriculados no 1º ou o no 2º ano do 1º Bloco (Bloco Inicial de Alfabetização – BIA); e para todos os estudantes matriculados no 4º ano do 2º Bloco, bem como para aqueles estudantes beneficiados com a ',
  },
  { text: '“Adequação Curricular na Temporalidade”', italics: true },
  { text: '; ' },
  { text: 'f.2.)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Reprovado', bold: true, italics: true },
  { text: ', apenas ao final do 3º ano do 1º Bloco (Bloco Inicial de Alfabetização - BIA), ' },
  { text: 'quando for o caso', bold: true },
  {
    text: '; e, ao final do 5º ano do 2º Bloco, para aqueles estudantes matriculados em Unidades Escolares que aderiram à Organização Escolar do 2º Ciclo para as aprendizagens, quando for o caso; ',
  },
  { text: 'e', bold: true },
  { text: ', ' },
  { text: 'f.3.)', bold: true, italics: true },
  { text: ' ' },
  { text: 'Reprovado', bold: true, italics: true },
  { text: ', quando for o caso', bold: true },
  {
    text: ', para todos os estudantes que estejam matriculados no 4º ou no 5º ano do Ensino Fundamental, cuja Organização Escolar é Seriada; ',
  },
  { text: 'f.4.) Reprovado', bold: true, italics: true },
  {
    text: ', para todos os estudantes que excederam aos 25% (vinte e cinco por cento) de faltas permitidas, nos termos do Regimento Escolar. ',
  },
  { text: 'g)', bold: true, italics: true },
  { text: ' O RAv – ' },
  { text: 'Formulário 1', bold: true, italics: true },
  { text: ' ' },
  { text: 'deve ser assinado pelo(a) Professor(a), Coordenador(a) Pedagógico(a)', bold: true },
  { text: ' e Pai/Mãe ou Responsável Legal do Estudante.' },
];
