const SpeechToTextServices = {
  Azure: "Azure",
  DeepSpeech: "DeepSpeech",
};

const EventTypes = {
  PCM_CREATED: "PCM_CREATED",
  WAV_CREATED: "WAV_CREATED",
  SPEECH_TO_TEXT_FINISH: "SPEECH_TO_TEXT_FINISH",
};
module.exports = { SpeechToTextServices, EventTypes };
