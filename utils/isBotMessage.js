function isBotMessage(client, message) {
  if (!client) {
    console.trace("No client provided");
    return false;
  }

  if (!message) {
    console.trace("No message provided");
    return false;
  }

  if (message.author.equals(client.user)) {
    console.warn("Warn! Received message from self; will not respond.");
    return true;
  }

  return false;
}

module.exports = { isBotMessage };
