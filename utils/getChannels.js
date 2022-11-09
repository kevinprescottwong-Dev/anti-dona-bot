const {
  ChatInputCommandInteraction,
  ChannelType,
  Guild,
} = require("discord.js");

/**
 * Searches the Guild Channels.
 * @param {Guild} guild
 * @param {string?} userId If given, return channels
 * @param {ChannelType?} channelType
 * @returns
 */
function getChannels(guild, userId, channelType) {
  if (!guild) return;

  if (!userId) return guild.channels.cache;

  if (!channelType)
    return guild.channels.cache.filter((channel) =>
      channel.members.map((m) => m.id).includes(userId)
    );

  channelType ??= ChannelType.GuildText;

  const channels = guild.channels.cache.filter(
    (channel) => channel.type === channelType
  );

  const userChannel = channels.filter((vc) =>
    vc.members.map((m) => m.id).includes(userId)
  );

  console.log({ userChannel: Array.from(userChannel.values()) });
  return Array.from(userChannel.values());
}

module.exports = { getChannels };
