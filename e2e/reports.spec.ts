import { readFile } from 'node:fs/promises';

import JSZip from 'jszip';

import { expect, fillStudents, test } from './fixtures';

test('the report comes with each student evaluation and absences', async ({ page }) => {
  await page.goto('/reports');
  for (const [label, value] of [
    ['Turma', 'A'],
    ['Professor(a)', 'Sandra'],
    ['Coordenação Regional de Ensino', 'Gama'],
    ['Unidade Escolar', 'Escola Classe 18'],
    ['Ano', '3º'],
    ['Local', 'Gama/DF'],
  ]) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await fillStudents(page, ['Alice Sousa', 'Bernardo Andrade']);

  await page.locator('summary', { hasText: 'Alice Sousa' }).click();
  await page.getByLabel('Avaliação de Alice Sousa (opcional)').fill('Alice avançou na leitura.');
  await page.locator('#student-evaluation-0').getByLabel('Total de faltas (opcional)').fill('3');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Baixar relatórios do Word' }).first().click(),
  ]);
  const zip = await JSZip.loadAsync(await readFile(await download.path()));
  const xml = (await zip.file('word/document.xml')?.async('string')) ?? '';

  expect(download.suggestedFilename()).toBe('rav-4o-bimestre-a.docx');
  expect(xml).toContain('Alice avançou na leitura.');
  expect(xml).toContain('Total de Faltas: 3');
  expect(xml).toContain('Total de dias letivos: 50');
});
