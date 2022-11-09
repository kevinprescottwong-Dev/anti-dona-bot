// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const { getCommandAsync, isBotMessage, isBotMention } = require("./utils");
const {
  onceReady,
  onWarn,
  onError,
  onInteractionCreate,
  onMessageCreate,
  createCommands,
  onProcessExit,
} = require("./discord-init");
const di = require("./discord-init");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

createCommands(client);

onceReady(client);
onWarn(client);
onError(client);
onInteractionCreate(client);
onMessageCreate(client);
onProcessExit(client);

// Log in to Discord with your client's token
client.login(token);
