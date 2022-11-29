const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

const {
  entersState,
  VoiceConnectionStatus,
  EndBehaviorType,
  getVoiceConnection,
} = require("@discordjs/voice");

const { joinVoiceChannel } = require("../discord-voice/joinVoiceChannel");
const {
  createListeningStream,
} = require("../discord-voice/createListeningStream");
const { speechToTextAsync } = require("../utils/speechToText");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("Records your voice!"),
  async execute(
    /** @type {ChatInputCommandInteraction} */
    interaction
  ) {
    if (!interaction) await interaction.reply("Oops! No interaction");

    const isAdmin = interaction.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    );

    if (!isAdmin)
      return await interaction.reply(
        "User must have Admisitrator permissions to use this command."
      );

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

    await interaction.reply({
      embeds: [
        {
          title: "Joined!",
          description:
            "Use the `leave` command to disconnect the bot from the voice channel.",
        },
      ],
      ephemeral: true,
    });

    /* Add voice state to collection */
    await entersState(botVoiceConnection, VoiceConnectionStatus.Ready, 20e3);
    const receiver = botVoiceConnection.receiver;

    /* When user speaks in vc*/
    receiver.speaking.on("start", (userId) => {
      const user = interaction.guild.members.cache.get(userId);

      const userName = user.displayName;
      console.log(`${userName} has started speaking...`);
      // if (userId !== interaction.member.id) return;

      /* create live stream to save audio */
      createListeningStream(receiver, user);
    });

    const checkUserTextFromSpeech = (member) => {
      const bannedPhrases = ["that's right, boy", "big sheesh", "hey, daddy"];
      return (text) => {
        console.log("Starting checkUserTextFromSpeech...");
        if (!text) return;
        if (bannedPhrases.some((bp) => text.toLowerCase().includes(bp))) {
          console.log("DONA INFLUECNE FOUND... KICKING FROM VC");

          member.voice.setChannel(null);
        }
      };
    };

    receiver.speaking.on("end", (userId) => {
      const user = interaction.guild.members.cache.get(userId);
      const userName = user.displayName;
      console.log(`${userName} has stopped speaking. Processing audio`);
      speechToTextAsync(userId, checkUserTextFromSpeech(user)).catch((err) =>
        console.error(err)
      );
    });

    /* Return success message */
    return interaction.guild.channels.cache
      .get(interaction.channelId)
      .send(
        `🎙️ I am now recording ${
          interaction.guild.channels.cache.get(
            botVoiceConnection.joinConfig.channelId
          ).name
        }`
      );
  },
};
