const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

router.post('/chat', authenticate, async (req, res, next) => {
    try {
        const { messages } = req.body;
        
        // Dynamic Reload Logic: If the process doesn't have the key, pull it directly from the file.
        // This solves the issue if the user forgot to restart the server.
        let apiKey = process.env.GROK_API_KEY;
        
        if (!apiKey) {
            try {
                const envPath = path.resolve(__dirname, '../../../.env');
                const envContent = fs.readFileSync(envPath, 'utf8');
                const match = envContent.match(/^GROK_API_KEY=(.*)$/m);
                if (match) apiKey = match[1].trim();
            } catch (e) {
                console.error("Direct .env read failed:", e.message);
            }
        }

        console.log("Arya Engine: Live request diagnostic. API Key Found:", !!apiKey);

        if (!apiKey) {
            return res.status(500).json({ 
                success: false, 
                message: "GROK_API_KEY is not configured in backend/.env" 
            });
        }

        const response = await axios.post("https://api.x.ai/v1/chat/completions", {
            model: "grok-3-mini", // Latest high-speed flagship for 2026
            messages: messages,
            stream: false
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            }
        });

        res.status(200).json({ 
            success: true, 
            data: response.data.choices[0].message.content 
        });

    } catch (err) {
        const errorData = err.response?.data || err.message;
        console.error("Grok Proxy Critical Failure:", JSON.stringify(errorData));
        
        res.status(err.response?.status || 500).json({ 
            success: false, 
            message: "Grok is currently offline. Please check your API key or connection.",
            debug: errorData
        });
    }
});

module.exports = router;
