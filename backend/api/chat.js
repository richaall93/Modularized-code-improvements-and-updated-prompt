// api/chat.js - AI French Tutor Backend (ChatGPT API Integration)
const express = require('express');
const router = express.Router();
const axios = require('axios');

const conversationHistory = []; // Store chat history

// GET /api/chat - Handles user messages and streams AI responses via SSE
router.get('/', async (req, res) => {
    try {
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured.' });
        }

        const userMessage = req.query.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'No message provided.' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // ✅ Updated System Prompt: Bilingual French Tutor
        const systemPrompt = `
You are an expert French language tutor with over 10 years of experience. Your goal is to help the user
become fluent in conversational French within 90 days. The user is a complete beginner, so always:

1. Begin with a brief English explanation, then provide the French phrase.
2. **Do NOT** provide any phonetic breakdowns or approximations of French words. 
   - For example, do NOT write "Bonjour" as "bohn-zhoor" or "bo hn -z ho or."
   - Simply say "Bonjour" without any attempt to spell it phonetically.
3. Lead a structured lesson plan:
   - Start with greetings, self-introductions, and basic sentences.
   - Progress to real-world scenarios (ordering food, asking for help, etc.).
   - Encourage repetition, role-playing, and mini quizzes.
4. Gently correct mistakes by showing the correct way, rather than saying "You're wrong."
5. Always maintain a friendly, supportive tone.

**Important**:
- If the user says "Bonjour," do NOT break it down phonetically. Simply acknowledge "Bonjour" means "Hello" in French, 
  and move on to the next step of the lesson.
- Never end with a short, abrupt reply. Always guide the user further in the lesson.

This conversation must remain strictly in these guidelines: 
no phonetic approximations, no partial-syllable breakdowns.
`;

        // ✅ Keep conversation history manageable
        if (conversationHistory.length > 50) {
            conversationHistory.splice(0, conversationHistory.length - 50);
        }

        if (conversationHistory.length === 0) {
            conversationHistory.push({ role: "system", content: systemPrompt });
        }

        conversationHistory.push({ role: "user", content: userMessage });

        // ✅ OpenAI API request
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: conversationHistory,
                temperature: 0.2,
                stream: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openaiApiKey}`,
                },
                responseType: 'stream'
            }
        );

        let aiResponse = '';

        response.data.on("data", (chunk) => {
            const lines = chunk.toString().split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const json = line.replace("data: ", "").trim();
                    if (json === "[DONE]") return; // ✅ Ignore the '[DONE]' event
        
                    try {
                        const parsed = JSON.parse(json);
                        if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
                            const text = parsed.choices[0].delta.content || "";
                            res.write(`data: ${JSON.stringify({ text })}\n\n`);
                        }
                    } catch (err) {
                        console.error("🚨 Error parsing stream chunk:", err);
                    }
                }
            }
        });
        
        response.data.on('end', () => {
            conversationHistory.push({ role: "assistant", content: aiResponse });
            res.write("data: [DONE]\n\n");
            res.end();
        });

        response.data.on('error', (error) => {
            console.error("🚨 Streaming Error:", error);
            res.write("data: [ERROR]\n\n");
            res.end();
        });

    } catch (error) {
        console.error('🚨 Chat route error:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get ChatGPT response.' });
    }
});

module.exports = router;
