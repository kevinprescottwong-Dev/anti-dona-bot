const { createWriteStream } = require("node:fs");

const { EndBehaviorType } = require("@discordjs/voice");

const prism = require("prism-media");
const { pipeline } = require("node:stream");

/* Function to write audio to file (from discord.js example) */
function createListeningStream(receiver, user) {
  const opusStream = receiver.subscribe(user.id, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 100,
    },
  });

  const oggStream = new prism.opus.OggLogicalBitstream({
    opusHead: new prism.opus.OpusHead({
      channelCount: 2,
      sampleRate: 48000,
    }),
    pageSizeControl: {
      maxPackets: 10,
    },
  });

  const filename = `./recordings/${user.id}.pcm`;

  const out = createWriteStream(filename, { flags: "a" });
  console.log(`👂 Started recording ${filename}`);

  pipeline(opusStream, oggStream, out, (err) => {
    if (err) {
      console.warn(`❌ Error recording file ${filename} - ${err.message}`);
    } else {
      console.log(`✅ Recorded ${filename}`);
    }
  });
}

module.exports = { createListeningStream };
