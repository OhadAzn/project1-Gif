// API key for Giphy
const apiKey = "qSRe9GfEfwtU1DCX9XAYMfygYASbW0Fw";

// Get buttons, input, and containers from the page
const getGifBtn = document.getElementById('getGifBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const gifContainer = document.getElementById('gifContainer');
const favoritesContainer = document.getElementById('favoritesContainer');

// Load saved favorite GIFs or start with an empty list
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Show all favorite GIFs
function showFavorites() {
    favoritesContainer.innerHTML = '';
    for (let url of favorites) {
        const img = document.createElement('img');
        img.src = url;
        favoritesContainer.appendChild(img);
    }
}

// Save a GIF to favorites
function saveToFavorites(gifUrl) {
    if (!favorites.includes(gifUrl)) {
        favorites.push(gifUrl);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showFavorites();
        alert('GIF saved to favorites!');
    } else {
        alert('GIF is already in favorites.');
    }
}

// Get a random GIF and show it
getGifBtn.addEventListener('click', async () => {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`);
    const data = await response.json();
    const gifUrl = data.data.images.original.url;

    gifContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = gifUrl;
    gifContainer.appendChild(img);

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save to Favorites';
    saveBtn.onclick = () => saveToFavorites(gifUrl);
    gifContainer.appendChild(saveBtn);
});

// Search for a GIF and show the first result
searchBtn.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        alert('Please enter a search term!');
        return;
    }

    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=1`);
    const data = await response.json();
    const gifUrl = data.data[0]?.images.original.url;

    gifContainer.innerHTML = '';
    if (gifUrl) {
        const img = document.createElement('img');
        img.src = gifUrl;
        gifContainer.appendChild(img);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save to Favorites';
        saveBtn.onclick = () => saveToFavorites(gifUrl);
        gifContainer.appendChild(saveBtn);
    } else {
        gifContainer.textContent = 'No GIF found.';
    }
});

// Show favorites when the page loads
showFavorites();
