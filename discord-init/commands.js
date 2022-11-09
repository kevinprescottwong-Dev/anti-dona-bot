const { Client, Collection, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { setupRestCommandsAsync } = require("./restCommands");

const restCommands = [];

function createCommands(/** @type {Client} */ client) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      restCommands.push({
        name: command.data.name,
        description: command.data.description,
      });
      client.commands.set(command.data.name, command);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  setupRestCommandsAsync(restCommands);

  console.log({ clientCommands: client.commands });
}

module.exports = { createCommands };
