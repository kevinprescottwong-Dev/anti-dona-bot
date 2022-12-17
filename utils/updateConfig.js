const fs = require("fs");

function updateConfig(key, value) {
  const config = JSON.parse(fs.readFileSync("./config.json"));
  config[key] = value;
  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}

module.exports = { updateConfig };
