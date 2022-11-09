const { Client } = require("discord.js");

function onProcessExit(
  /** @type {Client} */
  client
) {
  process.once("SIGINT", function (code) {
    console.log("SIGINT received... destroying client...");
    client.destroy();
    console.log("done destroying client...");
  });
}

module.exports = { onProcessExit };
