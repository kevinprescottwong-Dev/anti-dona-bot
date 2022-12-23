const { pointsPerLevel: XP_PER_LEVEL } = require("../../levels.config.json");

/**
 * Checks if the XP gained is enough to level up.
 * Uses the levels.config
 * @param {number} currentXpLevel
 * @param {number} xpGained
 * @returns
 */
function isLevelUp(currentXpLevel, xpGained) {
  return (currentXpLevel % XP_PER_LEVEL) + xpGained - XP_PER_LEVEL >= 0;
}

module.exports = { isLevelUp };
