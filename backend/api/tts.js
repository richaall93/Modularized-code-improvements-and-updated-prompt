const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const text = req.body.text;
    if (!text) return res.status(400).json({ error: 'No text provided for TTS.' });

    try {
        const openaiApiKey = process.env.OPENAI_API_KEY;
        const response = await axios.post(
            "https://api.openai.com/v1/audio/speech",
            { model: "tts-1", input: text, voice: "nova" },
            { headers: { Authorization: `Bearer ${openaiApiKey}` }, responseType: "arraybuffer" }
        );

        res.set("Content-Type", "audio/mpeg");
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: "TTS generation failed" });
    }
});

module.exports = router;
