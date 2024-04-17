export const updateObject = <T>(object: T, updateItem: Partial<T>): T => ({
  ...object,
  ...updateItem,
});
