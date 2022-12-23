const path = require("path");
const fs = require("fs");
const { getUserLevel } = require("./getUserLevel");
const { pointsPerLevel: XP_PER_LEVEL } = require("../..//levels.config.json");
const { createUserLevel } = require("./createUserLevel");
const { isLevelUp } = require("./isLevelUp");

function updateUserLevel(userId, userLevels = {}) {
  if (!userId) return;

  const levelUps = [];

  const userLevelPath = path.resolve(`./levels/${userId}.json`);
  const currUserLevel = getUserLevel(userId);

  if (currUserLevel) {
    Object.keys(userLevels).forEach((key) => {
      if (currUserLevel[key]) {
        if (isLevelUp(currUserLevel[key], userLevels[key])) {
          // LEVELED UP!
          levelUps.push({
            role: key,
            xp: currUserLevel[key] + userLevels[key],
          });
        }

        currUserLevel[key] += userLevels[key];
      } else currUserLevel[key] = userLevels[key];
    });
    fs.writeFileSync(userLevelPath, JSON.stringify(currUserLevel));

    return levelUps;
  }

  createUserLevel(userId, userLevels);
  return levelUps;
}

module.exports = { updateUserLevel };
