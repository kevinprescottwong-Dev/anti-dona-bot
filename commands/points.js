const fs = require("fs");
const path = require("path");

const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const phraseConfig = require("../phrase.config.json");
const data = new SlashCommandBuilder()
  .setName("points")
  .setDescription("Display point info");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async function execute(interaction) {
  const phrasesByRole = {};
  phraseConfig.forEach((phrase) => {
    if (phrasesByRole[phrase.role]) {
      phrasesByRole[phrase.role].push({
        phrase: phrase.display,
        points: phrase.points,
      });
    } else {
      phrasesByRole[phrase.role] = [
        { phrase: phrase.display, points: phrase.points },
      ];
    }
  });

  const eb = new EmbedBuilder().setTitle("Points");
  Object.keys(phrasesByRole).forEach((role) => {
    eb.addFields({
      name: role,
      value: phrasesByRole[role]
        .map((k) => `${k.phrase} = ${k.points} points`)
        .join("\n"),
    });
  });
  return interaction.reply({ embeds: [eb] });
}

module.exports = { data, execute };
