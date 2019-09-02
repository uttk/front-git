export type UnSubscribe = () => void;

export type SubscribeEventType = "add" | "commit" | "push" | "pull";

export interface FrontGitCommitLog<T> {
  id: string;
  comment: string;
  log: {
    ex: Partial<T>;
    diff: Partial<T>;
  };
  created_at: Date;
}

export interface FrontGit<T extends object> {
  add: (diff: Partial<T>) => FrontGit<T>;

  commit: (comment?: string) => FrontGit<T>;

  push: (remote_name: string) => FrontGit<T>;

  pull: (remote_name: string) => FrontGit<T>;

  getState: () => T;

  getIndex: () => Partial<T> | null;

  getLogs: () => FrontGitCommitLog<T>[];

  subscribe: (event: SubscribeEventType, cb: () => void) => UnSubscribe;

  clearIndex: () => FrontGit<T>;

  revertLog: () => FrontGit<T>;

  remote: {
    set: (
      remote_name: string,
      options: {
        pull: (done: (result: Partial<T>) => void) => void;
        push: (done: () => void) => void;
      }
    ) => FrontGit<T>;
  };
}

export declare const createGit: <T extends object>(initState: T) => FrontGit<T>;
