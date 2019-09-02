import { createIndexManager } from "../../src/managers/indexManager";

describe("createIndexManager function", () => {
  it("can make index manager object", () => {
    expect(createIndexManager()).toBeInstanceOf(Object);
  });

  it("has specific keys", () => {
    const keys = Object.keys(createIndexManager()).sort();
    const answer_keys = ["get", "set", "clear"].sort();

    expect(keys).toEqual(answer_keys);
  });
});

describe("index manager object", () => {
  let indexMg = createIndexManager();

  beforeEach(() => {
    indexMg = createIndexManager();
  });

  describe("get function", () => {
    it("can get index value", () => {
      const index = indexMg.get();
      indexMg.set({ hello: "world" });
      const index2 = indexMg.get();

      expect(index).toBeNull();
      expect(index2).toEqual({ hello: "world" });
    });
  });

  describe("set function", () => {
    it("can update index value", () => {
      indexMg.set({ hello: "world" });
      const index = indexMg.get();

      indexMg.set({ hoge: "hogu" });
      const index2 = indexMg.get();

      expect(index).toEqual({ hello: "world" });
      expect(index2).toEqual({ hello: "world", hoge: "hogu" });
      expect(index).not.toBe(index2);
    });
  });

  describe("clear function", () => {
    it("can null the value of index", () => {
      indexMg.set({ hello: "world" });
      const index = indexMg.get();
      indexMg.clear();
      const index2 = indexMg.get();

      expect(index).toEqual({ hello: "world" });
      expect(index2).toBeNull();
    });
  });
});
