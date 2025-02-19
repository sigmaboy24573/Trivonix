const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://your-vercel-site.vercel.app/api/auth/callback";

router.get('/', (req, res) => {
    const discordAuthURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    res.redirect(discordAuthURL);
});

router.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.send("No code provided!");

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
        });

        res.send(`Welcome, ${userResponse.data.username}! <a href="/dashboard">Go to Dashboard</a>`);
    } catch (err) {
        console.error(err);
        res.send("Error logging in!");
    }
});

module.exports = router;
