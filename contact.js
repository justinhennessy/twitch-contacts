const tmi = require('tmi.js');

// Define configuration options
const opts = {
    identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
    process.env.TWITCH_CHANNEL_NAME
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const message_count = {}; // Initialize the message_count object
const unique_chatters = {};

function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  chatter = context['display-name']

  // Update the message_count for the current target
  if (message_count[chatter]) {
    message_count[chatter]++;
  } else {
    message_count[chatter] = 1;
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
console.log(`* Connected to ${addr}:${port}`);
}
