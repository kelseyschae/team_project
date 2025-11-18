const API_KEY = '693885b9cc4a583bbe109e68dfe39c46';
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;

function createPlayerCardHTML(playerData) {
    const player = playerData.player;
    // Check if statistics array exists and has at least one element before accessing team.name
    const teamName = playerData.statistics[0] ? playerData.statistics[0].team.name : 'Team N/A';

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerPosition = player.position || 'N/A';
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
                <h3 class="card-title">${playerName} (${playerAge} years)</h3>
                <p>${playerPosition}</p>
            </div>
        </article>
    `;
    return cardHTML;
}

async function fetchAndDisplayPlayerList() {
    const teamId = 541;
    const playerCount = 20;
    const page = 2;

    const gridContainer = document.getElementById('player-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '<p style="text-align: center;">Loading players...</p>';

    try {
        const url = `${API_BASE_URL}players?team=${teamId}&season=${SEASON}&page=${page}`;
        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();
        const playersData = data.response;

        if (playersData && playersData.length > 0) {
            let allCardsHTML = '';

            for (let i = 0; i < playerCount && i < playersData.length; i++) {
                allCardsHTML += createPlayerCardHTML(playersData[i]);
            }

            gridContainer.innerHTML = allCardsHTML;

            // 👉 Event Delegation: click on any card
            gridContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (!card) return;

                const playerId = card.getAttribute('data-player-id');
                const playerName = card.getAttribute('data-player-name');

                if (!playerId) return;

                window.location.href = `details.html?type=player&id=${playerId}&name=${encodeURIComponent(playerName)}`;
            });

        } else {
            gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: No players found.</p>';
        }
    } catch (error) {
        console.error('Error fetching or displaying players:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Connection error or invalid API Key.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayPlayerList);