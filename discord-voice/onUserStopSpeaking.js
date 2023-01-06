const { VoiceReceiver } = require("@discordjs/voice");
const { ChatInputCommandInteraction } = require("discord.js");
const copyPcm = require("../utils/audioConversion/copyPcm");

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

    const copyRes = copyPcm(user);
  });
}

module.exports = { onUserStopSpeaking };
