const { VoiceReceiver } = require("@discordjs/voice");
const { ChatInputCommandInteraction } = require("discord.js");
const { createListeningStream } = require("./createListeningStream");

/**
 * Handles the event when a user starts speaking
 * @param {VoiceReceiver} receiver
 * @param {ChatInputCommandInteraction} interaction
 */
function onUserStartSpeaking(receiver, interaction) {
  receiver.speaking.on("start", (userId) => {
    const user = interaction.guild.members.cache.get(userId);
    const userName = user.displayName;
    console.log(`${userName} has started speaking...`);

    /* create live stream to save audio */
    createListeningStream(receiver, user);
  });
}

module.exports = { onUserStartSpeaking };
