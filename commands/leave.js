const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

const ffmpeg = require("ffmpeg");

const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the voice channel!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (!interaction) return await interaction.reply("Error! No interaction");

    /* Check if the bot is in voice channel */
    let botVoiceConnection = getVoiceConnection(interaction.guildId);
    if (!botVoiceConnection)
      return await interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Bot is not in a voice channel",
          },
        ],
        ephemeral: true,
      });

    await interaction.reply("Done");
    botVoiceConnection.destroy();
  },
};
