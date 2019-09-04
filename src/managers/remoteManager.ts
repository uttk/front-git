interface RemoteManagerType<T> {
  push: (remote_name: string, cb: () => void) => void;
  pull: (remote_name: string, cb: (result: Partial<T>) => void) => void;
  setPush: (
    remote_name: string,
    push_callback: (done: () => void) => void
  ) => void;
  setPull: (
    remote_name: string,
    pull_callback: (done: (result: Partial<T>) => void) => void
  ) => void;
}

export const createRemoteManager = <T extends object>(): RemoteManagerType<
  T
> => {
  const pushCallbacks: Map<string, (done: () => void) => void> = new Map();
  const pullCallbacks: Map<
    string,
    (done: (result: Partial<T>) => void) => void
  > = new Map();

  return {
    push: (remote_name, cb) => {
      const push = pushCallbacks.get(remote_name);

      if (push) return push(cb);

      throw new Error("The push function is not implemented");
    },

    pull: (remote_name, cb) => {
      const pull = pullCallbacks.get(remote_name);

      if (pull) return pull(cb);

      throw new Error("The pull function is not implemented");
    },

    setPush: (remote_name, cb) => {
      if (!pushCallbacks.has(remote_name)) {
        pushCallbacks.set(remote_name, cb);
        return;
      }

      throw new Error("The remote already has a push function");
    },

    setPull: (remote_name, cb) => {
      if (!pullCallbacks.has(remote_name)) {
        pullCallbacks.set(remote_name, cb);
        return;
      }

      throw new Error("The remote already has a pull function");
    }
  };
};
