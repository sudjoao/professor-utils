import { describe, expect, it } from 'vitest';

import { decodeText } from '@/lib/files/decodeText';

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

describe('decodeText', () => {
  it('reads UTF-8, dropping the byte order mark', () => {
    expect(decodeText(toArrayBuffer(new TextEncoder().encode('﻿João')))).toBe('João');
  });

  it('falls back to Windows-1252, used by Excel CSV files in Portuguese', () => {
    // "João" in Windows-1252: ã is the single byte 0xE3.
    expect(decodeText(toArrayBuffer(new Uint8Array([0x4a, 0x6f, 0xe3, 0x6f])))).toBe('João');
  });
});
