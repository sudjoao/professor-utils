import { expect, test } from './fixtures';

test('the skip link is the first stop and jumps to the content', async ({ page }) => {
  await page.goto('/attendance');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('the header marks the current page', async ({ page }) => {
  await page.goto('/grades');
  await expect(page.getByRole('navigation').locator('[aria-current="page"]')).toHaveText(
    'Lista de notas',
  );
});

test('text size and colors are kept after reloading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Aumentar o texto' }).click();
  await page.getByRole('button', { name: 'Alto contraste' }).click();
  await page.reload();

  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'large');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'contrast');
});
