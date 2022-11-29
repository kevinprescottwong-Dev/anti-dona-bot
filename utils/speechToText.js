const ffmpeg = require("ffmpeg");
const fs = require("node:fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { SttFromWav } = require("../azure/speech");

async function speechToTextAsync(memberId, checkUserSpeechCallback) {
  const filename = `./recordings/${memberId}`;

  console.log("speechToText: ", { filename, memberId });

  /* Create ffmpeg command to convert pcm to mp3 */
  const process = new ffmpeg(`${filename}.pcm`);
  console.log("Starting ffmpeg process...");
  const video = await process.catch((err) =>
    console.error(
      `❌ An error occurred while processing your recording: ${err.message}`
    )
  );
  const destinationMp3 = `${filename}.mp3`;
  const pathToMp3 = await video.fnExtractSoundToMP3(destinationMp3);

  console.log("Starting exec to convert mp3 to wav...");
  const execResult = await exec(`ffmpeg -i ${filename}.mp3 ${filename}.wav`);
  console.log("Finished exec to convert mp3 to wav...");

  console.log("Starting SttFromWav...");
  SttFromWav(`${filename}.wav`, checkUserSpeechCallback).then((userText) =>
    console.log({ userText })
  );

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
