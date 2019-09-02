import { FrontGit } from "./types";
import { isState } from "./util";
import { createCommitManager } from "./managers/commitManager";
import { createSubScribeManager } from "./managers/subscribeManager";
import { createIndexManager } from "./managers/indexManager";
import { createRemoteManager } from "./managers/remoteManager";

export const createGit = <T extends object>(initState: T): FrontGit<T> => {
  if (!isState(initState)) {
    throw new Error("The initialization value must be an object");
  }

  const indexMg = createIndexManager<T>();
  const commitMg = createCommitManager(initState);
  const subscribeMg = createSubScribeManager();
  const remoteMg = createRemoteManager<T>();

  const git: FrontGit<T> = {
    add: diff => {
      indexMg.set(diff);
      subscribeMg.execute("add");

      return git;
    },

    commit: (comment = "") => {
      commitMg.commit(indexMg.get(), comment);
      indexMg.clear();
      subscribeMg.execute("commit");

      return git;
    },

    push: remote_name => {
      remoteMg.push(remote_name, () => {
        subscribeMg.execute("push");
      });

      return git;
    },

    pull: remote_name => {
      remoteMg.pull(remote_name, result => {
        commitMg.commit(result, `pull from ${remote_name}`);
        subscribeMg.execute("pull");
      });

      return git;
    },

    getIndex: () => {
      return indexMg.get();
    },

    getState: () => {
      return commitMg.getCurrentState();
    },

    getCurrentState: () => {
      const index = indexMg.get();
      const state = commitMg.getCurrentState();

      return { ...state, ...index };
    },

    getLogs: () => {
      return commitMg.getLogs();
    },

    subscribe: (event, cb) => {
      subscribeMg.subscribe(event, cb);

      return () => subscribeMg.unsubscribe(event, cb);
    },

    clearIndex: () => {
      indexMg.clear();

      return git;
    },

    revertLog: () => {
      commitMg.revertLog();

      return git;
    },

    remote: {
      set: (remote_name, options) => {
        remoteMg.setPush(remote_name, options.push);
        remoteMg.setPull(remote_name, options.pull);

        return git;
      }
    }
  };

  return git;
};
