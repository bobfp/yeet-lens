import * as L from "../src/index.js";

describe("root", () => {
  const atomState = "cat";
  test("root getter", () => {
    expect(L.rootGetter(atomState)).toBe("cat");
  });
  test("root setter with value", () => {
    expect(L.rootSetter("dog", atomState)).toBe("dog");
  });
  test("root setter with function", () => {
    expect(L.rootSetter(state => state + "s", atomState)).toBe("cats");
  });
});

describe("array", () => {
  const atomState = [1, 2, 3];
  test("array getter", () => {
    expect(L.indexGetter(1)(atomState)).toBe(2);
  });
  test("array setter with value", () => {
    expect(L.indexSetter(1, "dog", atomState)).toEqual([1, "dog", 3]);
  });
  test("root setter with function", () => {
    expect(L.indexSetter(1, state => state + 1, atomState)).toEqual([1, 3, 3]);
  });
});

describe("object", () => {
  const atomState = { a: 1 };
  test("prop getter", () => {
    expect(L.propGetter("a")(atomState)).toBe(1);
  });
  test("key setter with value", () => {
    expect(L.propSetter("a", 3, atomState)).toEqual({ a: 3 });
  });
  test("key setter with function", () => {
    expect(L.propSetter("a", state => state + 1, atomState)).toEqual({ a: 2 });
  });
});
describe("complex", () => {
  const atomState = { a: 1, b: [{ c: "cat" }] };
  test("pathGetter", () => {
    expect(L.pathGetter("b[0].c")(atomState)).toEqual("cat");
  });
  test("path setter with value", () => {
    const expectedState = { a: 1, b: [{ c: "dog" }] };
    expect(L.pathSetter("b[0].c", "dog", atomState)).toEqual(expectedState);
  });
  test("path setter with function", () => {
    const expectedState = { a: 1, b: [{ c: "cats" }] };
    expect(L.pathSetter("b[0].c", animal => animal + "s", atomState)).toEqual(
      expectedState
    );
  });
  test("compose getter", () => {
    const aGetter = L.propGetter("a");
    const bGetter = L.propGetter("b");
    const headGetter = L.indexGetter(0);
    const cGetter = L.propGetter("c");
    const composedGetter = L.composeGetter(
      aGetter,
      bGetter,
      headGetter,
      cGetter
    );
    expect(composedGetter(atomState)).toEqual("cat");
  });
});
