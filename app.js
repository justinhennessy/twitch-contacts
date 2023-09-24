const http = require('http');
const fs = require('fs');
const path = require('path');
const tmi = require('tmi.js');
const dotenv = require('dotenv');
const util = require('util');
const yaml = require('js-yaml');

const express = require('express');
const app = express();

dotenv.config();

const requestOAuthToken = require('./oauth');

requestOAuthToken()
    .then(() => {
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
        function onConnectedHandler(addr, port) {
            console.log(`* Connected to ${addr}:${port}`);
        }
    })
    .catch((error) => {
        console.error('Error while requesting OAuth token:', error);
    });


const yamlStr = fs.readFileSync('people.yaml', 'utf8');

class Person {
    constructor(username, realName, location = '', chatter_type = 'unknown', interaction_count = 0, aspirations = '', song_requests = [], journal = [], message_count = 0) {
        this.username = username;
        this.realName = realName;
        this.location = location;
        this.chatter_type = chatter_type;
        this.interaction_count = interaction_count;
        this.aspirations = aspirations;
        this.song_requests = song_requests;
        this.message_count = message_count;
        this.journal = journal;
    }
}

function loadPeopleDataFromYaml(yamlStr) {
  const data = yaml.load(yamlStr);
  console.log('loading data ...');

  console.log(util.inspect(data, { depth: null }))

  return data.people.map(personData => {

      let songRequests = [];
      if (personData.song_requests) {
        const songRequests = personData.song_requests.map(request => {
            return {
                date: request.Date,
                 entry: request.Entry
            };
        });
      }

      let journal = [];
      if (personData.journal) {
        const journal = personData.journal.map(journalEntry => {
            return {
                date: journalEntry.Date,
                entry: journalEntry.Entry
            };
        });
      }

      return new Person(
          personData.username,
          personData.realName,
          personData.location,
          personData.chatter_type,
          personData.first_chatted,
          personData.last_chatted,
          personData.interaction_count || 0,
          personData.aspirations,
          songRequests,
          journal,
          0
      );
  });
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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // console.log('Request URL:', req.url); // Log the requested URL
  next();
});

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
      if (err) {
          res.status(500).send(`Error loading ${indexPath}`);
      }
  });
});

// app.post('/log', (req, res) => {
//   let body = '';
//     req.on('data', chunk => {
//       body += chunk.toString();
//     });
//     req.on('end', () => {
//       const data = JSON.parse(body);
//       console.log('Data logged from client:', util.inspect(data, { depth: null }));
//       res.end();
//     });
//   console.log(message_count);
// });
// 

app.post('/log', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    const logMessage = 'Data logged from client: ' + util.inspect(data, { depth: null });

    // Log to console
    console.log(logMessage);

    // Convert data to YAML
    const yamlStr = yaml.dump(data);

    // Write to update.yaml (write-only, not append)
    fs.writeFile('update.yaml', yamlStr, { flag: 'w' }, (err) => {
      if (err) throw err;
    });

    res.end();
  });
});

// Expose message_count as a JSON endpoint
app.get('/message_count', (req, res) => {
    res.json(message_count);
    // console.log(message_count);
});

// Expose people as a JSON endpoint
app.get('/people', (req, res) => {
    const parsedYaml = yaml.load(yamlStr);
    const people = parsedYaml.people;
    console.log(people);
    res.json(people);
});

// Create an HTTP server that uses the Express app
const server = http.createServer((req, res) => {


    // Let Express app handle the request and response
    app(req, res);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
