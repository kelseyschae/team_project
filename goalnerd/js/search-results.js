// js/search-results.js

const API_KEY = '693885b9cc4a583bbe109e68dfe39c46';
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;
// ID 140 = La Liga (España)
const LEAGUE_ID = 140;

function createPlayerCardHTML(playerData) {
    const player = playerData.player;
    // Usamos ?. para evitar errores si statistics viene vacío
    const stats = playerData.statistics?.[0];

    const teamName = stats?.team?.name || 'Equipo no disponible';
    const playerPhoto = player.photo;
    const playerPosition = stats?.games?.position || 'N/A';
    const playerAge = player.age || 'N/A';

    const cardHTML = `
        <article class="card animate__animated animate__fadeIn" 
                 style="cursor: pointer;"
                 data-player-id="${player.id}"
                 data-player-name="${player.name}">
            <div class="card-image" style="background-image: url('${playerPhoto}'); 
                                           background-size: cover; 
                                           background-position: center; 
                                           height: 160px;"> 
            </div>
            <div class="card-content">
                <p class="card-label">${teamName}</p>
                <h3 class="card-title">${player.name} (${playerAge} años)</h3>
                <p>${playerPosition}</p>
            </div>
        </article>
    `;
    return cardHTML;
}

async function fetchSearchResults() {
    const gridContainer = document.getElementById('results-grid');
    const queryDisplay = document.getElementById('query-display');

    if (!gridContainer) return;

    // 1. Obtener búsqueda de la URL
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search_query');

    if (!searchQuery) {
        gridContainer.innerHTML = '<p style="text-align:center">No search query provided.</p>';
        return;
    }

    // Actualizar el texto "Showing results for..."
    if (queryDisplay) queryDisplay.textContent = searchQuery;
    gridContainer.innerHTML = '<p style="text-align: center;">Buscando en La Liga...</p>';

    try {
        // AQUÍ ESTÁ EL CAMBIO: Agregamos &league=140
        const url = `${API_BASE_URL}players?search=${searchQuery}&season=${SEASON}&league=${LEAGUE_ID}`;

        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();

        // Verificar errores de la API
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error("API Error:", data.errors);
            gridContainer.innerHTML = `<p style="color: red; text-align: center;">Error de API: ${Object.values(data.errors)[0]}</p>`;
            return;
        }

        const playersData = data.response;

        if (playersData && playersData.length > 0) {
            let allCardsHTML = '';
            playersData.forEach(playerItem => {
                allCardsHTML += createPlayerCardHTML(playerItem);
            });
            gridContainer.innerHTML = allCardsHTML;

            // Click listener para ir a detalles
            gridContainer.addEventListener('click', (event) => {
                const card = event.target.closest('.card');
                if (!card) return;
                const playerId = card.getAttribute('data-player-id');
                const playerName = card.getAttribute('data-player-name');
                if (playerId) {
                    window.location.href = `details.html?type=player&id=${playerId}&name=${encodeURIComponent(playerName)}`;
                }
            });

        } else {
            gridContainer.innerHTML = `<p style="text-align: center;">❌ No se encontraron jugadores llamados "<strong>${searchQuery}</strong>" en La Liga (${SEASON}).</p>`;
        }

    } catch (error) {
        console.error('Error:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Error de conexión. Revisa la consola.</p>';
    }
}

// Menú Hamburguesa
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    navLinks.addEventListener('click', (e) => { e.stopPropagation(); });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchSearchResults();
    initHamburgerMenu();
});