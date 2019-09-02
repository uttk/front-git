import { createRemoteManager } from "../../src/managers/remoteManager";

describe("createRemoteManager", () => {
  it("can make remote manager object", () => {
    expect(createRemoteManager()).toBeInstanceOf(Object);
  });
});

describe("remote manager object", () => {
  let remoteMg = createRemoteManager();

  beforeEach(() => {
    remoteMg = createRemoteManager();
  });

  it("has specific keys", () => {
    const keys = Object.keys(remoteMg).sort();
    const answer_keys = ["push", "pull", "setPush", "setPull"].sort();

    expect(keys).toEqual(answer_keys);
  });

  describe("setPush function", () => {
    it("can save push callback", () => {
      const push_cb = jest.fn();
      const done_cb = () => {};

      remoteMg.setPush("remote", push_cb);
      remoteMg.push("remote", done_cb);

      expect(push_cb.mock.calls).toHaveLength(1);
      expect(push_cb.mock.calls[0][0]).toBe(done_cb);
    });

    it("throws an error when trying to set the same remote push function", () => {
      const push_cb = () => {};

      remoteMg.setPush("remote", push_cb);

      expect(() => remoteMg.setPush("remote", push_cb)).toThrow();
    });
  });

  describe("setPull function", () => {
    it("can save push callback", () => {
      const pull_cb = jest.fn();
      const done_cb = () => {};

      remoteMg.setPull("remote", pull_cb);
      remoteMg.pull("remote", done_cb);

      expect(pull_cb.mock.calls).toHaveLength(1);
      expect(pull_cb.mock.calls[0][0]).toBe(done_cb);
    });

    it("throws an error when trying to set the same remote pull function", () => {
      const pull_cb = () => {};

      remoteMg.setPull("remote", pull_cb);

      expect(() => remoteMg.setPull("remote", pull_cb)).toThrow();
    });
  });

  describe("push function", () => {
    it("can execute the function that set with setPush function", () => {
      const push_cb = jest.fn();

      remoteMg.setPush("remote", push_cb);
      remoteMg.push("remote", () => {});

      expect(push_cb.mock.calls).toHaveLength(1);
    });

    it("throws an error when not set the push callback", () => {
      expect(() => remoteMg.push("remote", () => {})).toThrow();
    });
  });

  describe("pull function", () => {
    it("can execute the function that set with setPull function", () => {
      const pull_cb = jest.fn();

      remoteMg.setPull("remote", pull_cb);
      remoteMg.pull("remote", () => {});

      expect(pull_cb.mock.calls).toHaveLength(1);
    });

    it("throws an error when not set the pull callback", () => {
      expect(() => remoteMg.pull("remote", () => {})).toThrow();
    });
  });
});
