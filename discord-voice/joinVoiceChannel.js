const { Interaction } = require("discord.js");
const { joinVoiceChannel: jvc } = require("@discordjs/voice");

const fs = require("node:fs");
var path = require("path");

function joinVoiceChannel(channelId, guildId, adapterCreator) {
  const connection = jvc({
    channelId,
    guildId,
    adapterCreator,
  });
  return connection;
}

module.exports = { joinVoiceChannel };
