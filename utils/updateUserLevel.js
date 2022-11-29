const path = require("path");
const fs = require("fs");
const { getUserLevel } = require("./getUserLevel");
const { createUserLevel } = require("./createUserLevel");

function updateUserLevel(userId, userLevels = {}) {
  if (!userId) return;

  const userLevelPath = path.resolve(`./levels/${userId}.json`);
  // get user's level
  const currUserLevel = getUserLevel(userId);
  console.log({ currUserLevel, userLevels });

  if (currUserLevel) {
    Object.keys(userLevels).forEach((key) => {
      if (currUserLevel[key]){ currUserLevel[key] += userLevels[key]};
      else currUserLevel[key] = userLevels[key];
    });
    fs.writeFileSync(userLevelPath, JSON.stringify(currUserLevel));

    return getUserLevel(userId);
  }

  createUserLevel(userId, userLevels);
  return;
}

module.exports = { updateUserLevel };
