const { getUserLevel } = require("./getUserLevel");
const { GuildMember } = require("discord.js");
const { createUserLevel } = require("./createUserLevel");
const { updateUserLevel } = require("./updateUserLevel");

/**
 *
 * @param {GuildMember} member
 * @param {any} banConfig
 * @returns
 */
function checkUserTextFromSpeechAsync(member, banConfig) {
  const bannedPhrases = ["that's right, boy", "big sheesh", "hey, daddy"];
  return (text) => {
    console.log("Starting checkUserTextFromSpeech...");
    if (!text) return;

    const pa = Promise.all(
      banConfig.map((bc) => {
        const rgx = new RegExp(bc.phraseRegex ?? bc.phrase, "gi");
        return new Promise((resolve) => {
          console.log({ banConfigItem: bc });

          const result = [];

          let match = rgx.exec(text);
          while (match) {
            result.push({
              match,
              points: bc.points,
              role: bc.pointsForRole,
            });

            match = rgx.exec(text);
          }
          resolve(result);
        });
      })
    );
    pa.then((res) => {
      console.log({ res });

      const matches = res.flat();
      console.log(JSON.stringify(matches));

      const totalPointsByRole = {};
      matches.forEach((m) => {
        if (totalPointsByRole[m.role]) totalPointsByRole[m.role] += m.points;
        else totalPointsByRole[m.role] = m.points;
      });

      console.log({ user: member.displayName, matches, totalPointsByRole });
      if (matches.length > 0) {
        // update file with new totals
        updateUserLevel(member.id, totalPointsByRole);
        //// alert channel
      }
    });

    if (bannedPhrases.some((bp) => text.toLowerCase().includes(bp))) {
      console.log("DONA INFLUENCE FOUND... KICKING FROM VC");

      // member.voice.setChannel(null);
    }
  };
}

module.exports = { checkUserTextFromSpeechAsync };
