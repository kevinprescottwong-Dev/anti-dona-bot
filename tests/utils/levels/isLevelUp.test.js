const { isLevelUp } = require("../../../utils/levels/isLevelUp");

describe("isLevelUp", () => {
  const testCases = [
    [0, 0, false],
    [0, 499, false],
    [0, 500, true],
    [0, 501, true],
    [499, 0, false],
    [499, 1, true],
    [499, 500, true],
    [500, 0, false],
    [500, 1, false],
    [500, 499, false],
    [500, 500, true],
  ];

  test.each(testCases)(
    "Given current User XP is %p and user gains %p XP, then isLevelUp should be %p",
    (currLevel, xp, expected) => {
      expect(isLevelUp(currLevel, xp)).toBe(expected);
    }
  );
});
