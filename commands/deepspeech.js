const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandBooleanOption,
} = require("discord.js");
const { deepspeech, deepspeechWithMetaData, x } = require("../deepspeech");

const path = require("path");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ds")
    .addBooleanOption(
      new SlashCommandBooleanOption().setName("metadata").setRequired(true)
    )
    .setDescription("DS Test!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    const metadata = interaction.options.getBoolean("metadata") || false;
    const result = !metadata
      ? await deepspeechWithMetaData(path.resolve("./recordings/ENG_M.wav"))
      : await deepspeech(path.resolve("./recordings/ENG_M.wav"));

    await interaction.reply("```" + result + " ```");
  },
};
