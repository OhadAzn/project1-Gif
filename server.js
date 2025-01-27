const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const path = require("path");
require('dotenv').config();  // טוען את קובץ ה-.env אם יש כזה

const app = express();
const PORT = process.env.PORT || 3000;

// שימוש במפתח GIPHY ו-URI של MongoDB שנמצאים בקובץ ה-.env או ערכים דיפולטיביים
const GIPHY_API_KEY = process.env.GIPHY_API_KEY || "qSRe9GfEfwtU1DCX9XAYMfygYASbW0Fw";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gif_manager";  // תיקון הבעיה כאן

console.log("Mongo URI:", MONGO_URI);
// Route for the homepage (prt1.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pr1.html"));
});

// התחברות ל-MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// הגדרת מודל ה-GIF המועדף
const favoriteSchema = new mongoose.Schema({ gifUrl: String });
const Favorite = mongoose.model("Favorite", favoriteSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // גישה לתיקיית public בה נמצאים קבצי הסטטיים

// Route for the homepage (prt1.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "prt1.html"));
});

// Route: Get random GIF
app.get("/random-gif", async (req, res) => {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}`);
        const data = await response.json();
        res.json({ gifUrl: data.data.images.original.url });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch random GIF." });
    }
});

// Route: Search for a GIF
app.get("/search-gif", async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=1`);
        const data = await response.json();
        const gifUrl = data.data[0]?.images.original.url;
        res.json({ gifUrl });
    } catch (error) {
        res.status(500).json({ error: "Failed to search for GIF." });
    }
});

// Route: Get favorite GIFs
app.get("/favorites", async (req, res) => {
    try {
        const favorites = await Favorite.find();
        const gifUrls = favorites.map((fav) => fav.gifUrl);
        res.json(gifUrls);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch favorites." });
    }
});

// Route: Add a favorite GIF
app.post("/favorites", async (req, res) => {
    try {
        const { gifUrl } = req.body;
        const existing = await Favorite.findOne({ gifUrl });
        if (!existing) {
            await Favorite.create({ gifUrl });
            res.status(201).json({ message: "GIF saved to favorites." });
        } else {
            res.status(400).json({ message: "GIF already in favorites." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to save favorite GIF." });
    }
});

// Route: Delete a favorite GIF
app.delete('/favorites', async (req, res) => {
    const { gifUrl } = req.body;
    try {
        const result = await Favorite.deleteOne({ gifUrl });
        res.status(200).json({ message: "GIF deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete GIF" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
