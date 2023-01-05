const EventEmiter = require("node:events");
const path = require("node:path");
const { EventTypes } = require("../constants");
const {
  convertPcmToWavAsync,
} = require("../utils/audioConversion/convertPcmToWavAsync");
const WavCreatedEventEmitter = require("./WavCreatedEventEmitter");

const PcmCreatedEventEmitter = new EventEmiter();

PcmCreatedEventEmitter.on(
  EventTypes.PCM_CREATED,
  async ({ user, dest, recordingId }) => {
    const parsed = path.parse(dest);
    const wavFileLocation = await convertPcmToWavAsync(
      path.join(parsed.dir, parsed.name)
    );
    WavCreatedEventEmitter.emit(EventTypes.WAV_CREATED, {
      user,
      recordingId,
      wavFileLocation,
    });
  }
);

module.exports = PcmCreatedEventEmitter;
