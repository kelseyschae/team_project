/**
 * =============================================================================
 * PLAYERS.MODULE.JS - Players Page Entry Point (ES6 Module)
 * =============================================================================
 * 
 * This is the main JavaScript file for players.html.
 * It imports shared modules and displays the player grid.
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

// Card creation and navigation
import { createPlayerCardHTML, initCardNavigation } from './modules/cards.js';

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
// PAGE-SPECIFIC FUNCTIONS - Player List
// ============================================================================

/**
 * Fetch players from API and display them in the player grid
 * 
 * Currently fetches players from Real Madrid (team ID 541)
 * Displays 20 players per page
 */
async function fetchAndDisplayPlayerList() {
    const teamId = 541;    // Real Madrid
    const playerCount = 20; // Number of players to show
    const page = 2;         // API page number

    const gridContainer = document.getElementById('player-grid');
    if (!gridContainer) return;

    // Show loading message
    gridContainer.innerHTML = '<p style="text-align: center;">Loading players...</p>';

    try {
        const url = `${API_BASE_URL}players?team=${teamId}&season=${SEASON}&page=${page}`;
        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();
        const playersData = data.response;

        if (playersData && playersData.length > 0) {
            // Build all cards HTML
            let allCardsHTML = '';
            for (let i = 0; i < playerCount && i < playersData.length; i++) {
                allCardsHTML += createPlayerCardHTML(playersData[i]);
            }

            gridContainer.innerHTML = allCardsHTML;

            // Initialize card click/keyboard navigation
            initCardNavigation(gridContainer, 'player');

        } else {
            gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Error: No players found.</p>';
        }
    } catch (error) {
        console.error('Error fetching or displaying players:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">❌ Connection error or invalid API Key. Check js/modules/api.js</p>';
    }
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
    
    // Load player list
    fetchAndDisplayPlayerList();
});
