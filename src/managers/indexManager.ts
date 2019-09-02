import { createTypeString } from "../util";

interface IndexManager<T extends object> {
  get: () => Partial<T> | null;
  set: (value: Partial<T>) => void;
  clear: () => void;
}

export const createIndexManager = <T extends object>(): IndexManager<T> => {
  let currentIndex: Partial<T> | null = null;

  return {
    get: () => {
      return currentIndex ? { ...currentIndex } : null;
    },

    set: value => {
      if (value && createTypeString(value) === "[object Object]") {
        currentIndex = { ...currentIndex, ...value };
        return;
      }

      throw new Error("Arguments is invalid value");
    },

    clear: () => {
      currentIndex = null;
    }
  };
};
