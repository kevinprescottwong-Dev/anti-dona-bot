const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Replies with Pong!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    interaction.client.destroy();
  },
};
