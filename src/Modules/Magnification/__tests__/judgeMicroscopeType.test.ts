import { describe, it, expect } from 'vitest';
import {
  isUprightObjlensOption,
  isInvertedObjlensOption,
  isMicroscopeType,
  isSafeMTypeOLPair,
} from '@/Modules/Magnification/judgeMicroscopeType';

describe('judgeMicroscopeType のユーティリティ', () => {
  it('upright の対物レンズオプションを判定できること', () => {
    expect(isUprightObjlensOption('x40')).toBe(true);
    expect(isUprightObjlensOption('x100')).toBe(true);
  });

  it('inverted の対物レンズオプションを判定できること', () => {
    expect(isInvertedObjlensOption('x100')).toBe(true);
    expect(isInvertedObjlensOption('x40')).toBe(false);
  });

  it('顕微鏡タイプを判定できること', () => {
    expect(isMicroscopeType('upright')).toBe(true);
    expect(isMicroscopeType('inverted')).toBe(true);
    expect(isMicroscopeType('foo')).toBe(false);
  });

  it('顕微鏡タイプと対物レンズの組が有効か検証できること', () => {
    expect(isSafeMTypeOLPair({ microscopeType: 'upright', objLens: 'x40' })).toBe(true);
    expect(isSafeMTypeOLPair({ microscopeType: 'inverted', objLens: 'x40' })).toBe(false);
  });
});
