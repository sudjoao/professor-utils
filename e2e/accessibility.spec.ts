import { expectNoAccessibilityViolations, test } from './fixtures';

const PAGES = [
  '/',
  '/attendance',
  '/grades',
  '/reports',
  '/labels',
  '/draw',
  '/seating',
  '/parent-notes',
  '/class-council',
  '/data',
  '/help',
];

for (const path of PAGES) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expectNoAccessibilityViolations(page);
  });
}

for (const theme of ['dark', 'contrast']) {
  test(`the forms have no violations in the ${theme} theme, errors showing`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('professor-utils:theme', value),
      theme,
    );

    for (const path of ['/attendance', '/grades', '/reports']) {
      await page.goto(path);
      await page
        .getByRole('button', { name: /^Baixar/ })
        .first()
        .click();
      await expectNoAccessibilityViolations(page);
    }
  });
}
