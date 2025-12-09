/**
 * =============================================================================
 * SEARCH-RESULTS.MODULE.JS - Search Results Page Entry Point (ES6 Module)
 * =============================================================================
 * 
 * This is the main JavaScript file for search-results.html.
 * It reads the search query from URL and displays matching players.
 * 
 * URL PARAMETERS:
 * - search_query: The search term entered by the user
 * 
 * Example: search-results.html?search_query=Messi
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
// CONSTANTS
// ============================================================================

// La Liga ID - searches are filtered to this league
const LEAGUE_ID = 140;

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
// SEARCH RESULTS FETCHING
// ============================================================================

/**
 * Fetch and display search results from the API
 * Searches for players in La Liga (league ID 140) matching the query
 */
async function fetchSearchResults() {
    const gridContainer = document.getElementById('results-grid');
    const queryDisplay = document.getElementById('query-display');

    if (!gridContainer) return;

    // Get search query from URL
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search_query');

    if (!searchQuery) {
        gridContainer.innerHTML = '<p style="text-align:center">No search query provided.</p>';
        return;
    }

    // Update the display text
    if (queryDisplay) queryDisplay.textContent = searchQuery;
    gridContainer.innerHTML = '<p style="text-align: center;">Searching La Liga...</p>';

    try {
        // Search API with league filter
        const url = `${API_BASE_URL}players?search=${searchQuery}&season=${SEASON}&league=${LEAGUE_ID}`;

        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();

        // Check for API errors
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error("API Error:", data.errors);
            gridContainer.innerHTML = `<p style="color: red; text-align: center;">API Error: ${Object.values(data.errors)[0]}</p>`;
            return;
        }

        const playersData = data.response;

        if (playersData && playersData.length > 0) {
            // Build cards HTML
            let allCardsHTML = '';
            playersData.forEach(playerItem => {
                allCardsHTML += createPlayerCardHTML(playerItem);
            });
            gridContainer.innerHTML = allCardsHTML;

            // Initialize card click/keyboard navigation
            initCardNavigation(gridContainer, 'player');

        } else {
            gridContainer.innerHTML = `<p style="text-align: center;">❌ No players named "<strong>${searchQuery}</strong>" found in La Liga (${SEASON}).</p>`;
        }

    } catch (error) {
        console.error('Error:', error);
        gridContainer.innerHTML = '<p style="color: red; text-align: center;">Connection error. Check js/modules/api.js for API key.</p>';
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
    
    // Fetch and display search results
    fetchSearchResults();
});
