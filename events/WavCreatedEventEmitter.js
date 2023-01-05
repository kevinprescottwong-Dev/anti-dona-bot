const EventEmiter = require("node:events");
const { EventTypes } = require("../constants");
const { speechToTextAsync } = require("../utils/speechToText");
const {
  checkUserTextFromSpeechAsync,
} = require("../utils/testUserTextFromSpeech");

const fs = require("fs");
const path = require("node:path");
const WavCreatedEventEmitter = new EventEmiter();

WavCreatedEventEmitter.on(
  EventTypes.WAV_CREATED,
  async ({ user, recordingId, wavFileLocation }) => {
    const text = await speechToTextAsync(user.id, recordingId).catch((err) =>
      console.error(err)
    );

    const parsed = path.parse(wavFileLocation);
    const pcmFileLocation = path.join(parsed.dir, `${parsed.name}.pcm`);

    fs.unlinkSync(pcmFileLocation);
    fs.unlinkSync(wavFileLocation);

    console.log({ text });
    checkUserTextFromSpeechAsync(user, user.guild)(text);
  }
);

WavCreatedEventEmitter.on("error", console.error);

module.exports = WavCreatedEventEmitter;
