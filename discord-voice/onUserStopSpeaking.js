const { VoiceReceiver } = require("@discordjs/voice");
const { ChatInputCommandInteraction } = require("discord.js");
const FileConversionQueue = require("../queue/FileConversionQueue");
console.log({ FileConversionQueue });
const {
  convertPcmToWavAsync,
} = require("../utils/audioConversion/convertPcmToWavAsync");
const { speechToTextAsync } = require("../utils/speechToText");
const {
  checkUserTextFromSpeechAsync,
} = require("../utils/testUserTextFromSpeech");

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("crypto");

/**
 * Handles the event when a user stops speaking
 * @param {VoiceReceiver} receiver
 * @param {ChatInputCommandInteraction} interaction
 */
function onUserStopSpeaking(receiver, interaction) {
  receiver.speaking.on("end", async (userId) => {
    const user = interaction.guild.members.cache.get(userId);
    const userName = user.displayName;
    console.log(`${userName} has stopped speaking. Processing audio`);

    console.time("Creating copy of .pcm");
    const recordingId = crypto.randomUUID();
    if (fs.existsSync(`./recordings/${userId}`)) {
      console.log(`./recordings/${userId}/${recordingId}.pcm EXISTS!`);
    } else {
      console.log(`./recordings/${userId}/${recordingId}.pcm DOES NOT EXIST!`);

      fs.mkdirSync(`./recordings/${userId}`);
    }
    fs.copyFileSync(
      path.resolve(`./recordings/${userId}.pcm`),
      path.resolve(`./recordings/${userId}/${recordingId}.pcm`)
    );
    console.timeEnd("Creating copy of .pcm");

    console.log({ FileConversionQueue });
    FileConversionQueue.enqueue(
      path.resolve(`./recordings/${userId}/${recordingId}.pcm`)
    );

    console.log(FileConversionQueue);

    const text = await speechToTextAsync(userId).catch((err) =>
      console.error(err)
    );

    console.log({ text });

    checkUserTextFromSpeechAsync(user, interaction.guild)(text);
  });
}

module.exports = { onUserStopSpeaking };
