const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");

const { getVoiceConnection } = require("@discordjs/voice");

const ffmpeg = require("ffmpeg");

const fs = require("node:fs");

const sleep = require("util").promisify(setTimeout);

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

    /* Create ffmpeg command to convert pcm to mp3 */
    const process = new ffmpeg(`${filename}.pcm`);
    process
      .then(
        function (audio) {
          audio.fnExtractSoundToMP3(
            `${filename}.mp3`,
            async function (error, file) {
              //edit message with recording as attachment
              await msg.edit({
                content: `🔉 Here is your recording!`,
                files: [`./recordings/${interaction.member.id}.mp3`],
              });

              //delete both files
              fs.unlinkSync(`${filename}.pcm`);
              fs.unlinkSync(`${filename}.mp3`);
            }
          );
        },
        function (err) {
          /* handle error by sending error message to discord */
          return msg.edit(
            `❌ An error occurred while processing your recording: ${err.message}`
          );
        }
      )
      .then(() => {
        sleep(5000);
        botVoiceConnection.disconnect();
        sleep(5000);
        botVoiceConnection.destroy;
      });
  },
};
