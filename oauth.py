import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

def request_oauth_token():
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    refresh_token = os.getenv("TWITCH_REFRESH_TOKEN")

    # Check if the access token has expired
    access_token = os.getenv("TWITCH_OAUTH_TOKEN")
    if access_token:
        validate_url = 'https://id.twitch.tv/oauth2/validate'
        validate_response = requests.get(validate_url, headers={'Authorization': f'OAuth {access_token}'})

        if validate_response.status_code == 200:
            print('Access token is still valid.')
            return

    # If the access token has expired, refresh it
    token_url = 'https://id.twitch.tv/oauth2/token'
    token_response = requests.post(token_url, headers={'Content-Type': 'application/x-www-form-urlencoded'}, data={
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
    })

    token_data = token_response.json()

    # Update environment variables
    new_access_token = token_data['access_token']
    new_refresh_token = token_data['refresh_token']

    # Updating the .env file with the new access and refresh tokens
    with open('.env', 'r') as file:
        file_content = file.read()

    file_content = re.sub(r'TWITCH_OAUTH_TOKEN=.*', f'TWITCH_OAUTH_TOKEN={new_access_token}', file_content)
    file_content = re.sub(r'TWITCH_REFRESH_TOKEN=.*', f'TWITCH_REFRESH_TOKEN={new_refresh_token}', file_content)

    with open('.env', 'w') as file:
        file.write(file_content)

    print('Access token and refresh token updated.')


if __name__ == "__main__":
    request_oauth_token()
