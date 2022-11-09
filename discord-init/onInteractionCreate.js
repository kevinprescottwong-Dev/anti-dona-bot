const { Client, Events, Interaction } = require("discord.js");

function onInteractionCreate(
  /** @type {Client} */
  client
) {
  client.on(
    Events.InteractionCreate,
    async (/** @type {Interaction} */ interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  );
}

module.exports = { onInteractionCreate };
