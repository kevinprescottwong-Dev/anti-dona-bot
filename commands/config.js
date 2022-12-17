const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

const { SpeechToTextServices } = require("../constants");
const { updateConfig } = require("../utils/updateConfig");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Update Config")
    .addStringOption((option) =>
      option
        .setName("service")
        .setDescription("Choose which STT Service to use")
        .setRequired(true)
        .addChoices(
          { name: "Azure", value: SpeechToTextServices.Azure },
          { name: "DeepSpeech", value: SpeechToTextServices.DeepSpeech }
        )
    ),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    const sttService = interaction.options.getString("service");
    updateConfig("speechToTextService", sttService);
    await interaction.reply("Pong!");
  },
};
