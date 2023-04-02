# twitch-contacts

## TODO


## Ideas
[ ] When a chatter's first_chatted date is 365 days ago send them a happy anniversary
[ ] if someone requests a song via !sr, log it on their record as they last requested song

## Done
[x] when someone gets added to the list and becomes known, start tracking the last time they were in chat
[x] Click on the circle when they are unknown to make them known, this will change them from grey to blue, set the "first_chat" date
[x] interaction count, this is to help indentify high traffic people that you should know better,
    this will also affect how their item is rendered
[x] add a date component to the journaling?
[x] Date the chatter when they first appear in chat and you engage with them
[x] When displaying the first_appear date, make it number of days from that date
[x] Do the same for the last in chat

## Setup
brew install node.js

npm install tmi.js

## Running the server locally

Environment Vars:
TWITCH_BOT_USERNAME=
TWITCH_OAUTH_TOKEN=
TWITCH_CHANNEL_NAME=

Command to run server
TWITCH_BOT_USERNAME=xxx TWITCH_OAUTH_TOKEN=xxx TWITCH_CHANNEL_NAME=xxx node contact.js

## Create a Twitch Development App

Go here

https://dev.twitch.tv/console/apps

And register your application

Once that is done you will be able to "manage" your application and get a `client_id` and gnerate a `client_secret` which you will need later in the piece.

## Authoizing and authenticating

Put this into the browser, replace `client_id` with the client_id that you obtained above

https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=tukkqxvf7ij8fx1goghhg49nn9m13n&redirect_uri=http://localhost:5000&scope=chat%3Aread&state=c3ab8aa609ea11e793ae92361f002671

This will return you another URL in the browser, it will look like its errored by its part of the parameters you want

http://localhost:3000/?code=<code>&scope=chat%3Aread&state=c3ab8aa609ea11e793ae92361f002671

this will generate `<code>`, make note of that

To obtain your access and refresh tokens you can then run, you will need to fill in `client_id`, `client_secret` and `code` all obtained above

curl -X POST 'https://id.twitch.tv/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'client_id=<client_id>&client_secret=<client_secret>&code=<code>&grant_type=authorization_code&redirect_uri=http://localhost:3000'

This will return some thing like this:

`{"access_token":"xxx","expires_in":14084,"refresh_token":"xxx","scope":["channel:manage:polls","channel:read:polls"],"token_type":"bearer"}`

The `access_token` is what you will use to config `TWITCH_OAUTH_TOKEN` above.

curl -X POST 'https://id.twitch.tv/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
-d 'client_id=<client_id>&client_secret=<client_secret>&code=<code>&grant_type=authorization_code&redirect_uri=http://localhost:3000'


{"access_token":"xxx","expires_in":14606,"refresh_token":"xxx","scope":["chat:read"],"token_type":"bearer"}


TWITCH_BOT_USERNAME=justinhennessy TWITCH_OAUTH_TOKEN=jxnderk442p7sc3q23zccn3vfbvg9m TWITCH_CHANNEL_NAME=justinhennessy node contact.js