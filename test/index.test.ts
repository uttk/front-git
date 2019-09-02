import { createGit } from "../src/index";
import { FrontGit } from "../src/types";

const create = (v: any): any => v;

describe("createGit function", () => {
  it("can create git object", () => {
    expect(createGit({})).toBeInstanceOf(Object);
  });

  it("throw an error when arguments is invalid value", () => {
    expect(() => createGit(create([]))).toThrow();
    expect(() => createGit(create(() => {}))).toThrow();
    expect(() => createGit(create(1))).toThrow();
    expect(() => createGit(create(""))).toThrow();
    expect(() => createGit(create(new RegExp("")))).toThrow();
    expect(() => createGit(create(true))).toThrow();
  });
});

describe("git object test", () => {
  const init = { name: "John", age: 30, male: true };
  type StateType = typeof init;
  let git: FrontGit<StateType>;

  beforeEach(() => {
    git = createGit(init);
  });

  it("has specific keys", () => {
    const keys = Object.keys(git).sort();
    const answer_keys = [
      "add",
      "commit",
      "pull",
      "push",
      "remote",
      "getLogs",
      "getIndex",
      "getState",
      "revertLog",
      "subscribe",
      "clearIndex",
      "getCurrentState"
    ].sort();

    expect(keys).toEqual(answer_keys);
  });

  describe("add function", () => {
    it("can update index value", () => {
      const updateValue: Partial<StateType> = { name: "Hello" };

      git.add(updateValue);

      expect(git.getIndex()).toEqual(updateValue);
      expect(git.getState()).toEqual(init);
    });

    it("thorw error when arguments is invalid value", () => {
      expect(() => git.add(create(null))).toThrow();
      expect(() => git.add(create(false))).toThrow();
      expect(() => git.add(create(Function))).toThrow();
      expect(() => git.add(create(1))).toThrow();
      expect(() => git.add(create(""))).toThrow();
    });
  });

  describe("commit function", () => {
    it("can update commit log and state value", () => {
      const beforeLogs = git.getLogs();

      expect(beforeLogs).toHaveLength(0);

      git.add({ name: "Hello" });
      git.commit("first commit");

      const updated_logs = git.getLogs();

      expect(updated_logs).toHaveLength(1);
      expect(updated_logs[0]).toEqual({
        id: expect.anything(),
        comment: "first commit",
        log: {
          ex: { name: "John" },
          diff: { name: "Hello" }
        },
        created_at: expect.anything()
      });
    });

    it("throw error when there is nothing to change", () => {
      expect(() => git.commit()).toThrow();
    });
  });

  describe("getLogs function", () => {
    it("can get commit logs", () => {
      expect(git.getLogs()).toHaveLength(0);
    });
  });

  describe("getIndex function", () => {
    it("can get index value and frist default value is null", () => {
      expect(git.getIndex()).toBeNull();
    });
  });

  describe("getState function", () => {
    it("can get initialize value", () => {
      expect(git.getState()).toEqual(init);
    });
  });

  describe("getCurrentState function", () => {
    it("can get the value of state including index value", () => {
      const state = git.getCurrentState();

      git.add({ name: "Hoge" });

      const state2 = git.getCurrentState();

      expect(state).toEqual(init);
      expect(state2).toEqual({ ...init, name: "Hoge" });
    });
  });

  describe("clearIndex function", () => {
    it("can be null to index value", () => {
      git.add({ name: "Hoge" });
      git.clearIndex();

      expect(git.getIndex()).toBeNull();
    });
  });

  describe("subscribe function", () => {
    it("notifies the execution of the add function", () => {
      const mockCallback = jest.fn();

      git.subscribe("add", mockCallback);
      git.add({ name: "hoge" });
      git.add({ age: 1 });

      expect(mockCallback.mock.calls).toHaveLength(2);
    });

    it("notifies the execution of the commit function", () => {
      const mockCallback = jest.fn();

      git.subscribe("commit", mockCallback);
      git.add({ name: "hoge" });
      git.commit("Hello, World!");

      expect(mockCallback).toBeCalled();
    });
  });

  describe("revertLog function", () => {
    it("can revert to previous log", () => {
      git.add({ name: "hoge" });
      git.commit();
      git.add({ age: 1000 });
      git.commit();
      git.revertLog();

      expect(git.getLogs()).toHaveLength(1);
      expect(git.getState()).toEqual({ ...init, name: "hoge" });
    });
  });

  describe("remote object", () => {
    it("has specific keys", () => {
      const keys = Object.keys(git.remote).sort();
      const answerKeys = ["set"].sort();

      expect(keys).toEqual(answerKeys);
    });

    describe("set function", () => {
      it("can set push and pull callbacks", () => {
        const push_cb = jest.fn();
        const pull_cb = jest.fn();

        git.remote.set("origin", { push: push_cb, pull: pull_cb });
        git.push("origin");
        git.pull("origin");

        expect(push_cb).toBeCalled();
        expect(pull_cb).toBeCalled();
      });
    });
  });

  describe("push function", () => {
    it("can execute the push callback", () => {
      const push_cb = jest.fn();
      const pull_cb = jest.fn();

      git.remote.set("origin", { push: push_cb, pull: pull_cb });
      git.push("origin");

      expect(push_cb).toBeCalled();
      expect(pull_cb).not.toBeCalled();
    });

    it("throw an error when trying to execute an unregistered push callback", () => {
      expect(() => git.push("unknown")).toThrow();
    });
  });

  describe("pull function", () => {
    it("can execute the pull callback", () => {
      const push_cb = jest.fn();
      const pull_cb = jest.fn();

      git.remote.set("origin", { push: push_cb, pull: pull_cb });
      git.pull("origin");

      expect(() => git.pull("bad")).toThrow();
      expect(pull_cb).toBeCalled();
      expect(push_cb).not.toBeCalled();
    });

    it("throw an error when trying to execute an unregistered pull callback", () => {
      expect(() => git.pull("unknown")).toThrow();
    });

    it("throw an error when pass invalid value to the callback", () => {
      const push_cb = jest.fn();
      const pull_cb = jest.fn(cb => cb());

      git.remote.set("origin", { push: push_cb, pull: pull_cb });

      expect(() => git.pull("origin")).toThrow();
    });

    it("update commit logs when the callback execute", () => {
      const push_cb = jest.fn();
      const pull_cb = jest.fn(cb => cb({ name: "Hello" }));
      const before_logs = git.getLogs();

      git.remote.set("origin", { push: push_cb, pull: pull_cb });
      git.pull("origin");

      const updated_logs = git.getLogs();

      expect(before_logs).toHaveLength(0);
      expect(updated_logs).toHaveLength(1);
      expect(updated_logs[0].log.diff).toEqual({ name: "Hello" });
    });
  });
});
