type CallbackType = () => void;

interface SubscribeManagerType {
  subscribe: (event: string, cb: CallbackType) => void;
  unsubscribe: (event: string, cb: CallbackType) => void;
  execute: (event: string) => void;
}

export const createSubScribeManager = (): SubscribeManagerType => {
  const callbacks: Map<string, Set<CallbackType>> = new Map();

  return {
    subscribe: (event, cb) => {
      const list = callbacks.get(event) || new Set();

      callbacks.set(event, list.add(cb));
    },

    unsubscribe: (event, cb) => {
      const list = callbacks.get(event) || new Set();

      list.delete(cb);
      callbacks.set(event, list);
    },

    execute: event => {
      const list = callbacks.get(event);

      if (list) {
        list.forEach(cb => cb());
      }
    }
  };
};
