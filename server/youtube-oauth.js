const express = require('express');
const { google } = require('googleapis');
const app = express();

const CLIENT_ID = '467978396644-5hcefs8utp5n74mebfq1ovjdh2rhpnnj.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; // Change to your redirect URI

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Step 1: Redirect user to Google's OAuth 2.0 server
app.get('/auth/youtube', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly'
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

// Step 2: Handle OAuth 2.0 server response
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Save tokens for future use
  res.send('Authentication successful! You can close this window.');
});

app.listen(3000, () => console.log('OAuth server running on http://localhost:3000'));
