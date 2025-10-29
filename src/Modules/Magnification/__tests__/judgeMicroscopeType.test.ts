import { describe, it, expect } from 'vitest';
import {
  isUprightObjlensOption,
  isInvertedObjlensOption,
  isMicroscopeType,
  isSafeMTypeOLPair,
} from '@/Modules/Magnification/judgeMicroscopeType';

describe('judgeMicroscopeType utils', () => {
  it('detects upright objlens options', () => {
    expect(isUprightObjlensOption('x40')).toBe(true);
    expect(isUprightObjlensOption('x100')).toBe(true);
  });

  it('detects inverted objlens options', () => {
    expect(isInvertedObjlensOption('x100')).toBe(true);
    expect(isInvertedObjlensOption('x40')).toBe(false);
  });

  it('detects microscope type', () => {
    expect(isMicroscopeType('upright')).toBe(true);
    expect(isMicroscopeType('inverted')).toBe(true);
    expect(isMicroscopeType('foo')).toBe(false);
  });

  it('validates safe microscope/objlens pair', () => {
    expect(isSafeMTypeOLPair({ microscopeType: 'upright', objLens: 'x40' })).toBe(true);
    expect(isSafeMTypeOLPair({ microscopeType: 'inverted', objLens: 'x40' })).toBe(false);
  });
});
