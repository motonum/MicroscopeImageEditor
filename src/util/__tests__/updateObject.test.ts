import { describe, it, expect } from 'vitest';
import { updateObject } from '@/util/updateObject';

describe('updateObject', () => {
  it('merges partial updates into object immutably', () => {
    const base = { a: 1, b: 2 };
    const updated = updateObject(base, { b: 3 });
    expect(updated).toEqual({ a: 1, b: 3 });
    // original unchanged
    expect(base).toEqual({ a: 1, b: 2 });
  });
});
