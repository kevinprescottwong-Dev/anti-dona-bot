// import * as sdk from "microsoft-cognitiveservices-speech-sdk
var path = require("path");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const {
  azureSpeechServiceKey,
  azureSpeechServiceRegion,
  azureSpeechServiceTokenEndpoint,
} = require("../config.json");
const {
  KeywordRecognitionModel,
} = require("microsoft-cognitiveservices-speech-sdk");

async function SttFromWav(wavFileLocation, checkUserSpeechCallback) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    azureSpeechServiceKey,
    azureSpeechServiceRegion
  );

  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.setProfanity(sdk.ProfanityOption.Raw);

  var absolutePath = path.resolve(wavFileLocation);

  if (!absolutePath) return;

  const audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync(absolutePath)
  );

  // console.log("Speech Recognizer processing: ", absolutePath);
  const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  let userText = "";
  speechRecognizer.recognizeOnceAsync((result) => {
    switch (result.reason) {
      case sdk.ResultReason.RecognizedSpeech:
        console.log(`RECOGNIZED: Text=${result.text}`);
        userText = result.text;
        checkUserSpeechCallback(result.text);

        break;
      case sdk.ResultReason.NoMatch:
        console.log("NOMATCH: Speech could not be recognized.");
        break;
      case sdk.ResultReason.Canceled:
        const cancellation = sdk.CancellationDetails.fromResult(result);
        console.log(`CANCELED: Reason=${cancellation.reason}`);

        if (cancellation.reason == sdk.CancellationReason.Error) {
          console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
          console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
          console.log(
            "CANCELED: Did you set the speech resource key and region values?"
          );
        }
        break;
    }
    speechRecognizer.close();
  });
  return userText;
}

module.exports = { SttFromWav };
