const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const response = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch servers" });
    }
});

module.exports = router;
