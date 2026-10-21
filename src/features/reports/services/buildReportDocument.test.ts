import { readFile } from 'node:fs/promises';

import { Packer } from 'docx';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';

import { buildReportValues } from '@/features/reports/__fixtures__/reportValues';
import { buildReportData } from '@/features/reports/services/buildReportData';
import { buildReportDocument } from '@/features/reports/services/buildReportDocument';
import type { HeaderImage, ReportFormValues } from '@/features/reports/types';

const loadDefaultHeaderImage = async (): Promise<HeaderImage> => {
  const file = await readFile('public/reports/brasao-df.png');
  return { data: new Uint8Array(file).buffer, type: 'png', width: 77, height: 91 };
};

const generate = async (overrides: Partial<ReportFormValues> = {}) => {
  const document = buildReportDocument(
    buildReportData(buildReportValues(overrides)),
    await loadDefaultHeaderImage(),
  );
  const zip = await JSZip.loadAsync(await Packer.toBuffer(document));
  const xmlText = async (path: string) => (await zip.file(path)?.async('string')) ?? '';
  // Joins every text node, so assertions do not depend on how Word splits runs.
  const plainText = (xml: string) =>
    [...xml.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map(([, text]) => text).join('');

  const documentXml = await xmlText('word/document.xml');

  return {
    zip,
    documentXml,
    documentText: plainText(documentXml),
    headerText: plainText(await xmlText('word/header1.xml')),
  };
};

describe('buildReportDocument', () => {
  it('writes one filled form per student, each one on a new page', async () => {
    const { documentXml, documentText } = await generate();

    expect(documentText).toContain('Estudante: ALICE SOUSA SILVESTRE');
    expect(documentText).toContain('Estudante: BERNARDO ANDRADE');
    expect(documentXml.match(/<w:pageBreakBefore\/>/g)).toHaveLength(1);
    expect(documentText.match(/REGISTRO DE AVALIAÇÃO – RAv/g)).toHaveLength(2);
  });

  it('fills the school, class and term data', async () => {
    const { documentText } = await generate();

    [
      'ANO LETIVO: 2022',
      'Ensino Fundamental – Anos Iniciais',
      'Coordenação Regional de Ensino: Gama',
      'Unidade Escolar: Escola Classe 18 do Gama',
      'Ano: 3º',
      'Turma: A',
      'Professor/a: SANDRA MARIA DOS SANTOS',
      '2º BIMESTRE',
      'Total de dias letivos: 50',
      'Total de Faltas: ',
      'Gama/DF, 11 de julho de 2022.',
      '32215-6',
      '210825-9',
    ].forEach((text) => expect(documentText).toContain(text));
  });

  it('marks only the chosen shift', async () => {
    const { documentText } = await generate({ shift: 'afternoon' });

    expect(documentText).toContain('□ Matutino');
    expect(documentText).toContain('■ Vespertino');
    expect(documentText).toContain('□ Integral');
  });

  it('keeps the official texts and the final result box', async () => {
    const { documentText } = await generate();

    expect(documentText).toContain('Professor (a), ao elaborar o Registro de Avaliação (RAv)');
    expect(documentText).toContain('Resultado Final (Preencher somente no 4º bimestre)');
    expect(documentText).toContain('□ Aprovado   □ Reprovado   □ Abandono   □ Cursando');
    expect(documentText).toContain('OBSERVAÇÕES GERAIS: a) O RAv – Formulário 1');
  });

  it('repeats the common text for every student with their own name', async () => {
    const { documentText } = await generate({ commonText: '[ALUNO] participou das atividades.' });

    expect(documentText).toContain('Alice Sousa Silvestre participou das atividades.');
    expect(documentText).toContain('Bernardo Andrade participou das atividades.');
  });

  it('puts the header text and the image in the page header', async () => {
    const { zip, headerText } = await generate();

    expect(headerText).toContain('SECRETARIA DE ESTADO DE EDUCAÇÃO DO DISTRITO FEDERAL');
    expect(headerText).toContain('SUBSECRETARIA DE EDUCAÇÃO BÁSICA');
    expect(Object.keys(zip.files).some((path) => path.startsWith('word/media/'))).toBe(true);
  });
});
