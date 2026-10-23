import { describe, expect, it, vi } from 'vitest';

import { moveHeaderImageOut } from '@/store/migrations';

const persist = { version: 1, rehydrated: false };

describe('moveHeaderImageOut', () => {
  it('moves the header image to its own storage', () => {
    const saveHeaderImage = vi.fn();
    const state = moveHeaderImageOut(
      { _persist: persist, reportSettings: { schoolName: 'Escola', headerImage: 'data:image' } },
      saveHeaderImage,
    );

    expect(saveHeaderImage).toHaveBeenCalledWith('data:image');
    expect(state).toEqual({ _persist: persist, reportSettings: { schoolName: 'Escola' } });
  });

  it('only drops the field when there was no image', () => {
    const saveHeaderImage = vi.fn();
    const state = moveHeaderImageOut(
      { _persist: persist, reportSettings: { headerImage: null } },
      saveHeaderImage,
    );

    expect(saveHeaderImage).not.toHaveBeenCalled();
    expect(state).toEqual({ _persist: persist, reportSettings: {} });
  });

  it('keeps states without the field as they are', () => {
    const state = { _persist: persist, classroom: { classrooms: [] } };
    expect(moveHeaderImageOut(state, vi.fn())).toBe(state);
  });
});
