const { pointsPerLevel: XP_PER_LEVEL } = require("../../levels.config.json");

function calculateUserLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL);
}

module.exports = { calculateUserLevel };
