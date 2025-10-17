// Configuración y constantes de la aplicación
const CONFIG = {
    API_BASE_URL: 'https://api.jikan.moe/v4',
    CHARACTERS_PER_PAGE: 20,
    REQUEST_DELAY: 333, // Delay entre requests para no saturar la API
    MAX_FAVORITE_CHARACTERS_FOR_ANIME: 5,
    MAX_ANIME_RECOMMENDATIONS: 12
};

const ENDPOINTS = {
    CHARACTERS: '/characters',
    CHARACTER_DETAILS: '/characters/{id}/full',
    ANIME: '/anime/{id}'
};

const STORAGE_KEYS = {
    FAVORITES: 'jikan_favorites'
};

const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list'
};

const SECTIONS = {
    HOME: 'home',
    FAVORITES: 'favorites',
    EXPLORER: 'explorer'
};

const SORT_OPTIONS = {
    DEFAULT: 'default',
    NAME_ASC: 'name-asc',
    NAME_DESC: 'name-desc',
    FAVORITES_FIRST: 'favorites'
};

const FILTER_OPTIONS = {
    ALL: 'all',
    FAVORITES_ONLY: 'favorites-only',
    NON_FAVORITES: 'non-favorites'
};