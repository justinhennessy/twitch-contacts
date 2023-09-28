from typing import Callable
from twitchio.ext import commands
import os
from dotenv import load_dotenv
from twitchio.user import User
import requests
import json
from oauth import request_oauth_token

class Bot(commands.Bot):
    
    def __init__(self):
        # Initialise our Bot with our access token, prefix and a list of channels to join on boot...
        # prefix can be a callable, which returns a list of strings or a string...
        # initial_channels can also be a callable which returns a list of strings...
        load_dotenv()
        twitch_oauth_token = os.getenv("TWITCH_OAUTH_TOKEN")
        twitch_channel_name = os.getenv("TWITCH_CHANNEL_NAME")
        self.url = "http://localhost:3000/message_count"
        
        super().__init__(token=twitch_oauth_token, prefix='?', initial_channels=[twitch_channel_name])

    async def event_ready(self):
        # Notify us when everything is ready!
        # We are logged in and ready to chat and use commands...
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')

    async def event_message(self, message):
        # Messages with echo set to True are messages sent by the bot...
        # For now we just want to ignore them...
        if message.echo:
            return

        data = {"username": self.nick}
        
        response = requests.post(self.url, json=data)
        
        if response.status_code == 200:
            print(f"Message count incremented for user: {self.nick}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
            
        await self.handle_commands(message)

from dotenv import load_dotenv
load_dotenv()

bot = Bot()
request_oauth_token()
bot.run()