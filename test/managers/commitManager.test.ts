import { createCommitManager } from "../../src/managers/commitManager";

describe("createCommitManager function", () => {
  it("can make commit manager object", () => {
    expect(createCommitManager({})).toBeInstanceOf(Object);
  });

  it("has specific keys", () => {
    const keys = Object.keys(createCommitManager({})).sort();
    const answer_keys = [
      "commit",
      "revertLog",
      "getCurrentState",
      "getLogs"
    ].sort();

    expect(keys).toEqual(answer_keys);
  });
});

describe("commit manager object", () => {
  const init = { name: "John", age: 30 };
  let commitMg = createCommitManager(init);

  beforeEach(() => {
    commitMg = createCommitManager(init);
  });

  describe("getLogs", () => {
    it("can get commit logs", () => {
      const logs = commitMg.getLogs();
      commitMg.commit({ name: "Hoge" }, "Hello");
      const logs2 = commitMg.getLogs();

      expect(logs).toBeInstanceOf(Array);
      expect(logs).toHaveLength(0);
      expect(logs2).not.toBe(logs);
      expect(logs2).toHaveLength(1);
      expect(logs2[0]).toEqual({
        id: expect.anything(),
        comment: "Hello",
        log: { ex: { name: "John" }, diff: { name: "Hoge" } },
        created_at: expect.anything()
      });
    });
  });

  describe("commit function", () => {
    it("can update logs", () => {
      commitMg.commit({ name: "Hoge" }, "Hello");
      const logs = commitMg.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].comment).toBe("Hello");
      expect(logs[0].log).toEqual({
        ex: { name: "John" },
        diff: { name: "Hoge" }
      });
    });
  });

  describe("revertLog function", () => {
    it("can revert previous log", () => {
      commitMg.commit({ name: "Hoge" }, "Hello");
      commitMg.commit({ name: "Hogu" }, "World!");
      commitMg.revertLog();
      const logs = commitMg.getLogs();

      expect(logs).toHaveLength(1);
      expect(logs[0].comment).toBe("Hello");
      expect(logs[0].log.diff).toEqual({ name: "Hoge" });
    });
  });

  describe("getCurrentState", () => {
    it("can get current state value", () => {
      const state = commitMg.getCurrentState();
      commitMg.commit({ name: "Hoge" }, "");
      const state2 = commitMg.getCurrentState();

      expect(state).toEqual(init);
      expect(state2).toEqual({ ...init, name: "Hoge" });
      expect(state).not.toBe(state2);
    });
  });
});
