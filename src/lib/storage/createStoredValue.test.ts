import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createStoredValue } from '@/lib/storage/createStoredValue';

const createMemoryStorage = () => {
  const items = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => items.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => void items.set(key, value)),
    removeItem: vi.fn((key: string) => void items.delete(key)),
  };
};

describe('createStoredValue', () => {
  let storage: ReturnType<typeof createMemoryStorage>;

  beforeEach(() => {
    storage = createMemoryStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads the browser only once', () => {
    storage.setItem('key', 'saved');
    const value = createStoredValue('key');

    expect(value.read()).toBe('saved');
    expect(value.read()).toBe('saved');
    expect(storage.getItem).toHaveBeenCalledTimes(1);
  });

  it('writes, removes and tells the listeners', () => {
    const value = createStoredValue('key');
    const listener = vi.fn();
    value.subscribe(listener);

    expect(value.write('image')).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith('key', 'image');
    expect(value.write(null)).toBe(true);
    expect(storage.removeItem).toHaveBeenCalledWith('key');
    expect(value.read()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('reports when the browser refuses to keep the value', () => {
    storage.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(createStoredValue('key').write('big image')).toBe(false);
  });
});
