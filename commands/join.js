const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require("discord.js");
const { joinVoiceChannel } = require("../discord-voice");
const {
  getVoiceChannelFromInteraction,
} = require("../utils/getVoiceChannelFromInteraction");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the current voice channel"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (!interaction) return;

    const vc = getVoiceChannelFromInteraction(interaction);
    console.log({ vc });

    if (!vc) {
      return await interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "Cannot find calling user's voice channel",
          },
        ],
        ephemeral: true,
      });
    }

    joinVoiceChannel(
      vc.id,
      interaction.guild.id,
      interaction.guild.voiceAdapterCreator
    );

    await interaction.reply("Joined: " + vc.name + "!");
  },
};
