require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Detection = require("./backend tries/schema.js");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FLASK_API_URL = process.env.FLASK_API_URL;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(" MongoDB Connection Error:", err));

app.use(cors());
app.use(express.json());



app.post("/api/fakenews", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    try {
        const response = await axios.post(`${FLASK_API_URL}/fakenews`, { text });

        const { isFake, confidence } = response.data;
        const newDetection = new Detection({ type: "news", data: text, isAuthentic: !isFake, confidence });
        await newDetection.save();

        res.json({ isAuthentic: !isFake, confidence, message: isFake ? "Fake news detected" : "News appears authentic" });

    } catch (error) {
        console.error(" Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});


app.post("/api/deepfake", async (req, res) => {
    const { mediaType, mediaData } = req.body;
    if (!mediaType || !mediaData) return res.status(400).json({ error: "Invalid input" });

    try {
        const response = await axios.post(`${FLASK_API_URL}/deepfake/${mediaType}`, { mediaData });

        const { confidence, message } = response.data;
        const isAuthentic = confidence > 50; 

        const newDetection = new Detection({ type: mediaType, data: mediaData, isAuthentic, confidence, message });
        await newDetection.save();

        res.json({ isAuthentic, confidence, message });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});




app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));