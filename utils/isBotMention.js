function isBotMention(client, message) {
  if (!client) {
    console.trace("No client provided");
    return false;
  }

  if (!message) {
    console.trace("No message provided");
    return false;
  }

  if (message.content.startsWith(`<@${client.id}>`)) {
    return true;
  }

  return false;
}

module.exports = { isBotMention };
