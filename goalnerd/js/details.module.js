/**
 * =============================================================================
 * DETAILS.MODULE.JS - Details Page Entry Point (ES6 Module)
 * =============================================================================
 * 
 * This is the main JavaScript file for details.html.
 * It reads URL parameters to determine what to show (team or player).
 * 
 * URL PARAMETERS:
 * - type: 'team' or 'player'
 * - id: The API ID of the team/player
 * - name: The name (for display while loading)
 * 
 * Example: details.html?type=player&id=276&name=Neymar
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  🔑 TO CHANGE THE API KEY:                                              │
 * │  Go to js/modules/api.js - that's the ONLY file you need to edit!       │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * =============================================================================
 */

// ============================================================================
// IMPORTS - Pull in shared modules
// ============================================================================

// API configuration - API_KEY is defined in this file
import { API_BASE_URL, HEADERS, SEASON } from './modules/api.js';

// Navigation functionality - hamburger menu, animations
import { initHamburgerMenu, initNavigationAnimation, initSkipLink } from './modules/navigation.js';

// ============================================================================
// URL PARAMETERS - Read what we should display
// ============================================================================

const params = new URLSearchParams(window.location.search);
const type = params.get('type');         // "team" or "player"
const id = params.get('id');             // numeric API id
const nameFromUrl = params.get('name');  // optional name for loading state

// ============================================================================
// DOM ELEMENTS
// ============================================================================

const titleEl = document.getElementById('details-title');
const subtitleEl = document.getElementById('details-subtitle');
const typeEl = document.getElementById('details-type');
const nameEl = document.getElementById('details-name');
const meta1El = document.getElementById('details-meta-1');
const meta2El = document.getElementById('details-meta-2');
const statsListEl = document.getElementById('details-stats-list');
const imageContainerEl = document.getElementById('details-image-container');

// ============================================================================
// SEARCH FORM HANDLER
// ============================================================================

/**
 * Set up the search form to redirect to search results page
 */
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        const searchTerm = searchInput.value.trim();
        
        if (searchTerm.length > 2) {
            const encodedQuery = encodeURIComponent(searchTerm);
            window.location.href = `search-results.html?search_query=${encodedQuery}`;
        } else {
            alert('Please enter at least 3 characters to search.');
        }
    });
}

// ============================================================================
// INITIAL PAGE STATE
// ============================================================================

/**
 * Set up the initial page state based on URL parameters
 */
function setupInitialState() {
    if (!type || !id) {
        titleEl.textContent = 'No data available';
        subtitleEl.textContent = 'We could not find a team or player. Please go back and try again.';
    } else {
        const niceType = type === 'team' ? 'Team' : 'Player';
        titleEl.textContent = `${niceType} Details`;
        typeEl.textContent = niceType;
        if (nameFromUrl) {
            nameEl.textContent = decodeURIComponent(nameFromUrl);
        }
    }
}

// ============================================================================
// API DATA FETCHING
// ============================================================================

/**
 * Load details from the API based on type (team or player)
 */
async function loadDetails() {
    if (!type || !id) return;

    try {
        let url = '';

        if (type === 'team') {
            url = `${API_BASE_URL}teams?id=${id}`;
        } else {
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
        subtitleEl.textContent = 'There was an error loading the details. Check js/modules/api.js';
    }
}

// ============================================================================
// TEAM DETAILS
// ============================================================================

/**
 * Fill the page with team details
 * @param {Object} item - Team data from API
 */
function fillTeamDetails(item) {
    const team = item.team;
    const venue = item.venue;

    if (!nameFromUrl && team && team.name) {
        nameEl.textContent = team.name;
    }

    typeEl.textContent = 'Team';
    titleEl.textContent = `Team: ${team.name}`;

    // Team logo
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

    // Stats list
    statsListEl.innerHTML = '';

    if (venue) {
        if (venue.name) addStatItem(`Stadium: ${venue.name}`);
        if (venue.city) addStatItem(`City: ${venue.city}`);
        if (venue.capacity) addStatItem(`Capacity: ${venue.capacity.toLocaleString()}`);
    }

    if (!statsListEl.innerHTML) {
        addStatItem('No additional stats available for this team.');
    }
}

// ============================================================================
// PLAYER DETAILS
// ============================================================================

/**
 * Fill the page with player details
 * @param {Object} item - Player data from API
 */
function fillPlayerDetails(item) {
    const player = item.player;
    const stats = item.statistics && item.statistics[0];

    let displayName = player.name || nameFromUrl || 'Unknown player';
    if (player.age) {
        displayName += ` (${player.age} years)`;
    }

    nameEl.textContent = displayName;
    typeEl.textContent = 'Player';
    titleEl.textContent = `Player: ${player.name}`;

    // Player photo
    if (player.photo && imageContainerEl) {
        imageContainerEl.classList.remove('placeholder');
        imageContainerEl.style.backgroundImage = `url('${player.photo}')`;
        imageContainerEl.style.backgroundSize = 'cover';
        imageContainerEl.style.backgroundPosition = 'center';
        imageContainerEl.style.backgroundColor = 'transparent';
    }

    // Meta info
    const teamName = stats && stats.team ? stats.team.name : 'N/A';
    const position = stats && stats.games ? stats.games.position : player.position || 'N/A';

    meta1El.textContent = `Team: ${teamName}`;
    meta2El.textContent = `Position: ${position}`;

    // Stats list
    statsListEl.innerHTML = '';

    if (player.nationality) addStatItem(`Nationality: ${player.nationality}`);
    if (player.height) addStatItem(`Height: ${player.height}`);
    if (player.weight) addStatItem(`Weight: ${player.weight}`);

    if (stats) {
        if (stats.games?.appearences) addStatItem(`Appearances: ${stats.games.appearences}`);
        if (stats.goals?.total) addStatItem(`Goals: ${stats.goals.total}`);
        if (stats.goals?.assists) addStatItem(`Assists: ${stats.goals.assists}`);
        if (stats.cards?.yellow) addStatItem(`Yellow Cards: ${stats.cards.yellow}`);
        if (stats.cards?.red) addStatItem(`Red Cards: ${stats.cards.red}`);
    }

    if (!statsListEl.innerHTML) {
        addStatItem('No additional stats available for this player.');
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Add a stat item to the stats list
 * @param {string} text - The text to display
 */
function addStatItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    statsListEl.appendChild(li);
}

// ============================================================================
// INITIALIZATION - Run when page loads
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation (hamburger menu, animations, skip link)
    initHamburgerMenu();
    initNavigationAnimation();
    initSkipLink();
    
    // Initialize search form
    initSearchForm();
    
    // Set up page and load details
    setupInitialState();
    loadDetails();
});
