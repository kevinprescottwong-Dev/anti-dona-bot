const { REST, Routes } = require("discord.js");
const { token, clientId } = require("../config.json");

const rest = new REST({ version: "10" }).setToken(token);

async function setupRestCommandsAsync(commands) {
  try {
    console.log("Started refreshing application (/) commands.");
    console.log({ restCommands: commands });
    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { setupRestCommandsAsync };
