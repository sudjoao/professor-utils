import { expect, fillStudents, test } from './fixtures';

test('the class typed in one tool shows up in the others, even after reloading', async ({
  page,
}) => {
  await page.goto('/attendance');
  await page.getByLabel('Turma (opcional)', { exact: true }).fill('7º A');
  await page.getByLabel('Professor(a) (opcional)').fill('Sandra Maria');
  await fillStudents(page, ['Ana Souza', 'Bruno Lima']);

  await page.getByRole('navigation').getByRole('link', { name: 'Relatórios de alunos' }).click();
  await expect(page.getByLabel('Professor(a)', { exact: true })).toHaveValue('Sandra Maria');

  await page.reload();
  await expect(page.getByLabel('Nomes dos alunos')).toHaveValue('Ana Souza\nBruno Lima');
});

test('a pasted numbered list is cleaned, and the cleanup can be undone', async ({ page }) => {
  await page.goto('/grades');
  const students = page.getByLabel('Nomes dos alunos');
  await students.focus();
  await students.evaluate((element) => {
    const data = new DataTransfer();
    data.setData('text/plain', '01 - ANA SOUZA\n02 - BRUNO LIMA');
    element.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
  });

  await expect(students).toHaveValue('ANA SOUZA\nBRUNO LIMA');
  await page.getByRole('button', { name: 'Deixar como "Ana Souza"' }).click();
  await expect(students).toHaveValue('Ana Souza\nBruno Lima');
  await page.getByRole('button', { name: 'Desfazer' }).click();
  await expect(students).toHaveValue('ANA SOUZA\nBRUNO LIMA');
});
