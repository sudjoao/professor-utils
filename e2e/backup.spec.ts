import { expect, fillStudents, test } from './fixtures';

test('a backup takes the saved classes to another browser', async ({ page, browser }) => {
  await page.goto('/grades');
  await page.getByLabel('Turma (opcional)', { exact: true }).fill('7º A');
  await fillStudents(page, ['Ana', 'Bruno']);
  await page.getByRole('button', { name: 'Salvar esta turma para usar depois' }).click();

  await page.goto('/data');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Salvar uma cópia no computador' }).click(),
  ]);
  const backupPath = await download.path();

  const otherBrowser = await browser.newContext({ serviceWorkers: 'block' });
  const otherPage = await otherBrowser.newPage();
  await otherPage.goto('/data');
  await expect(otherPage.getByText('0 turmas salvas')).toBeVisible();
  await otherPage.locator('input[type=file]').setInputFiles(backupPath);
  await expect(otherPage.getByText('1 turma salva (2 alunos ao todo)')).toBeVisible();
  await otherBrowser.close();
});
