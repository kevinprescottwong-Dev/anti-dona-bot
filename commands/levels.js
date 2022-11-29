const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
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
  const result = await Promise.all(
    fs.readdirSync(levelsDir).map((file) => {
      return fs.promises
        .readFile(`${levelsDir}/${file}`)
        .then((fileContent) => ({
          userId: path.basename(file, path.extname(file)),
          fileContent: JSON.parse(fileContent.toString()),
        }));
    })
  ).then((fileContentsArr) =>
    fileContentsArr.map(
      (fc) =>
        "```" +
        interaction.guild.members.cache.get(fc.userId).displayName +
        ":\n" +
        JSON.stringify(fc.fileContent, null, 2) +
        "```"
    )
  );

  return interaction.reply(result.join("\n\n") || "No levels");
}

module.exports = { data, execute };
