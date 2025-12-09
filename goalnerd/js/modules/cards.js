/**
 * =============================================================================
 * CARDS MODULE
 * =============================================================================
 * 
 * This module handles the creation and interaction of player/team cards.
 * Cards are the clickable boxes that show player photos and info.
 * 
 * FUNCTIONS:
 * - createPlayerCardHTML() - Creates the HTML for a player card
 * - initCardNavigation() - Makes cards clickable and keyboard accessible
 * 
 * IMPORTED BY: players.module.js, search-results.module.js
 * 
 * NOTE: This file does NOT contain any API keys.
 * 
 * =============================================================================
 */

/**
 * Create HTML for a player card
 * 
 * This function takes player data from the API and returns the HTML
 * string needed to display a card on the page.
 * 
 * @param {Object} playerData - Player data from API response
 * @returns {string} - HTML string for the player card
 */
export function createPlayerCardHTML(playerData) {
    const player = playerData.player;
    const teamName = playerData.statistics[0] ? playerData.statistics[0].team.name : 'Team N/A';
    const playerPosition = playerData.statistics[0]?.games?.position || player.position || 'N/A';

    const playerName = player.name;
    const playerPhoto = player.photo;
    const playerAge = player.age || 'N/A';

    const cardHTML = `
        <article class="card" 
                 role="button"
                 tabindex="0"
                 data-player-id="${player.id}"
                 data-player-name="${playerName}"
                 aria-label="View details for ${playerName}">
            <div class="card-image" 
                 style="background-image: url('${playerPhoto}'); 
                        background-size: cover; 
                        background-position: center; 
                        background-color: transparent;
                        height: 160px;"
                 role="img"
                 aria-label="Photo of ${playerName}"> 
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

/**
 * Add click and keyboard event listeners to a card container
 * 
 * This makes all cards inside a container clickable AND keyboard accessible.
 * When clicked or Enter/Space is pressed, it navigates to the details page.
 * 
 * @param {HTMLElement} container - The container element with cards (e.g., #player-grid)
 * @param {string} type - Type of item ('player' or 'team') - used for URL params
 */
export function initCardNavigation(container, type = 'player') {
    if (!container) return;

    // Click handler - uses event delegation (one listener for all cards)
    container.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (!card) return;
        navigateToDetails(card, type);
    });

    // Keyboard handler for accessibility (Enter or Space activates the card)
    container.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            const card = event.target.closest('.card');
            if (!card) return;
            event.preventDefault();
            navigateToDetails(card, type);
        }
    });
}

/**
 * Navigate to details page for a card
 * 
 * This is a helper function that builds the URL and navigates to details.html
 * Uses URL parameters to pass the type, id, and name to the details page.
 * 
 * @param {HTMLElement} card - The card element that was clicked
 * @param {string} type - Type of item ('player' or 'team')
 */
function navigateToDetails(card, type) {
    const id = card.getAttribute(`data-${type}-id`) || card.getAttribute('data-player-id');
    const name = card.getAttribute(`data-${type}-name`) || card.getAttribute('data-player-name');

    if (!id) return;

    window.location.href = `details.html?type=${type}&id=${id}&name=${encodeURIComponent(name)}`;
}
