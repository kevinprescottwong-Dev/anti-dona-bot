const { Interaction } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const fs = require("node:fs");
var path = require("path");

function join(channelId, guildId, adapterCreator) {
  const rec = path.resolve("./recordings");
  const dir = fs.readdirSync(path.resolve("./recordings"));

  dir.forEach((file) => fs.unlinkSync(path.join(rec, file)));

  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator,
  });
  return connection;
}

module.exports = { joinVoiceChannel: join };
