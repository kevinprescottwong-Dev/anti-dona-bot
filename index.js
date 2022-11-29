// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

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

// Log in to Discord with your client's token
client.login(token);
