const { GuildMember, Guild } = require("discord.js");
const { updateUserLevel } = require("./levels/updateUserLevel");
const { levelUpsChannelId, sttChannelId } = require("../config.json");
const path = require("path");
const { calculateUserLevel } = require("./levels/calculateUserLevel");
const { runPhraseConfigAsync } = require("./config/runPhraseConfigAsync");

/**
 * Creates a callback function that accepts the parsed text from the User's audio.
 * The callback checks against the phrase config and alerts the channel if level ups happen
 * @param {GuildMember} member User that generated the text
 * @param {Guild} guild Used to send messages to channels
 * @returns {function(string):void} Function that accepts the user's speech to text
 */
function checkUserTextFromSpeechAsync(member, guild, wavFileLocation) {
  return async (text) => {
    if (!text) return;
    const sendMsg = guild.channels.cache.get(sttChannelId).send({
      content: `${member.displayName} said: "${text}"`,
      files: [wavFileLocation],
    });

    runPhraseConfigAsync(text)
      .then(flatten)
      .then(getPoints)
      .then(checkLevelUps(member.id))
      .then(alertChannel(guild, member));

    await sendMsg;
  };
}

module.exports = { checkUserTextFromSpeechAsync };

function flatten(results) {
  return results.flat();
}

function getPoints(matches) {
  return {
    matches,
    totalPointsByRole: calculateTotalPointsByRole(matches),
  };
}

function checkLevelUps(memberId) {
  return ({ matches, totalPointsByRole }) => {
    if (matches.length > 0) {
      return updateUserLevel(memberId, totalPointsByRole);
    }
  };
}

function alertChannel(guild, member) {
  return (levelUps) => {
    if (!!!levelUps?.length) return;
    guild.channels.cache.get(levelUpsChannelId).send({
      embeds: [
        {
          title: `${member.displayName} leveled up!`,
          description: `<@${member.id}> has leveled up:\n${levelUps.map(
            (levelUp) =>
              `${levelUp.role} Level: ${calculateUserLevel(levelUp.xp)} [${
                levelUp.xp
              }XP]\n`
          )}`,
        },
      ],
    });
  };
}

/**
 * Goes through the matches and groups them by role
 * @param {*} matches
 * @returns
 */
function calculateTotalPointsByRole(matches) {
  const totalPointsByRole = {};
  matches.forEach((m) => {
    if (totalPointsByRole[m.role]) totalPointsByRole[m.role] += m.points;
    else totalPointsByRole[m.role] = m.points;
  });
  return totalPointsByRole;
}
