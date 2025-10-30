import { describe, it, expect } from 'vitest';
import { updateObject } from '@/util/updateObject';

describe('updateObject のテスト', () => {
  it('部分更新をマージして新しいオブジェクトを返し、元のオブジェクトは変更されないこと', () => {
    const base = { a: 1, b: 2 };
    const updated = updateObject(base, { b: 3 });
    expect(updated).toEqual({ a: 1, b: 3 });
    // original unchanged
    expect(base).toEqual({ a: 1, b: 2 });
  });
});
