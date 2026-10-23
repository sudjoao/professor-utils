import { describe, expect, it } from 'vitest';

import {
  buildLabelDetails,
  buildLabelSheets,
  getLabelModel,
  getNameFontSize,
  labelsPerSheet,
} from '@/features/labels/services/buildLabelSheets';

const model = getLabelModel('a4-21');
const label = (name: string) => ({ name, details: [] });

describe('buildLabelSheets', () => {
  it('repeats each student and fills the sheets in order', () => {
    const sheets = buildLabelSheets({
      labels: [label('Ana'), label('Bruno')],
      model,
      copiesPerStudent: 2,
      startAt: 1,
    });

    expect(sheets).toHaveLength(1);
    expect(sheets[0].map((item) => item?.name)).toEqual(['Ana', 'Ana', 'Bruno', 'Bruno']);
  });

  it('skips the labels already used on the first sheet', () => {
    const [first] = buildLabelSheets({
      labels: [label('Ana')],
      model,
      copiesPerStudent: 1,
      startAt: 4,
    });

    expect(first).toEqual([null, null, null, { name: 'Ana', details: [] }]);
  });

  it('starts a new sheet when one is full', () => {
    const labels = Array.from({ length: labelsPerSheet(model) + 1 }, (_, index) =>
      label(`A${index}`),
    );
    const sheets = buildLabelSheets({ labels, model, copiesPerStudent: 1, startAt: 1 });

    expect(sheets.map((sheet) => sheet.length)).toEqual([21, 1]);
  });

  it('returns no sheet without students', () => {
    expect(buildLabelSheets({ labels: [], model, copiesPerStudent: 1, startAt: 5 })).toEqual([]);
  });
});

describe('buildLabelDetails', () => {
  it('lists only the chosen details', () => {
    expect(
      buildLabelDetails({
        classroomName: '7º A',
        subject: 'Matemática',
        extraText: ' EC 18 ',
        showClassroom: true,
        showSubject: false,
      }),
    ).toEqual(['Turma: 7º A', 'EC 18']);
  });
});

describe('getNameFontSize', () => {
  it('shrinks long names', () => {
    expect(getNameFontSize('Ana Souza', model)).toBe(14);
    expect(getNameFontSize('Maria Eduarda dos Santos Oliveira Lima', model)).toBe(10);
  });
});
