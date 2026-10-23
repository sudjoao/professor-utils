import { expect, fillStudents, test } from './fixtures';

test('a blocked download brings the teacher to what is missing', async ({ page }) => {
  await page.goto('/attendance');
  await page.getByRole('button', { name: 'Baixar planilha do Excel' }).first().click();

  const summary = page.getByRole('alert').filter({ hasText: 'Antes de baixar, falta arrumar' });
  await expect(summary).toBeFocused();
  await summary.getByRole('link', { name: 'Escreva o nome de pelo menos um aluno.' }).click();
  await expect(page.getByLabel('Nomes dos alunos')).toBeFocused();
});

test('the current term comes ready, without holidays', async ({ page }) => {
  await page.goto('/attendance');

  await expect(page.getByLabel('De', { exact: true })).toHaveValue('2026-10-06');
  await expect(page.getByLabel('Até', { exact: true })).toHaveValue('2026-12-21');
  await expect(page.getByText('50 datas com aula · 5 feriados ou recessos tirados')).toBeVisible();
});

test('downloads the attendance sheet and says where it is', async ({ page }) => {
  await page.goto('/attendance');
  await page.getByLabel('Turma (opcional)', { exact: true }).fill('7º A');
  await fillStudents(page, ['Bruno Lima', 'Ana Souza']);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Baixar planilha do Excel' }).first().click(),
  ]);

  expect(download.suggestedFilename()).toBe('lista-de-chamada-7o-a.xlsx');
  await expect(page.getByRole('status').filter({ hasText: 'Pronto!' })).toContainText('Downloads');
});
