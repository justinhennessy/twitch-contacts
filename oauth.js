const fetch = require('node-fetch');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

async function requestOAuthToken() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const refreshToken = process.env.TWITCH_REFRESH_TOKEN;

    // Check if the access token has expired
    const accessToken = process.env.TWITCH_OAUTH_TOKEN;
    if (accessToken) {
        const validateUrl = 'https://id.twitch.tv/oauth2/validate';
        const validateResponse = await fetch(validateUrl, {
            headers: {
                'Authorization': `OAuth ${accessToken}`,
            },
        });

        if (validateResponse.status === 200) {
            console.log('Access token is still valid.');
            return;
        }
    }

    // If the access token has expired, refresh it
    const tokenUrl = 'https://id.twitch.tv/oauth2/token';
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const tokenData = await tokenResponse.json();

    // Update environment variables
    const newAccessToken = tokenData.access_token;
    const newRefreshToken = tokenData.refresh_token;

    // Updating the .env file with the new access and refresh tokens
    const fileContent = fs.readFileSync('.env', 'utf8');
    const newFileContent = fileContent.replace(/TWITCH_OAUTH_TOKEN=.*/, `TWITCH_OAUTH_TOKEN=${newAccessToken}`).replace(/TWITCH_REFRESH_TOKEN=.*/, `TWITCH_REFRESH_TOKEN=${newRefreshToken}`);
    fs.writeFileSync('.env', newFileContent);

    console.log('Access token and refresh token updated.');
}

module.exports = requestOAuthToken;
