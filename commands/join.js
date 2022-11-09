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

    joinVoiceChannel(
      vc.id,
      interaction.guild.id,
      interaction.guild.voiceAdapterCreator
    );

    await interaction.reply("Joined: " + vc.name + "!");
  },
};
