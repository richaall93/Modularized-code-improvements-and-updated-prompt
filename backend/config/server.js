const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const whisperRouter = require("../api/whisper");
const chatRouter = require("../api/chat");
const ttsRouter = require("../api/tts");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "../../frontend/public")));
app.use("/css", express.static(path.join(__dirname, "../../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../../frontend/js")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/home.html"));
});
app.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/chat.html"));
});

// ✅ API Routes - the whisper endpoint is handled by whisperRouter
app.use("/api/whisper", whisperRouter);
app.use("/api/chat", chatRouter);
app.use("/api/tts", ttsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
