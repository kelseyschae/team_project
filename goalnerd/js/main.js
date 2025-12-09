/**
 * =============================================================================
 * MAIN.JS - Index Page Entry Point (ES6 Module)
 * =============================================================================
 * 
 * This is the main JavaScript file for index.html (home page).
 * It imports shared modules and initializes the page functionality.
 * 
 * STRUCTURE:
 * - Imports API config from modules/api.js (where API_KEY is defined)
 * - Imports navigation functions from modules/navigation.js
 * - Initializes hamburger menu and nav animations
 * - Fetches and displays spotlight content
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
// PAGE-SPECIFIC FUNCTIONS - Index page content
// ============================================================================

/**
 * Fetch and display a random spotlight player on the home page
 * Shows a player from Barcelona (team ID 529)
 */
async function fetchSpotlightPlayer() {
    const spotlightContainer = document.getElementById('spotlight-player');
    if (!spotlightContainer) return;

    const teamId = 529; // Barcelona

    try {
        const response = await fetch(`${API_BASE_URL}players?team=${teamId}&season=${SEASON}&page=1`, { headers: HEADERS });
        const data = await response.json();
        const players = data.response;

        if (players && players.length > 0) {
            const randomIndex = Math.floor(Math.random() * players.length);
            const randomPlayer = players[randomIndex].player;
            const stats = players[randomIndex].statistics[0];

            spotlightContainer.innerHTML = `
                <article class="card spotlight-card-item" 
                         tabindex="0"
                         role="button"
                         data-player-id="${randomPlayer.id}"
                         data-player-name="${randomPlayer.name}"
                         aria-label="View details for ${randomPlayer.name}">
                    <div class="card-image" 
                         style="background-image: url('${randomPlayer.photo}'); 
                                background-size: cover; 
                                background-position: center;
                                height: 200px;"
                         role="img"
                         aria-label="Photo of ${randomPlayer.name}">
                    </div>
                    <div class="card-content">
                        <p class="card-label">Spotlight Player</p>
                        <h3 class="card-title">${randomPlayer.name}</h3>
                        <p>${stats?.team?.name || 'Team N/A'} • ${randomPlayer.age || 'N/A'} years</p>
                    </div>
                </article>
            `;

            // Make the card clickable
            const card = spotlightContainer.querySelector('.card');
            if (card) {
                card.style.cursor = 'pointer';
                
                // Click handler
                card.addEventListener('click', () => {
                    window.location.href = `details.html?type=player&id=${randomPlayer.id}&name=${encodeURIComponent(randomPlayer.name)}`;
                });
                
                // Keyboard handler (Enter/Space) for accessibility
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = `details.html?type=player&id=${randomPlayer.id}&name=${encodeURIComponent(randomPlayer.name)}`;
                    }
                });
            }

        } else {
            spotlightContainer.innerHTML = '<p>No spotlight player available.</p>';
        }
    } catch (error) {
        console.error('Error fetching spotlight player:', error);
        spotlightContainer.innerHTML = '<p style="color: red;">Error loading spotlight player. Check API key.</p>';
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
    
    // Load page content
    fetchSpotlightPlayer();
});
