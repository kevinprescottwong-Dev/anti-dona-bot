const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (interaction) await interaction.reply("Pong!");
  },
};
