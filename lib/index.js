'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createTypeString = (value) => {
    return Object.prototype.toString.call(value);
};
const createUniqueId = () => {
    return (Date.now().toString(16) +
        Math.random()
            .toString(16)
            .slice(2));
};
const isState = (state) => {
    return state && createTypeString(state) === "[object Object]";
};

const createCommitLog = (before, diff, comment) => {
    const keys = Object.keys(diff);
    const ex = keys.reduce((v, k) => (Object.assign({}, v, { [k]: before[k] })), {});
    return {
        id: createUniqueId(),
        comment: `${comment}`,
        log: { ex, diff: Object.assign({}, diff) },
        created_at: new Date()
    };
};
const createCommitManager = (initState) => {
    const baseState = Object.assign({}, initState);
    const logs = new Set();
    const Mg = {
        commit: (diff, comment) => {
            if (isState(diff)) {
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
            return [...logs].reduce((current, { log }) => (Object.assign({}, current, log.diff)), baseState);
        },
        getLogs: () => {
            return [...logs].map(v => (Object.assign({}, v)));
        }
    };
    return Mg;
};

const createSubScribeManager = () => {
    const callbacks = new Map();
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

const createIndexManager = () => {
    let currentIndex = null;
    return {
        get: () => {
            return currentIndex ? Object.assign({}, currentIndex) : null;
        },
        set: value => {
            if (value && createTypeString(value) === "[object Object]") {
                currentIndex = Object.assign({}, currentIndex, value);
                return;
            }
            throw new Error("Arguments is invalid value");
        },
        clear: () => {
            currentIndex = null;
        }
    };
};

const createRemoteManager = () => {
    const pushCallbacks = new Map();
    const pullCallbacks = new Map();
    return {
        push: (remote_name, cb) => {
            const push = pushCallbacks.get(remote_name);
            if (push)
                return push(cb);
            throw new Error("The push function is not implemented");
        },
        pull: (remote_name, cb) => {
            const pull = pullCallbacks.get(remote_name);
            if (pull)
                return pull(cb);
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

const createGit = (initState) => {
    if (!isState(initState)) {
        throw new Error("The initialization value must be an object");
    }
    const indexMg = createIndexManager();
    const commitMg = createCommitManager(initState);
    const subscribeMg = createSubScribeManager();
    const remoteMg = createRemoteManager();
    const git = {
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
            return Object.assign({}, state, index);
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

exports.createGit = createGit;
