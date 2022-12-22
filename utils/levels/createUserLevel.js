const path = require("path");
const fs = require("fs");

function createUserLevel(userId, userLevels = {}) {
  if (!userId) return;

  const userLevelPath = path.resolve(`./levels/${userId}.json`);
  if (fs.existsSync(userLevelPath)) {
    console.warn("User Level already exists for ", userId);
    return;
  }

  fs.writeFileSync(userLevelPath, JSON.stringify(userLevels), { flag: "w+" });
}

module.exports = { createUserLevel };
