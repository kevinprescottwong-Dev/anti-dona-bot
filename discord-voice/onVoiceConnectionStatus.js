const {
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const { Client } = require("discord.js");

function onVoiceConnectionStatus(/** @type {Client} */ client) {
  const joinConfig = {
    channelId: "",
    group: "",
    guildId: "",
    selfDeaf: false,
    selfMute: true,
  };
  const connection = new VoiceConnection(joinConfig);
  connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
    console.log("Connection is in the Ready state!");
  });
}

module.exports = {};
