const { ChatInputCommandInteraction, ChannelType } = require("discord.js");
const { getChannels } = require("./getChannels");

function getVoiceChannelFromInteraction(
  /** @type {ChatInputCommandInteraction} */
  interaction
) {
  if (!interaction) return;
  return getChannels(
    interaction.guild,
    interaction.user.id,
    ChannelType.GuildVoice
  )[0];
}

module.exports = { getVoiceChannelFromInteraction };
