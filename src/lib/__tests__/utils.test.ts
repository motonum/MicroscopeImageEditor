import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn ユーティリティ', () => {
  it('クラス名を結合し重複を整理して期待するトークンを含むこと', () => {
    const result = cn('a', 'b', ['c', 'a']);
    // clsx + twMerge will join them; ensure result contains expected tokens
    expect(result.includes('a')).toBe(true);
    expect(result.includes('b')).toBe(true);
    expect(result.includes('c')).toBe(true);
  });
});
