// js/details.js

const API_KEY = '693885b9cc4a583bbe109e68dfe39c46';
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;

// --- Read URL parameters: ?type=team&id=33&name=Barcelona
const params = new URLSearchParams(window.location.search);
const type = params.get('type'); // "team" or "player"
const id = params.get('id');     // numeric API id
const nameFromUrl = params.get('name'); // optional

// --- DOM elements
const titleEl = document.getElementById('details-title');
const subtitleEl = document.getElementById('details-subtitle');
const typeEl = document.getElementById('details-type');
const nameEl = document.getElementById('details-name');
const meta1El = document.getElementById('details-meta-1');
const meta2El = document.getElementById('details-meta-2');
const statsListEl = document.getElementById('details-stats-list');
const imageContainerEl = document.getElementById('details-image-container');

// --- Initial state if data is missing
if (!type || !id) {
    titleEl.textContent = 'No data available';
    subtitleEl.textContent = 'We could not find a team or player. Please go back and try again.';
} else {
    const niceType = type === 'team' ? 'Team' : 'Player';
    titleEl.textContent = `${niceType} Details`;
    typeEl.textContent = niceType;
    if (nameFromUrl) {
        nameEl.textContent = nameFromUrl;
    }
}

async function loadDetails() {
    if (!type || !id) return;

    try {
        let url = '';

        if (type === 'team') {
            // API-Football Teams Endpoint
            url = `${API_BASE_URL}teams?id=${id}`;
        } else {
            // API-Football Players Endpoint
            url = `${API_BASE_URL}players?id=${id}&season=${SEASON}`;
        }

        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();

        const list = data.response;
        if (!list || list.length === 0) {
            subtitleEl.textContent = 'No details found for this item.';
            return;
        }

        if (type === 'team') {
            fillTeamDetails(list[0]);
        } else {
            fillPlayerDetails(list[0]);
        }

        subtitleEl.textContent = 'Here are the latest details and stats.';

    } catch (err) {
        console.error('Error loading details:', err);
        subtitleEl.textContent = 'There was an error loading the details.';
    }
}

// --- Fill TEAM details ---
function fillTeamDetails(item) {
    const team = item.team;   // { id, name, logo, country, founded, ... }
    const venue = item.venue; // { name, city, capacity, ... }

    if (!nameFromUrl && team && team.name) {
        nameEl.textContent = team.name;
    }

    typeEl.textContent = 'Team';
    titleEl.textContent = `Team: ${team.name}`;

    // Image / logo
    if (team.logo && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${team.logo}')`;
        imageContainerEl.style.backgroundSize = 'contain';
        imageContainerEl.style.backgroundRepeat = 'no-repeat';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'var(--white)';
    }

    // Meta info
    meta1El.textContent = team.country ? `Country: ${team.country}` : '';
    meta2El.textContent = team.founded ? `Founded: ${team.founded}` : '';

    // Stats / extra info
    statsListEl.innerHTML = '';

    if (venue) {
        if (venue.name) {
            addStatItem(`Stadium: ${venue.name}`);
        }
        if (venue.city) {
            addStatItem(`City: ${venue.city}`);
        }
        if (venue.capacity) {
            addStatItem(`Capacity: ${venue.capacity}`);
        }
    }

    if (!statsListEl.innerHTML) {
        addStatItem('No additional stats available for this team.');
    }
}

// --- Fill PLAYER details ---
function fillPlayerDetails(item) {
    const player = item.player;              // { id, name, age, nationality, photo, ... }
    const stats = item.statistics && item.statistics[0]; // main stats

    let displayName = player.name || nameFromUrl || 'Unknown player';
    if (player.age) {
        displayName += ` (${player.age} years)`;
    }

    nameEl.textContent = displayName;
    typeEl.textContent = 'Player';
    titleEl.textContent = `Player: ${player.name}`;

    // Player image
    if (player.photo && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${player.photo}')`;
        imageContainerEl.style.backgroundSize = 'cover';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'transparent';
    }

    // Meta info
    const teamName = stats && stats.team ? stats.team.name : 'N/A';
    const position =
        (stats && stats.games && stats.games.position) ||
        player.position ||
        'N/A';

    meta1El.textContent = `Team: ${teamName}`;
    meta2El.textContent = `Position: ${position} | Nationality: ${player.nationality || 'N/A'}`;

    // Main stats
    statsListEl.innerHTML = '';

    if (stats && stats.games) {
        if (stats.games.appearences != null) {
            addStatItem(`Appearances: ${stats.games.appearences}`);
        }
        if (stats.games.minutes != null) {
            addStatItem(`Minutes played: ${stats.games.minutes}`);
        }
    }

    if (stats && stats.goals) {
        if (stats.goals.total != null) {
            addStatItem(`Goals: ${stats.goals.total}`);
        }
        if (stats.goals.assists != null) {
            addStatItem(`Assists: ${stats.goals.assists}`);
        }
    }

    if (!statsListEl.innerHTML) {
        addStatItem('No stats available for this player.');
    }
}

function addStatItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    statsListEl.appendChild(li);
}

document.addEventListener('DOMContentLoaded', loadDetails);