const fs = require("fs");
const path = require("path");
function getUserLevel(userId) {
  const userLevelFile = path.resolve(`./levels/${userId}.json`);
  let userLevel;

  try {
    userLevel = JSON.parse(fs.readFileSync(userLevelFile));
  } catch (err) {
    console.error(err);
  }

  return userLevel;
}

module.exports = { getUserLevel };
