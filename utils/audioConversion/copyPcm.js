const crypto = require("crypto");
const fs = require("node:fs");
/**
 * Creates a copy of the PCM file. The copy will have a unique ID
 * @param {string} src
 * @returns An object with the new file location and the recording ID
 */
function copyPcm(userId) {
  console.time("Creating copy of .pcm");
  const recordingId = crypto.randomUUID();

  if (fs.existsSync(`./recordings/${userId}`)) {
    console.log(`./recordings/${userId}/${recordingId}.pcm EXISTS!`);
  } else {
    console.log(`./recordings/${userId}/${recordingId}.pcm DOES NOT EXIST!`);

    fs.mkdirSync(`./recordings/${userId}`);
  }
  fs.copyFileSync(
    path.resolve(`./recordings/${userId}.pcm`),
    path.resolve(`./recordings/${userId}/${recordingId}.pcm`)
  );
  console.timeEnd("Creating copy of .pcm");
}

module.exports = copyPcm;
