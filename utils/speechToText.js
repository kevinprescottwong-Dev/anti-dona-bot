const fs = require("node:fs");
const { azureSpeechToTextAsync } = require("../azure/speechToTextAsync");
const { convertPcmToWavAsync } = require("./convertPcmToWavAsync");

/**
 * High level wrapper function to call a speech to text service
 * @param {string} memberId
 * @param {*} checkUserSpeechCallbackAsync
 * @returns {Promise<string>} Promise that resolves with the user's speech as text, or rejects with the error message
 */
async function speechToTextAsync(memberId, checkUserSpeechCallbackAsync) {
  const filename = `./recordings/${memberId}`;

  await convertPcmToWavAsync(filename);

  const speechToTextPromise = azureSpeechToTextAsync(`${filename}.wav`);
  if (checkUserSpeechCallbackAsync) {
    const text = await speechToTextPromise;
    return checkUserSpeechCallbackAsync(text);
  }

  try {
    fs.unlinkSync(`${filename}.pcm`);
    fs.unlinkSync(`${filename}.wav`);
  } catch (err) {
    console.log(err);
  }

  return speechToTextPromise;
}

module.exports = { speechToTextAsync };
