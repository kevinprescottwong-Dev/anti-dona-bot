const ffmpeg = require("ffmpeg");

/**
 * Converts .pcm file to .wav file
 * @param {string} filename
 */
async function convertPcmToWavAsync(filename) {
  /* Create ffmpeg command to convert pcm to mp3 */
  const process = new ffmpeg(
    `${filename}${filename.endsWith(".pcm") ? "" : ".pcm"}`
  );
  const video = await process.catch((err) =>
    console.error(
      `❌ An error occurred while processing your recording: ${err.message}`
    )
  );

  video.addCommand("-y"); //auto accept file overwriting
  video.addCommand("-f", "wav"); //convert file to wav
  return await video.save(`${filename}.wav`);
}

module.exports = { convertPcmToWavAsync };
