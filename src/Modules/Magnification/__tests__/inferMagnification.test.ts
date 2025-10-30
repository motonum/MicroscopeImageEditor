import { describe, it, expect } from 'vitest';
import { inferMagnification } from '@/Modules/Magnification/inferMagnification';

describe('inferMagnification のテスト', () => {
  it('ファイル名から x100 を解析できること', () => {
    const a = inferMagnification('sample_x100.png', { height: 1000, width: 1000 });
    expect(a.objLens).toBe('x100');

    const b = inferMagnification('sample100x.png', { height: 1000, width: 1000 });
    expect(b.objLens).toBe('x100');

    const c = inferMagnification('sample100倍.png', { height: 1000, width: 1000 });
    expect(c.objLens).toBe('x100');
  });

  it('解析した objLens が顕微鏡タイプと一致しない場合に x200 にフォールバックすること', () => {
    // name contains x40 but dimensions suggest inverted -> mismatch
    const res = inferMagnification('image_x40.jpg', { height: 1460, width: 1938 });
    expect(res.microscopeType).toBe('inverted');
    // since x40 is not valid for inverted, it should fallback to x200
    expect(res.objLens).toBe('x200');
  });

  it('特定の解像度で倒立型（inverted）を推定できること', () => {
    const res = inferMagnification('no_mag.jpg', { height: 1460, width: 1938 });
    expect(res.microscopeType).toBe('inverted');
  });

  it('その他のサイズでは upright を返すこと', () => {
    const res = inferMagnification('no_mag.jpg', { height: 1000, width: 1000 });
    expect(res.microscopeType).toBe('upright');
  });
});
