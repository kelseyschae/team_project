// Reusing API constants from other files (assume they are defined here for simplicity)
const API_KEY = 'e37194af7ec1ed8077729487376e4934';
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;

// --- Function to create player card HTML (Copied from players.js) ---
function createPlayerCardHTML(playerData) {
    const player = playerData.player;
    // Note: Search results usually contain an array of statistics for various teams/leagues.
    // We'll just display the first one for simplicity.
    const teamName = playerData.statistics[0] ? playerData.statistics[0].team.name : 'Team N/A';

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerPosition = playerData.statistics[0] ? playerData.statistics[0].games.position : 'N/A';
    const playerAge = player.age || 'N/A';

    const cardHTML = `
        <article class="card"
                 data-player-id="${player.id}"
                 data-player-name="${playerName}">
            <div class="card-image" style="background-image: url('${playerPhoto}'); 
                                           background-size: cover; 
                                           background-position: center; 
                                           background-color: transparent;
                                           height: 160px;"> 
            </div>
            <div class="card-content">
                <p class="card-label">${teamName}</p>
                <h3 class="card-title">${playerName} (${playerAge} años)</h3>
                <p>${playerPosition}</p>
            </div>
        </article>
    `;
    return cardHTML;
}
// ---------------------------------------------------------------------

async function fetchSearchResults() {
    const gridContainer = document.getElementById('results-grid');
    const queryDisplay = document.getElementById('query-display');

    // 1. Get the search query from the URL
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search_query');

    if (!gridContainer || !queryDisplay || !searchQuery) {
        if (gridContainer) gridContainer.innerHTML = '<p style="text-align: center;">No search query provided.</p>';
        return;
    }

    queryDisplay.textContent = searchQuery;
    gridContainer.innerHTML = '<p style="text-align: center;">Searching for players...</p>';

    try {
        // 2. API Endpoint for searching players by name
        // La API de Football-API-Sports no tiene un endpoint de 'búsqueda universal', así que buscamos solo jugadores por nombre.
        const url = `${API_BASE_URL}players?search=${searchQuery}&season=${SEASON}`;
        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();
        const playersData = data.response;

        if (playersData && playersData.length > 0) {
            let allCardsHTML = '';

            playersData.forEach(playerItem => {
                allCardsHTML += createPlayerCardHTML(playerItem);
            });

            gridContainer.innerHTML = allCardsHTML;

            // 3. Add event listener to results for navigation (Delegation)
            gridContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (!card) return;

                const playerId = card.getAttribute('data-player-id');
                const playerName = card.getAttribute('data-player-name');

                if (!playerId) return;

                window.location.href = `details.html?type=player&id=${playerId}&name=${encodeURIComponent(playerName)}`;
            });

        } else {
            gridContainer.innerHTML = `<p style="text-align: center;">❌ No results found for **${searchQuery}**.</p>`;
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Connection Error or Invalid API Key.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchSearchResults);