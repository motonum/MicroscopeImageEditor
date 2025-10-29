import { describe, it, expect } from 'vitest';
import { getDPMConfig } from '@/Modules/Magnification/getDPMConfig';
import { DPM_CONFIG } from '@/constant/config';

describe('getDPMConfig', () => {
  it('returns upright config when upright requested', () => {
    const v = getDPMConfig('upright', 'x100');
    expect(v).toBe(DPM_CONFIG.upright.x100);
  });

  it('returns inverted config when inverted requested', () => {
    const v = getDPMConfig('inverted', 'x200');
    expect(v).toBe(DPM_CONFIG.inverted.x200);
  });

  it('falls back to upright config when pair mismatched', () => {
    // request inverted but with x40 (only upright): should return upright x40
    const v = getDPMConfig('inverted', 'x40' as any);
    expect(v).toBe(DPM_CONFIG.upright.x40);
  });
});
