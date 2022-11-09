const { Client, Events } = require("discord.js");

function clientOnWarn(
  /** @type {Client} */
  client
) {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.on(Events.Warn, (...warnProps) => {
    console.warn("Warning Triggered...", { warnProps });
  });
}
module.exports = { clientOnWarn };
