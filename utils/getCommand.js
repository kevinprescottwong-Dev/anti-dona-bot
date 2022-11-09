async function getCommandAsync(client, commandName) {
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${commandName} was found.`);
    return;
  }

  return command;
}

module.exports = { getCommandAsync };
