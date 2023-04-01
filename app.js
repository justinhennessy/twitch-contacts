const http = require('http');
const fs = require('fs');
const path = require('path');
const tmi = require('tmi.js');
const dotenv = require('dotenv');
const yaml = require('js-yaml');

const express = require('express');
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

dotenv.config();

const requestOAuthToken = require('./oauth');

requestOAuthToken()
    .then(() => {
        // Define configuration options
        const opts = {
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: process.env.TWITCH_OAUTH_TOKEN
                //password: '4frmcsnglmi370n8sjupfh95m3zlsc'
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


class Person {
    constructor(username, realName, location = '', chatter_type = 'unknown', aspirations = '', song_requests = [], journal = [], message_count = 0) {
        this.username = username;
        this.realName = realName;
        this.location = location;
        this.chatter_type = chatter_type;
        this.aspirations = aspirations;
        this.song_requests = song_requests;
        this.message_count = message_count;
        this.journal = journal;
    }
}

function loadPeopleDataFromYaml(yamlStr) {
    const data = yaml.load(yamlStr);
    console.log('loading data ...')

    return data.people.map(personData => {
        return new Person(
            personData.username,
            personData.realName,
            personData.location,
            personData.chatter_type,
            personData.aspirations,
            personData.song_requests,
            personData.journal || [],
            0
        );
    });
}

const yamlStr = `
people:
  - username: 'JustinHennessy'
    realName: 'Justin'
    chatter_type: 'known'
    location: Brisbane
  - username: 'Christian12wg'
    realName: ''
    location: ''
    chatter_type: 'known'
    aspirations: 'Working on a career in Counter Strike GO'
    song_requests:
      - 'Wallows - Remember When'
    journal:
      - 'Doing year 12'
      - 'Doing math and physics'
      - 'He asked me to do something with Wallows - Remember When'
  - username: 'NightBot'
    realName: ''
    chatter_type: 'unknown'
  - username: 'allistair10'
    realName: 'Eden'
    chatter_type: 'known'
  - username: 'nbclimbrr'
    realName: ''
    location: 'New Zealand (find out the proper name she says)'
    chatter_type: 'known'
    aspirations: 'To get into the tech industry'
  - username: 'SonglistBot'
    realName: ''
    location: 'cyber space'
    chatter_type: 'bot'
  - username: 'RecklessPelican'
    realName: ''
    location: ''
    chatter_type: 'known'
`;

// let people = loadPeopleDataFromYaml(yamlStr);
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
        const indexPath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(indexPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(`Error loading ${indexPath}`);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // Expose message_count as a JSON endpoint
    if (req.url === '/message_count') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(message_count));
        console.log(message_count)
    }

    if (req.url === '/people') {

        const people = [
            {
              username: 'JustinHennessy',
              realName: 'Justin',
              location: 'Brisbane',
              chatter_type: 'known',
              aspirations: '',
              song_requests: [],
              message_count: 0,
              journal: []
            },
            {
              username: 'Christian12wg',
              realName: '',
              location: '',
              chatter_type: 'known',
              aspirations: 'Working on a career in Counter Strike GO',
              song_requests: ['Wallows - Remember When'],
              message_count: 0,
              journal: [
                'Doing year 12',
                'Doing math and physics',
                'He asked me to do something with Wallows - Remember When'
              ]
            },
            {
              username: 'Nightbot',
              realName: '',
              location: '',
              chatter_type: 'unknown',
              aspirations: '',
              song_requests: [],
              message_count: 0,
              journal: []
            },
            {
              username: 'allistair10',
              realName: 'Eden',
              location: '',
              chatter_type: 'known',
              aspirations: '',
              song_requests: [],
              message_count: 0,
              journal: []
            },
            {
              username: 'nbclimbrr',
              realName: '',
              location: 'New Zealand (find out the proper name she says)',
              chatter_type: 'known',
              aspirations: 'To get into the tech industry',
              song_requests: [],
              message_count: 0,
              journal: []
            },
            {
              username: 'SonglistBot',
              realName: '',
              location: 'cyber space',
              chatter_type: 'bot',
              aspirations: '',
              song_requests: [],
              message_count: 0,
              journal: []
            },
            {
              username: 'RecklessPelican',
              realName: '',
              location: '',
              chatter_type: 'known',
              aspirations: '',
              song_requests: [],
              message_count: 0,
              journal: []
            }
          ];

        console.log(people)

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(people));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
