const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("levels")
  .setDescription("Display everyone's levels");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async function execute(interaction) {
  const levelsDir = path.resolve("./levels");
  const levelsByRole = {};
  const result = await Promise.all(
    fs.readdirSync(levelsDir).map((file) => {
      return fs.promises
        .readFile(`${levelsDir}/${file}`)
        .then((fileContent) => ({
          userId: path.basename(file, path.extname(file)),
          fileContent: JSON.parse(fileContent.toString()),
        }));
    })
  );

  result.map(({ userId, fileContent: levelObj }) => {
    Object.keys(levelObj).forEach((k) => {
      if (levelsByRole[k]) {
        levelsByRole[k].push({ userId: userId, points: levelObj[k] });
      } else {
        levelsByRole[k] = [{ userId: userId, points: levelObj[k] }];
      }
    });
  });

  Object.keys(levelsByRole).forEach(
    (k) =>
      (levelsByRole[k] = levelsByRole[k].sort((a, b) =>
        a.points >= b.points ? -1 : a.points < b.points ? 1 : 0
      ))
  );

  const eb = new EmbedBuilder().setTitle("Leaderboard");
  Object.keys(levelsByRole).forEach((role) => {
    eb.addFields({
      name: role,
      value: levelsByRole[role]
        .map(
          (k) =>
            `${interaction.guild.members.cache.get(k.userId)?.displayName}: ${
              k.points
            } XP [${Math.floor(k.points / 500)}]`
        )
        .join("\n"),
    });
  });

  return interaction.reply({ embeds: [eb] });
  // .then((fileContentsArr) =>
  //   fileContentsArr.map(
  //     (fc) =>
  //       "```" +
  //       interaction.guild.members.cache.get(fc.userId).displayName +
  //       ":\n" +
  //       JSON.stringify(fc.fileContent, null, 2) +
  //       "```"
  //   )
  // );

  // return interaction.reply(result.join("\n\n") || "No levels");
}

module.exports = { data, execute };
