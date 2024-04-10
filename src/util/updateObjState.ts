import { SetStateAction } from "jotai";

export const updateObjState =
  <T, K extends keyof T>(key: K, value: T[K]): SetStateAction<T> =>
  (prev: T) => {
    return { ...prev, [key]: value };
  };
