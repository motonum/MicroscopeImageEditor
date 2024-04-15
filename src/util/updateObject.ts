export const updateObject = <T>(scalebar: T, updateItem: Partial<T>): T => ({
  ...scalebar,
  ...updateItem,
});
