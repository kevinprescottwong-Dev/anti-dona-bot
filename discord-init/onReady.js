const { Client, Events } = require("discord.js");

function clientOnceReady(/** @type {Client} */ client) {
  // When the client is ready, run this code (only once)
  // We use 'c' for the event parameter to keep it separate from the already defined 'client'
  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });
}

module.exports = { clientOnceReady };
