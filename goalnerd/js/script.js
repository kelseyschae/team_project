//const API_KEY = "4c63ce2a1c64085d46b339dcc033d21f";
const API_HOST = 'v3.football.api-sports.io';
const API_BASE_URL = 'https://v3.football.api-sports.io/';

const HEADERS = {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
};

const SEASON = 2023;

const getCardElement = (index, selector) => {
    const cards = document.querySelectorAll('.featured .card');
    if (cards.length > index) {
        return cards[index].querySelector(selector);
    }
    return null;
};

function getCard(index) {
    const cards = document.querySelectorAll('.featured .card');
    return cards.length > index ? cards[index] : null;
}

async function fetchRandomTeam() {
    const leagueId = 140;

    try {
        const response = await fetch(`${API_BASE_URL}teams?league=${leagueId}&season=${SEASON}`, { headers: HEADERS });
        const data = await response.json();
        const teams = data.response;

        if (teams && teams.length > 0) {
            const randomIndex = Math.floor(Math.random() * teams.length);
            const randomTeam = teams[randomIndex].team;

            const titleElement = getCardElement(0, '.card-title');
            const imageElement = getCardElement(0, '.card-image');
            const labelElement = getCardElement(0, '.card-label');
            const cardElement = getCard(0);

            if (titleElement) titleElement.textContent = randomTeam.name;
            if (labelElement) labelElement.textContent = `Today's Team | ${randomTeam.country}`;

            if (imageElement && randomTeam.logo) {
                imageElement.classList.remove('placeholder');
                imageElement.innerHTML = '';
                imageElement.style.backgroundImage = `url('${randomTeam.logo}')`;
                imageElement.style.backgroundSize = 'contain';
                imageElement.style.backgroundRepeat = 'no-repeat';
                imageElement.style.backgroundPosition = 'center';
                imageElement.style.backgroundColor = 'var(--white)';
            }

            // 👉 Hacer clicable la card del equipo
            if (cardElement) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    window.location.href = `details.html?type=team&id=${randomTeam.id}&name=${encodeURIComponent(randomTeam.name)}`;
                });
            }

        } else {
            console.error('Error: No se encontraron equipos.');
            if (getCardElement(0, '.card-title'))
                getCardElement(0, '.card-title').textContent = 'Error: No hay datos de equipo.';
        }
    } catch (error) {
        console.error('Error de red al obtener el equipo:', error);
    }
}

async function fetchRandomPlayerSpotlight() {
    const teamId = 529;

    try {
        const response = await fetch(`${API_BASE_URL}players?team=${teamId}&season=${SEASON}&page=1`, { headers: HEADERS });
        const data = await response.json();
        const players = data.response;

        if (players && players.length > 0) {
            const randomIndex = Math.floor(Math.random() * players.length);
            const randomPlayer = players[randomIndex].player;

            const titleElement = getCardElement(1, '.card-title');
            const imageElement = getCardElement(1, '.card-image');
            const labelElement = getCardElement(1, '.card-label');
            const cardElement = getCard(1);

            if (titleElement) titleElement.textContent = `${randomPlayer.name} (${randomPlayer.age || 'N/A'} años)`;
            if (labelElement) labelElement.textContent = `Spotlight Player`;

            if (imageElement && randomPlayer.photo) {
                imageElement.classList.remove('placeholder');
                imageElement.innerHTML = '';
                imageElement.style.backgroundImage = `url('${randomPlayer.photo}')`;
                imageElement.style.backgroundSize = 'cover';
                imageElement.style.backgroundPosition = 'center';
                imageElement.style.backgroundColor = 'transparent';
            }

            // 👉 Hacer clicable la card del jugador spotlight
            if (cardElement) {
                cardElement.style.cursor = 'pointer';
                cardElement.addEventListener('click', () => {
                    window.location.href = `details.html?type=player&id=${randomPlayer.id}&name=${encodeURIComponent(randomPlayer.name)}`;
                });
            }

        } else {
            console.error('Error: No se encontraron jugadores para el spotlight.');
            if (getCardElement(1, '.card-title'))
                getCardElement(1, '.card-title').textContent = 'Error: No hay datos de jugador.';
        }
    } catch (error) {
        console.error('Error de red al obtener el jugador:', error);
    }
}

// Hamburger Menu Toggle
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    // Toggle menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Prevent menu from closing when clicking inside it
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// RollOut Animation for Navigation Links
function initNavigationAnimation() {
    const navLinksElements = document.querySelectorAll('.nav-link');

    navLinksElements.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetUrl = link.getAttribute('href');

            // Add animation classes
            link.classList.add('animate__animated', 'animate__rollOut');

            // Navigate after animation completes
            link.addEventListener('animationend', () => {
                window.location.href = targetUrl;
            }, { once: true });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchRandomTeam();
    fetchRandomPlayerSpotlight();
    initHamburgerMenu();
    initNavigationAnimation();
});

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  });
  