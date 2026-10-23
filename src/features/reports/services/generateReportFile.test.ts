import { readFile } from 'node:fs/promises';

import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';

import { buildReportValues } from '@/features/reports/__fixtures__/reportValues';
import { buildReportData } from '@/features/reports/services/buildReportData';
import { buildReportZip } from '@/features/reports/services/generateReportFile';

describe('buildReportZip', () => {
  it('puts one document per student in the zip, in class order', async () => {
    const file = await readFile('public/reports/brasao-df.png');
    const zip = await buildReportZip(buildReportData(buildReportValues()), {
      data: new Uint8Array(file).buffer,
      type: 'png',
      width: 77,
      height: 91,
    });
    const names = Object.keys(zip.files).sort();

    expect(names).toEqual([
      '01 - ALICE SOUSA SILVESTRE - RAv 2º bimestre.docx',
      '02 - BERNARDO ANDRADE - RAv 2º bimestre.docx',
    ]);

    const firstDocument = await JSZip.loadAsync(await zip.file(names[0])!.async('arraybuffer'));
    const xml = (await firstDocument.file('word/document.xml')?.async('string')) ?? '';
    expect(xml).toContain('ALICE SOUSA SILVESTRE');
    expect(xml).not.toContain('BERNARDO ANDRADE');
  });
});
