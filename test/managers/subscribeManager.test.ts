import { createSubScribeManager } from "../../src/managers/subscribeManager";

describe("createSubScribeManager function", () => {
  it("can make subscribe manager object", () => {
    expect(createSubScribeManager()).toBeInstanceOf(Object);
  });

  it("has specific keys", () => {
    const keys = Object.keys(createSubScribeManager()).sort();
    const answer_keys = ["subscribe", "unsubscribe", "execute"].sort();

    expect(keys).toEqual(answer_keys);
  });
});

describe("subscribe manager object", () => {
  let subscribeMg = createSubScribeManager();

  beforeEach(() => {
    subscribeMg = createSubScribeManager();
  });

  describe("subscribe function", () => {
    it("can save a function", () => {
      const cb = jest.fn();
      const cb2 = jest.fn();

      subscribeMg.subscribe("test", cb);
      subscribeMg.subscribe("test2", cb2);

      subscribeMg.execute("test");
      subscribeMg.execute("test");
      subscribeMg.execute("test2");

      expect(cb.mock.calls).toHaveLength(2);
      expect(cb2.mock.calls).toHaveLength(1);
    });

    it("can not save same a function", () => {
      const cb = jest.fn();

      subscribeMg.subscribe("test", cb);
      subscribeMg.subscribe("test", cb);

      subscribeMg.execute("test");

      expect(cb.mock.calls).toHaveLength(1);
    });
  });

  describe("unsubscribe function", () => {
    it("can delete function from callback list", () => {
      const cb = jest.fn();
      const cb2 = jest.fn();

      subscribeMg.subscribe("test", cb);
      subscribeMg.subscribe("test", cb2);

      subscribeMg.execute("test");

      subscribeMg.unsubscribe("test", cb);

      subscribeMg.execute("test");

      expect(cb.mock.calls).toHaveLength(1);
      expect(cb2.mock.calls).toHaveLength(2);
    });
  });

  describe("execute function", () => {
    it("can execute all callbacks", () => {
      const cb = jest.fn();
      const cb2 = jest.fn();

      subscribeMg.subscribe("test", cb);
      subscribeMg.subscribe("test", cb2);

      subscribeMg.execute("test");

      expect(cb.mock.calls).toHaveLength(1);
      expect(cb2.mock.calls).toHaveLength(1);
    });

    it("only executes callbacks for the passed event", () => {
      const cb = jest.fn();

      subscribeMg.subscribe("test", cb);

      subscribeMg.execute("test");
      subscribeMg.execute("test2");
      subscribeMg.execute("test3");

      expect(cb.mock.calls).toHaveLength(1);
    });
  });
});
