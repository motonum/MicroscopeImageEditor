import { describe, it, expect } from 'vitest';
import { getScalebarLength } from '@/Modules/Magnification/getScalebarLength';
import { DEFAULT_SCALEBAR_LENGTH } from '@/constant/config';

import type { MagnificationConfig } from '@/type/options';

describe('getScalebarLength', () => {
  const custom: MagnificationConfig<number> = {
    upright: { x40: 111, x100: 222, x200: 333, x400: 444, x500: 555 },
    inverted: { x100: 101, x200: 202, x400: 404 },
  };

  it('returns upright value when microscope type is upright and objlens is upright', () => {
    const v = getScalebarLength(custom, 'upright', 'x100');
    expect(v).toBe(222);
  });

  it('returns inverted value when microscope type is inverted and objlens is inverted', () => {
    const v = getScalebarLength(custom, 'inverted', 'x200');
    expect(v).toBe(202);
  });

  it('returns default upright value when pair is mismatched', () => {
    // mt inverted but ol is x40 (only upright). Should fall back to DEFAULT_SCALEBAR_LENGTH.upright.x40
    const v = getScalebarLength(custom, 'inverted', 'x40');
    expect(v).toBe(DEFAULT_SCALEBAR_LENGTH.upright.x40);
  });
});
