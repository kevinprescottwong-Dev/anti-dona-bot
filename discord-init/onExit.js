const { Client } = require("discord.js");

const fs = require("fs");
const path = require("path");
const {
  deleteAll: removeRecordings,
} = require("../utils/recordings/deleteAll");
function onProcessExit(
  /** @type {Client} */
  client
) {
  process.once("SIGINT", function (code) {
    console.log("SIGINT received... destroying client...");
    client.destroy();
    console.log("done destroying client...");
    removeRecordings();
  });
}

module.exports = { onProcessExit };
