const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
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
      if (userId !== interaction.member.id) return;
      /* create live stream to save audio */
      createListeningStream(
        receiver,
        userId,
        interaction.client.users.cache.get(userId)
      );
    });

    /* Return success message */
    return interaction.guild.channels.cache
      .get(interaction.channelId)
      .send(`🎙️ I am now recording ${botVoiceConnection.name}`);
  },
};
