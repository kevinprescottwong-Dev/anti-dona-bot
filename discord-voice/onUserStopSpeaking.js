const { VoiceReceiver } = require("@discordjs/voice");
const { ChatInputCommandInteraction } = require("discord.js");
const { speechToTextAsync } = require("../utils/speechToText");
const {
  checkUserTextFromSpeechAsync,
} = require("../utils/testUserTextFromSpeech");

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

    const text = await speechToTextAsync(userId).catch((err) =>
      console.error(err)
    );

    console.log({ text });

    checkUserTextFromSpeechAsync(user, interaction.guild)(text);
  });
}

module.exports = { onUserStopSpeaking };
