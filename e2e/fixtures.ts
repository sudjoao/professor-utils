import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test as base } from '@playwright/test';

/** A fixed day inside the 4th term of the 2026 SEEDF calendar, so dates never change. */
export const TODAY = new Date('2026-10-23T10:00:00-03:00');

export const test = base.extend({
  // Named `runTest`, not `use`, so the React hooks lint rule does not mistake it for a hook.
  page: async ({ page }, runTest) => {
    await page.clock.setFixedTime(TODAY);
    await runTest(page);
  },
});

export { expect };

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

export const expectNoAccessibilityViolations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = violations.map(
    ({ id, nodes }) => `${id}: ${nodes.map(({ target }) => target.join(' ')).join(', ')}`,
  );
  expect(summary).toEqual([]);
};

export const fillStudents = async (page: Page, names: string[]) =>
  page.getByLabel('Nomes dos alunos').fill(names.join('\n'));
