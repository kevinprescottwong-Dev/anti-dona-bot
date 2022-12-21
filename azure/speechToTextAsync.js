// import * as sdk from "microsoft-cognitiveservices-speech-sdk
var path = require("path");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const {
  azureSpeechServiceKey,
  azureSpeechServiceRegion,
} = require("../config.json");
const {
  KeywordRecognitionModel,
} = require("microsoft-cognitiveservices-speech-sdk");
const user = require("../commands/user");

/**
 *
 * @param {*} wavFileLocation
 * @returns {Promise<string>} Promise that will resolve the user's text or reject with the error message
 */
async function azureSpeechToTextAsync(wavFileLocation) {
  console.log("azureSpeechToTextAsync called", { wavFileLocation });
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    azureSpeechServiceKey,
    azureSpeechServiceRegion
  );

  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);

  var absolutePath = path.resolve(wavFileLocation);
  console.log({ absolutePath, exists: fs.existsSync(absolutePath) });

  if (!absolutePath) return;

  const audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync(absolutePath)
  );

  const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  let userText = "";

  const azureSpeechToTextPromise = new Promise((resolve, reject) => {
    console.log("Inside azureSpeechToTextPromise...");
    speechRecognizer.recognizeOnceAsync((result) => {
      console.log("Inside recognizeOnceAsync...");

      switch (result.reason) {
        case sdk.ResultReason.RecognizedSpeech:
          console.log(`RECOGNIZED: Text=${result.text}`);
          userText = result.text;
          resolve(userText);

          break;
        case sdk.ResultReason.NoMatch:
          console.log("NOMATCH: Speech could not be recognized.");
          reject("NOMATCH: Speech could not be recognized.");
          break;
        case sdk.ResultReason.Canceled:
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`CANCELED: Reason=${cancellation.reason}`);

          if (cancellation.reason == sdk.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            reject(cancellation.errorDetails);
          }
          break;
      }
      speechRecognizer.close();
    });
  });

  return azureSpeechToTextPromise;
}

module.exports = { azureSpeechToTextAsync };
