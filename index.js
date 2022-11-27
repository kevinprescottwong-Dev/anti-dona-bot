// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const {
  onceReady,
  onWarn,
  onError,
  onInteractionCreate,
  onMessageCreate,
  createCommands,
  onProcessExit,
} = require("./discord-init");

const {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
  EndBehaviorType,
} = require("@discordjs/voice");
const { createWriteStream } = require("node:fs");
const prism = require("prism-media");
const { pipeline } = require("node:stream");
const ffmpeg = require("ffmpeg");
const sleep = require("util").promisify(setTimeout);

const { initialize } = require("./discord-voice");
const Test = require("./azure/speech");

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
