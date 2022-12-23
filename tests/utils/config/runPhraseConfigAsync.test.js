const {
  runPhraseConfigAsync,
  runWithPhraseConfigAsync,
} = require("../../../utils/config/runPhraseConfigAsync");

describe("runPhraseConfigAsync", () => {
  test("Using phrase.config.json", async () => {
    const results = await runPhraseConfigAsync("That's right, boy");
    console.log(JSON.stringify(results.flat()));
  });

  test("Using phrase config", async () => {
    const phraseConfig = [
      { phrase: "Test phrase", points: 50, role: "TestRole" },
    ];
    let results = await runWithPhraseConfigAsync("Test phrase", phraseConfig);
    results = results.flat();
    expect(results).toHaveLength(1);
    expect(results[0].match).toHaveLength(1);
    expect(results[0].match[0]).toEqual("Test phrase");

    expect(results[0].points).toBe(50);
    expect(results[0].role).toBe("TestRole");
  });
});
