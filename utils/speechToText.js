const ffmpeg = require("ffmpeg");
const fs = require("node:fs");
const { azureSpeechToTextAsync } = require("../azure/speechToTextAsync");

async function speechToTextAsync(memberId, checkUserSpeechCallbackAsync) {
  const filename = `./recordings/${memberId}`;

  /* Create ffmpeg command to convert pcm to mp3 */
  const process = new ffmpeg(`${filename}.pcm`);
  const video = await process.catch((err) =>
    console.error(
      `❌ An error occurred while processing your recording: ${err.message}`
    )
  );

  video.addCommand("-y");
  video.addCommand("-f", "wav");
  await video.save(`${filename}.wav`);

  const speechToTextPromise = azureSpeechToTextAsync(`${filename}.wav`);
  if (checkUserSpeechCallbackAsync) {
    return checkUserSpeechCallbackAsync(await speechToTextPromise);
  }

  //delete .wav file once its been parsed
  try {
    fs.unlinkSync(`${filename}.pcm`);
    fs.unlinkSync(`${filename}.wav`);
  } catch (err) {
    console.log(err);
  }

  return speechToTextPromise;
}

module.exports = { speechToTextAsync };
