const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const ffmpeg = require("ffmpeg");
const fs = require("node:fs");
const { exec } = require("child_process");
const { SttFromWav } = require("../azure/speech");
const { speechToTextAsync } = require("../utils/speechToText");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop-record")
    .setDescription("Stops the recording!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (!interaction) return await interaction.reply("Error! No interaction");

    /* Check if the bot is in voice channel */
    let botVoiceConnection = getVoiceConnection(interaction.guildId);
    if (!botVoiceConnection)
      await interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Bot is not in a voice channel",
          },
        ],
        ephemeral: true,
      });

    const msg = await interaction.channel.send(
      "Please wait while I am preparing your recording..."
    );

    const filename = `./recordings/${interaction.member.id}`;
    await speechToTextAsync(interaction.member.id);

    //edit message with recording as attachment
    await msg.edit({
      content: `🔉 Here is your recording!`,
      files: [`./recordings/${interaction.member.id}.mp3`],
    });

    //delete both files
    fs.unlinkSync(`${filename}.wav`);
    fs.unlinkSync(`${filename}.pcm`);
    fs.unlinkSync(`${filename}.mp3`);
    botVoiceConnection.destroy();
  },
};
