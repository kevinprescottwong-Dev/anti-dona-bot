const { Interaction } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

function join(channelId, guildId, adapterCreator) {
  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
  });
  return connection;
}

module.exports = { joinVoiceChannel: join };
