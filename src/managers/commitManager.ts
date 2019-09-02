import { createUniqueId, isState } from "../util";
import { FrontGitCommitLog } from "../types";

interface CommitManagerType<T> {
  commit: (diff: Partial<T> | null, comment: string) => void;
  revertLog: () => void;
  getCurrentState: () => T;
  getLogs: () => FrontGitCommitLog<T>[];
}

const createCommitLog = <T extends object>(
  before: T,
  diff: Partial<T>,
  comment: string
): FrontGitCommitLog<T> => {
  const keys = Object.keys(diff) as Array<keyof T>;
  const ex = keys.reduce<Partial<T>>((v, k) => ({ ...v, [k]: before[k] }), {});

  return {
    id: createUniqueId(),
    comment: `${comment}`,
    log: { ex, diff: { ...diff } },
    created_at: new Date()
  };
};

export const createCommitManager = <T extends object>(
  initState: T
): CommitManagerType<T> => {
  const baseState: T = { ...initState };
  const logs: Set<FrontGitCommitLog<T>> = new Set();

  const Mg: CommitManagerType<T> = {
    commit: (diff, comment) => {
      if (isState<T>(diff)) {
        const log = createCommitLog(Mg.getCurrentState(), diff, comment);

        logs.add(log);

        return;
      }

      throw new Error("Commit cannot be done without any change.");
    },

    revertLog: () => {
      const last = [...logs].slice(-1);
      return logs.delete(last[0]);
    },

    getCurrentState: () => {
      return [...logs].reduce(
        (current, { log }) => ({ ...current, ...log.diff }),
        baseState
      );
    },

    getLogs: () => {
      return [...logs].map(v => ({ ...v }));
    }
  };

  return Mg;
};
