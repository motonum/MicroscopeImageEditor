import { describe, it, expect } from 'vitest';
import { getDPMConfig } from '@/Modules/Magnification/getDPMConfig';
import { DPM_CONFIG } from '@/constant/config';

describe('getDPMConfig のテスト', () => {
  it('upright 指定時に upright の DPM 値を返すこと', () => {
    const v = getDPMConfig('upright', 'x100');
    expect(v).toBe(DPM_CONFIG.upright.x100);
  });

  it('inverted 指定時に inverted の DPM 値を返すこと', () => {
    const v = getDPMConfig('inverted', 'x200');
    expect(v).toBe(DPM_CONFIG.inverted.x200);
  });

  it('不一致ペアの場合に upright の値へフォールバックすること', () => {
    const v = getDPMConfig('inverted', 'x40' as any);
    expect(v).toBe(DPM_CONFIG.upright.x40);
  });
});
