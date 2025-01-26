// Get buttons, input, and containers from the page
const getGifBtn = document.getElementById('getGifBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const gifContainer = document.getElementById('gifContainer');
const favoritesContainer = document.getElementById('favoritesContainer');

// Show all favorite GIFs
async function showFavorites() {
    const response = await fetch('/favorites'); // בקשה לשרת להחזיר GIFים מועדפים
    const favorites = await response.json();
    favoritesContainer.innerHTML = '';
    for (let url of favorites) {
        const img = document.createElement('img');
        img.src = url;
        favoritesContainer.appendChild(img);
    }
}

// Save a GIF to favorites
async function saveToFavorites(gifUrl) {
    const response = await fetch('/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gifUrl }),
    });

    if (response.ok) {
        showFavorites();
        alert('GIF saved to favorites!');
    } else {
        alert('Failed to save GIF.');
    }
}

// Get a random GIF and show it
getGifBtn.addEventListener('click', async () => {
    const response = await fetch('/random-gif'); // בקשה לשרת לקבל GIF אקראי
    const data = await response.json();
    const gifUrl = data.gifUrl;

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

    const response = await fetch(`/search-gif?q=${searchTerm}`); // בקשה לשרת לחיפוש GIF
    const data = await response.json();
    const gifUrl = data.gifUrl;

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
