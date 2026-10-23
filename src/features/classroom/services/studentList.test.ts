import { describe, expect, it } from 'vitest';

import {
  cleanStudentList,
  hasMostlyUpperCaseNames,
  toNameCase,
} from '@/features/classroom/services/studentList';

describe('cleanStudentList', () => {
  it('keeps a clean list as it is', () => {
    expect(cleanStudentList('Ana Souza\nBruno Lima')).toEqual({
      names: ['Ana Souza', 'Bruno Lima'],
      fixes: [],
    });
  });

  it('removes numbering in its many forms', () => {
    const text = '01 - ANA SOUZA\n2. Bruno Lima\n3) Carla Dias\n4º Davi Rocha\n10 – Érica Melo';

    expect(cleanStudentList(text)).toEqual({
      names: ['ANA SOUZA', 'Bruno Lima', 'Carla Dias', 'Davi Rocha', 'Érica Melo'],
      fixes: ['numbers'],
    });
  });

  it('removes registration codes and dates around the name', () => {
    expect(cleanStudentList('202301234 Ana Souza 12/03/2015').names).toEqual(['Ana Souza']);
  });

  it('keeps only the column of names when pasted from Excel, without the header', () => {
    const text =
      'Nº\tMatrícula\tNome do aluno\tSituação\n1\t2023001\tAna Souza\tAtivo\n2\t2023002\tBruno Lima de Oliveira\tAtivo';

    expect(cleanStudentList(text)).toEqual({
      names: ['Ana Souza', 'Bruno Lima de Oliveira'],
      fixes: ['columns', 'header'],
    });
  });

  it('keeps commas of pasted names, but reads columns of a CSV file', () => {
    expect(cleanStudentList('Souza, Ana\nLima, Bruno').names).toEqual([
      'Souza, Ana',
      'Lima, Bruno',
    ]);
    expect(cleanStudentList('Nº;Nome\n1;Ana Souza\n2;Bruno Lima', 'file').names).toEqual([
      'Ana Souza',
      'Bruno Lima',
    ]);
  });

  it('drops a single header line', () => {
    expect(cleanStudentList('Aluno(a)\nAna Souza').names).toEqual(['Ana Souza']);
    expect(cleanStudentList('NOME\nAna Souza').names).toEqual(['Ana Souza']);
  });

  it('keeps names with apostrophes and hyphens', () => {
    expect(cleanStudentList("1 - Ana-Clara D'Ávila").names).toEqual(["Ana-Clara D'Ávila"]);
  });
});

describe('toNameCase', () => {
  it('capitalizes each word and keeps particles in lowercase', () => {
    expect(toNameCase('MARIA DA SILVA DOS SANTOS')).toBe('Maria da Silva dos Santos');
    expect(toNameCase('JOÃO E MARIA')).toBe('João e Maria');
  });

  it('capitalizes the first word even when it is a particle, and hyphenated names', () => {
    expect(toNameCase('DA COSTA ANA-CLARA')).toBe('Da Costa Ana-Clara');
  });
});

describe('hasMostlyUpperCaseNames', () => {
  it('is true when most names are in capital letters', () => {
    expect(hasMostlyUpperCaseNames(['ANA SOUZA', 'BRUNO LIMA', 'Carla Dias'])).toBe(true);
    expect(hasMostlyUpperCaseNames(['Ana Souza', 'BRUNO LIMA'])).toBe(false);
    expect(hasMostlyUpperCaseNames([])).toBe(false);
  });
});
