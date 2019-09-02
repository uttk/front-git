import { createTypeString, createUniqueId, isState } from "../src/util";

describe("toString function", () => {
  it("return string of type of argument", () => {
    expect(createTypeString({})).toBe("[object Object]");
    expect(createTypeString([])).toBe("[object Array]");
    expect(createTypeString(() => {})).toBe("[object Function]");
    expect(createTypeString(1)).toBe("[object Number]");
    expect(createTypeString("")).toBe("[object String]");
    expect(createTypeString(null)).toBe("[object Null]");
  });
});

describe("createUniqueId", () => {
  it("can create unique id string", () => {
    const ids = new Array(1000).fill("").map(v => createUniqueId());
    const len = ids.length;
    const uniqueList = ids.filter((v, i) => ids.indexOf(v) === i);

    expect(uniqueList.length).toBe(len);
  });
});

describe("isState function", () => {
  it("return true when object value", () => {
    expect(isState({})).toBeTruthy();
    expect(isState("")).toBeFalsy();
    expect(isState(1)).toBeFalsy();
    expect(isState([])).toBeFalsy();
    expect(isState(() => {})).toBeFalsy();
  });
});
