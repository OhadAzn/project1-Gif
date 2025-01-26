const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const favoriteSchema = new mongoose.Schema({ gifUrl: String });
const Favorite = mongoose.model("Favorite", favoriteSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files

// Route: Get random GIF
app.get("/random-gif", async (req, res) => {
    try {
        const apiKey = process.env.GIPHY_API_KEY;
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`);
        const data = await response.json();
        res.json({ gifUrl: data.data.images.original.url });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch random GIF." });
    }
});

// Route: Search for a GIF
app.get("/search-gif", async (req, res) => {
    try {
        const apiKey = process.env.GIPHY_API_KEY;
        const query = req.query.q;
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=1`);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
console.log("GIPHY API Key:", process.env.GIPHY_API_KEY);
console.log("MongoDB URI:", process.env.MONGO_URI);
console.log("Server Port:", process.env.PORT);


// Route: Get the home page (this can be your index page or a simple message)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/pr1.html"); // אם הקובץ ב-public
});
