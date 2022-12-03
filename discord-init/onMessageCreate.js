const { Client, Events, Message } = require("discord.js");
const { getCommandAsync, isBotMessage, isBotMention } = require("../utils");

function logMessage(/** @type {Message} */ msg) {
  console.log(
    "Received message from " + msg.author.username + ":\n" + msg.content
  );
  console.log({ msg });
}

function onMessageCreate(/** @type {Client} */ client) {
  client.on("messageCreate", (/** @type {Message} */ message) => {
    if (isBotMessage(client, message)) return;

    logMessage(message);

    // client.channels
    //   .fetch(message.channelId)
    //   .then((channel) => channel.send(`Received message: ` + message.content));

    if (message.content.startsWith("/")) {
      console.log("Found command in message...");

      const commandMessage = message.content.slice(1);
      const commandParts = commandMessage.split(" ");
      const commandWithoutSlash = commandParts[0];

      // const command = getCommandAsync(commandWithoutSlash);
    }
  });
}

module.exports = { onMessageCreate };
