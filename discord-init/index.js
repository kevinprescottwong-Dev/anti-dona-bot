const { clientOnceReady } = require("./onReady");
const { clientOnWarn } = require("./onWarn");
const { clientOnError } = require("./onError");
const { onInteractionCreate } = require("./onInteractionCreate");
const { setupRestCommandsAsync } = require("./restCommands");
const { onProcessExit } = require("./onExit");
const { createCommands } = require("./commands");
const { onMessageCreate } = require("./onMessageCreate");

module.exports = {
  onceReady: clientOnceReady,
  onWarn: clientOnWarn,
  onError: clientOnError,
  onInteractionCreate,
  setupRestCommandsAsync,
  onProcessExit,
  createCommands,
  onMessageCreate,
};
