const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Replies with test!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (interaction) await interaction.reply("test!");
  },
};
