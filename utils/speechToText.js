const fs = require("node:fs");
const { azureSpeechToTextAsync } = require("../azure/speechToTextAsync");
const {
  convertPcmToWavAsync,
} = require("./audioConversion/convertPcmToWavAsync");

const {
  speechToTextService: SPEECH_TO_TEXT_SERVICE,
  deepspeechConfidenceThreshold: DEEP_SPEECH_CONFIDENCE_THRESHOLD,
} = require("../config.json");
const { SpeechToTextServices } = require("../constants");
const { deepspeechWithMetaDataAsync } = require("../deepspeech");

/**
 * High level wrapper function to call a speech to text service
 * @param {string} memberId
 * @returns {Promise<string>} Promise that resolves with the user's speech as text, or rejects with the error message
 */
async function speechToTextAsync(memberId) {
  const filename = `./recordings/${memberId}`;

  const speechToTextServices = {
    [SpeechToTextServices.Azure]: azureSpeechToTextAsync,
    [SpeechToTextServices.DeepSpeech]: async (filename) => {
      const results = await deepspeechWithMetaDataAsync(filename);
      console.log({ results });

      const { confidence, textPhrase } = results[0];
      console.log({ confidence, textPhrase });

      // Check if DeepSpeech TTS is confident enough, otherwise use Azure
      // This is to try to save on excess calls to Azure
      if (confidence >= DEEP_SPEECH_CONFIDENCE_THRESHOLD) {
        return textPhrase;
      }

      console.log("Confidence check failed... calling Azure...");
      return await azureSpeechToTextAsync(filename);
    },
  };

  await convertPcmToWavAsync(filename);

  const text = await speechToTextServices[SPEECH_TO_TEXT_SERVICE](
    `${filename}.wav`
  );

  try {
    fs.unlinkSync(`${filename}.pcm`);
    fs.unlinkSync(`${filename}.wav`);
  } catch (err) {
    console.log(err);
  }

  return text;
}

module.exports = { speechToTextAsync };
