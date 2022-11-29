const ffmpeg = require("ffmpeg");
const fs = require("node:fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { SttFromWav } = require("../azure/speech");

async function speechToTextAsync(memberId, checkUserSpeechCallback) {
  const filename = `./recordings/${memberId}`;

  /* Create ffmpeg command to convert pcm to mp3 */
  const process = new ffmpeg(`${filename}.pcm`);
  const video = await process.catch((err) =>
    console.error(
      `❌ An error occurred while processing your recording: ${err.message}`
    )
  );
  const destinationMp3 = `${filename}.mp3`;
  const pathToMp3 = await video.fnExtractSoundToMP3(destinationMp3);

  const execResult = await exec(`ffmpeg -i ${filename}.mp3 ${filename}.wav`);

  SttFromWav(`${filename}.wav`, checkUserSpeechCallback);

  //delete both files
  try {
    fs.unlinkSync(`${filename}.wav`);
    fs.unlinkSync(`${filename}.pcm`);
    fs.unlinkSync(`${filename}.mp3`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { speechToTextAsync };
