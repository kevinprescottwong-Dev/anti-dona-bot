const ffmpeg = require("ffmpeg");
const fs = require("node:fs");
const { exec } = require("child_process");
const { SttFromWav } = require("../azure/speech");

async function speechToTextAsync(memberId, checkUserSpeechCallback) {
  const filename = `./recordings/${memberId}`;

  console.log("speechToText: ", { filename, memberId });

  /* Create ffmpeg command to convert pcm to mp3 */
  const process = new ffmpeg(`${filename}.pcm`);
  console.log("Starting ffmpeg process...");
  process.then(
    function (audio) {
      console.log("Starting fnExtractSoundToMP3...");
      audio.fnExtractSoundToMP3(
        `${filename}.mp3`,
        async function (error, file) {
          console.log("Starting exec to convert mp3 to wav...");
          exec(
            `ffmpeg -i ${filename}.mp3 ${filename}.wav`,
            (error, stdout, stderr) => {
              console.log("Finished exec to convert mp3 to wav...");

              console.log("Starting SttFromWav...");
              SttFromWav(`${filename}.wav`, checkUserSpeechCallback).then(
                (userText) => console.log({ userText })
              );
              //delete both files
              fs.unlinkSync(`${filename}.wav`);
              fs.unlinkSync(`${filename}.pcm`);
              fs.unlinkSync(`${filename}.mp3`);
            }
          );
        }
      );
    },
    function (err) {
      /* handle error by sending error message to discord */
      return msg.edit(
        `❌ An error occurred while processing your recording: ${err.message}`
      );
    }
  );
}

module.exports = { speechToTextAsync };
