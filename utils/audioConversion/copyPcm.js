const crypto = require("crypto");
const fs = require("node:fs");
const path = require("path");
const { EventTypes } = require("../../constants");
const PcmCreatedEventEmitter = require("../../events/PcmCreatedEventEmitter");
/**
 * Creates a copy of the PCM file. The copy will have a unique ID
 * @param {string} src
 * @returns An object with the new file location and the recording ID
 */
function copyPcm(user) {
  const userId = user.id;
  if (!fs.existsSync(path.resolve(`./recordings/${userId}.pcm`))) {
    console.log(
      path.resolve(`./recordings/${userId}.pcm`),
      "does NOT exist... will not copy"
    );
    return;
  }

  console.time("Creating copy of .pcm");
  const recordingId = crypto.randomUUID();

  if (fs.existsSync(`./recordings/${userId}`)) {
    console.log(`./recordings/${userId}/${recordingId} EXISTS!`);
  } else {
    console.log(`./recordings/${userId}/${recordingId} DOES NOT EXIST!`);

    fs.mkdirSync(`./recordings/${userId}`);
  }

  const dest = path.resolve(`./recordings/${userId}/${recordingId}.pcm`);
  fs.copyFileSync(
    path.resolve(`./recordings/${userId}.pcm`),
    path.resolve(dest)
  );
  console.timeEnd("Creating copy of .pcm");

  // Delete original PCM to get it ready for next recording
  fs.unlinkSync(`./recordings/${userId}.pcm`);

  PcmCreatedEventEmitter.emit(EventTypes.PCM_CREATED, {
    user,
    dest,
    recordingId,
  });

  return { fileLocation: dest, recordingId };
}

module.exports = copyPcm;
