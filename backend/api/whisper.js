const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");  // <-- Import form-data

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded." });
  }

  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // Build multipart/form-data
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path), {
      // Optional: specify the original filename & mime type
      filename: req.file.originalname || "recording.webm",
      contentType: req.file.mimetype,
    });
    formData.append("model", "whisper-1");

    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        ...formData.getHeaders(), // Ensures correct multipart boundary
      },
    });

    // Return the result using the same key your client expects (e.g. "transcription")
    res.json({ transcription: response.data.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Speech recognition failed" });
  }
});

module.exports = router;
