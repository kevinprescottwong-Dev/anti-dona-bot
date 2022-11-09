const { Client, Events } = require("discord.js");

function clientOnError(
  /** @type {Client} */
  client
) {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.on(Events.Error, (...errorProps) => {
    console.error("Error Triggered!", { errorProps });
  });
}

module.exports = { clientOnError };
