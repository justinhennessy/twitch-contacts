const http = require('http');
const fs = require('fs');
const path = require('path');
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

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    }

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

const server = http.createServer((req, res) => {
  // Serve index.html for the root path
  if (req.url === '/') {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${indexPath}`);
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }

  // Expose message_count as a JSON endpoint
  if (req.url === '/message_count') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(message_count));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
