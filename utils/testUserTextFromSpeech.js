const { getUserLevel } = require("./getUserLevel");
const { GuildMember, Client, Guild } = require("discord.js");
const { createUserLevel } = require("./createUserLevel");
const { updateUserLevel } = require("./updateUserLevel");
const { levelUpsChannelId } = require("../config.json");

/**
 *
 * @param {GuildMember} member
 * @param {any} banConfig
 * @param {Guild} guild
 * @returns
 */
function checkUserTextFromSpeechAsync(member, banConfig, guild) {
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
        const levelUps = updateUserLevel(member.id, totalPointsByRole);
        //// alert channel
        if (levelUps.length > 0) {
          guild.channels.cache.get(levelUpsChannelId).send({
            embeds: [
              {
                title: `${member.displayName} leveled up!`,
                description: `<@${member.id}> has leveled up:\n${levelUps.map(
                  (lu) =>
                    `${lu.role} Level: ${Math.floor(lu.xp / 500)} [${
                      lu.xp
                    }XP]\n`
                )}`,
              },
            ],
          });
        }
      }
    });

    if (bannedPhrases.some((bp) => text.toLowerCase().includes(bp))) {
      console.log("DONA INFLUENCE FOUND... KICKING FROM VC");

      // member.voice.setChannel(null);
    }
  };
}

module.exports = { checkUserTextFromSpeechAsync };
