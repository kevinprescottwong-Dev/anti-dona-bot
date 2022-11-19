const { Client } = require("discord.js");

function initialize(/** @type {Client} */ client) {
  console.log({ cVoice: client.voice });
}

module.exports = { initialize };
