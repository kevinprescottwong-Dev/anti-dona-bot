const path = require("path");
const fs = require("fs");
const { getUserLevel } = require("./getUserLevel");
const { createUserLevel } = require("./createUserLevel");

function updateUserLevel(userId, userLevels = {}) {
  if (!userId) return;

  const XP_PER_LEVEL = 500;
  const levelUps = [];

  const userLevelPath = path.resolve(`./levels/${userId}.json`);
  // get user's level
  const currUserLevel = getUserLevel(userId);
  console.log({ currUserLevel, userLevels });

  if (currUserLevel) {
    Object.keys(userLevels).forEach((key) => {
      if (currUserLevel[key]) {
        if (
          (currUserLevel[key] % XP_PER_LEVEL) +
            userLevels[key] -
            XP_PER_LEVEL >=
          0
        ) {
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
