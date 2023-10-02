from typing import Callable
from twitchio.ext import commands
import os
from dotenv import load_dotenv
from twitchio.user import User
import requests
import json
from oauth import request_oauth_token
import pprint
import logging  # New import for logging

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler('bot.log', encoding='utf-8'), logging.StreamHandler()])

logger = logging.getLogger(__name__)

class Bot(commands.Bot):
    
    def __init__(self):
        load_dotenv()
        twitch_oauth_token = os.getenv("TWITCH_OAUTH_TOKEN")
        twitch_channel_name = os.getenv("TWITCH_CHANNEL_NAME")
        self.url = "http://localhost:3000/message_count"
        
        super().__init__(token=twitch_oauth_token, prefix='?', initial_channels=[twitch_channel_name])

    async def event_ready(self):
        logger.info(f'Logged in as | {self.nick}')
        logger.info(f'User id is | {self.user_id}')

    async def event_message(self, message):
        if message.echo:
            return

        data = {"username": message.author.name}
        logger.info(f"Received message from {message.author.name}")
        
        response = requests.post(self.url, json=data)
        
        if response.status_code == 200:
            logger.info(f"Attempting to increment message count for user: {message.author.name}")
        else:
            logger.error(f"Error: {response.status_code} - {response.text}")
            
        await self.handle_commands(message)

load_dotenv()

bot = Bot()
request_oauth_token()
bot.run()
