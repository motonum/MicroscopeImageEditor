import { describe, it, expect } from 'vitest';
import { inferMagnification } from '@/Modules/Magnification/inferMagnification';

describe('inferMagnification', () => {
  it('parses x100 from various filename formats', () => {
    const a = inferMagnification('sample_x100.png', { height: 1000, width: 1000 });
    expect(a.objLens).toBe('x100');

    const b = inferMagnification('sample100x.png', { height: 1000, width: 1000 });
    expect(b.objLens).toBe('x100');

    const c = inferMagnification('sample100倍.png', { height: 1000, width: 1000 });
    expect(c.objLens).toBe('x100');
  });

  it('defaults to x200 if parsed objLens does not match microscope type', () => {
    // name contains x40 but dimensions suggest inverted -> mismatch
    const res = inferMagnification('image_x40.jpg', { height: 1460, width: 1938 });
    expect(res.microscopeType).toBe('inverted');
    // since x40 is not valid for inverted, it should fallback to x200
    expect(res.objLens).toBe('x200');
  });

  it('infers inverted from nearly-equal special resolution', () => {
    const res = inferMagnification('no_mag.jpg', { height: 1460, width: 1938 });
    expect(res.microscopeType).toBe('inverted');
  });

  it('returns upright for other sizes', () => {
    const res = inferMagnification('no_mag.jpg', { height: 1000, width: 1000 });
    expect(res.microscopeType).toBe('upright');
  });
});
