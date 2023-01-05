const client = require("./client");
const { token } = require("./config.json");

// Log in to Discord with your client's token
client.login(token);
