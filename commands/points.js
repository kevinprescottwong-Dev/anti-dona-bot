const fs = require("fs");
const path = require("path");

const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const banConfig = require("../banned.json");
const data = new SlashCommandBuilder()
  .setName("points")
  .setDescription("Display point info");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async function execute(interaction) {
  const phrasesByRole = {};
  banConfig.forEach((bc) => {
    if (phrasesByRole[bc.role]) {
      phrasesByRole[bc.role].push({ phrase: bc.display, points: bc.points });
    } else {
      phrasesByRole[bc.role] = [{ phrase: bc.display, points: bc.points }];
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
