/**
 * =============================================================================
 * API CONFIGURATION MODULE
 * =============================================================================
 * 
 * This module contains all API settings for the Football API.
 * All other modules import from here, so this is the ONLY file you need to 
 * update when changing the API key.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  🔑 HOW TO CHANGE THE API KEY:                                          │
 * │  1. Open this file (js/modules/api.js)                                  │
 * │  2. Replace the API_KEY value below with your new key                   │
 * │  3. Save the file - all pages will use the new key automatically!       │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * API Documentation: https://www.api-football.com/documentation-v3
 * 
 * =============================================================================
 */

// ┌─────────────────────────────────────────────────────────────────────────┐
// │  🔑 API KEY - CHANGE THIS WHEN YOU REACH THE LIMIT                      │
// │  Just replace the string below with your new API key                    │
// └─────────────────────────────────────────────────────────────────────────┘
export const API_KEY = '4c63ce2a1c64085d46b339dcc033d21f';

// API Host - Don't change this unless the API provider changes it
export const API_HOST = 'v3.football.api-sports.io';

// Base URL for all API requests
export const API_BASE_URL = 'https://v3.football.api-sports.io/';

// Request headers - automatically uses the API_KEY above
export const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

// Current season for player/team data
export const SEASON = 2023;

/**
 * Fetch data from the Football API
 * 
 * This is a helper function that handles the API request for you.
 * Just pass the endpoint (without the base URL) and it returns the data.
 * 
 * @param {string} endpoint - API endpoint (e.g., 'teams?league=140&season=2023')
 * @returns {Promise<Object>} - The API response data
 * 
 * @example
 * // Fetch all teams from La Liga
 * const data = await fetchFromAPI('teams?league=140&season=2023');
 * console.log(data.response); // Array of teams
 */
export async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers: HEADERS });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}
