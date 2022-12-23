const phraseConfig = require("../../phrase.config.json");

/**
 * Checks the text against the phrase config
 * @param {string} text Text to check against the phrase config
 * @returns {Promise<{match: RegExpExecArray, points: number, role: string}[]>}
 */
function runPhraseConfigAsync(text) {
  // Test all regex from config asynchronously
  return Promise.all(
    phraseConfig.map((phrase) => {
      const rgx = new RegExp(phrase.phraseRegex ?? phrase.phrase, "gi");

      return new Promise((resolve) => {
        const result = [];

        let match = rgx.exec(text);

        // ensure all matches in 'text' are found
        while (match) {
          result.push({
            match,
            points: phrase.points,
            role: phrase.role,
          });

          match = rgx.exec(text);
        }

        resolve(result);
      });
    })
  );
}

/**
 * Checks the text against the phrase config
 * @param {*} text  Text to check against the phrase config
 * @param {*} phraseConfig Phrase Config
 * @returns {Promise<{match: RegExpExecArray, points: number, role: string}[]>}
 */
function runWithPhraseConfigAsync(text, phraseConfig) {
  // Test all regex from config asynchronously
  return Promise.all(
    phraseConfig.map((phrase) => {
      const rgx = new RegExp(phrase.phraseRegex ?? phrase.phrase, "gi");

      return new Promise((resolve) => {
        const result = [];

        let match = rgx.exec(text);

        // ensure all matches in 'text' are found
        while (match) {
          result.push({
            match,
            points: phrase.points,
            role: phrase.role,
          });

          match = rgx.exec(text);
        }

        resolve(result);
      });
    })
  );
}

module.exports = { runPhraseConfigAsync, runWithPhraseConfigAsync };
