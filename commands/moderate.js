const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
} = require("discord.js");

const {
  entersState,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

const { joinVoiceChannel } = require("../discord-voice/joinVoiceChannel");
const {
  createListeningStream,
} = require("../discord-voice/createListeningStream");
const { speechToTextAsync } = require("../utils/speechToText");
const {
  checkUserTextFromSpeechAsync,
} = require("../utils/testUserTextFromSpeech");

const banConfig = require("../banned.json");

const data = new SlashCommandBuilder()
  .setName("moderate")
  .setDescription("Anti-Dona voice moderation!");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async function execute(interaction) {
  const isAdmin = interaction.member.permissions.has(
    PermissionsBitField.Flags.Administrator
  );

  if (!isAdmin) {
    return await interaction.reply(
      "User must have Admisitrator permissions to use this command."
    );
  }

  /* Get the voice channel the user is in */
  const memberVoiceChannel = interaction.member.voice.channel;
  if (!memberVoiceChannel)
    return await interaction.reply(
      "User must be in a voice channel to use this command."
    );

  /* Check if the bot is in voice channel */
  let botVoiceConnection = getVoiceConnection(interaction.guildId);

  if (!botVoiceConnection) {
    console.log("Bot is not in a voice channel... joining voice channel");
    botVoiceConnection = joinVoiceChannel(
      memberVoiceChannel.id,
      memberVoiceChannel.guild.id,
      memberVoiceChannel.guild.voiceAdapterCreator
    );
  } else if (
    botVoiceConnection.joinConfig.channelId !== memberVoiceChannel.channelId
  ) {
    console.log(
      "Bot is not in the correct voice channel... joining voice channel"
    );
    botVoiceConnection = joinVoiceChannel(
      memberVoiceChannel.id,
      memberVoiceChannel.guild.id,
      memberVoiceChannel.guild.voiceAdapterCreator
    );
  }

  /* Add voice state to collection */
  await entersState(botVoiceConnection, VoiceConnectionStatus.Ready, 20e3);
  const receiver = botVoiceConnection.receiver;

  /* When user speaks in vc*/
  receiver.speaking.on("start", (userId) => {
    const user = interaction.guild.members.cache.get(userId);
    const userName = user.displayName;
    // console.log(`${userName} has started speaking...`);

    /* create live stream to save audio */
    createListeningStream(receiver, user);
  });

  receiver.speaking.on("end", (userId) => {
    const user = interaction.guild.members.cache.get(userId);
    const userName = user.displayName;
    // console.log(`${userName} has stopped speaking. Processing audio`);
    speechToTextAsync(
      userId,
      checkUserTextFromSpeechAsync(user, banConfig, interaction.guild)
    ).catch((err) => console.error(err));
  });

  /* Return success message */
  return interaction.reply(
    `🎙️ I am now moderating ${
      interaction.guild.channels.cache.get(
        botVoiceConnection.joinConfig.channelId
      ).name
    }`
  );
}

module.exports = {
  data,
  execute,
};
