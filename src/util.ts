export const createTypeString = (value: any): string => {
  return Object.prototype.toString.call(value);
};

export const createUniqueId = (): string => {
  return (
    Date.now().toString(16) +
    Math.random()
      .toString(16)
      .slice(2)
  );
};

export const isState = <T>(state: any): state is Partial<T> => {
  return state && createTypeString(state) === "[object Object]";
};
