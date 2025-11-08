const API_KEY = 'e37194af7ec1ed8077729487376e4934';
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;

function createPlayerCardHTML(playerData) {
    const player = playerData.player;
    const teamName = playerData.statistics[0] ? playerData.statistics[0].team.name : 'Team N/A';

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerPosition = player.position || 'N/A';
    const playerAge = player.age || 'N/A';

    const cardHTML = `
        <article class="card">
            <div class="card-image" style="background-image: url('${playerPhoto}'); 
                                           background-size: cover; 
                                           background-position: center; 
                                           background-color: transparent;
                                           height: 160px;"> 
            </div>
            <div class="card-content">
                <p class="card-label">${teamName}</p>
                <h3 class="card-title">${playerName} (${playerAge} años)</h3>
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

    gridContainer.innerHTML = '<p style="text-align: center;">Cargando jugadores...</p>';

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

        } else {
            gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: No se encontraron jugadores.</p>';
        }
    } catch (error) {
        console.error('Error al obtener o mostrar jugadores:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error de conexión o API Key inválida.</p>';
    }
}

// --- INICIO ---
document.addEventListener('DOMContentLoaded', fetchAndDisplayPlayerList);
