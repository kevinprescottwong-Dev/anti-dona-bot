// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");

const {
  onceReady,
  onWarn,
  onError,
  onInteractionCreate,
  onMessageCreate,
  createCommands,
  onProcessExit,
} = require("./discord-init");
const { initialize } = require("./discord-voice");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

initialize(client);

createCommands(client);

onceReady(client);
onWarn(client);
onError(client);
onInteractionCreate(client);
onMessageCreate(client);
onProcessExit(client);

module.exports = client;
