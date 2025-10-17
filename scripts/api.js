// Servicio para comunicación con la API de Jikan
class ApiService {
    
    // Obtener personajes con paginación
    static async fetchCharacters(page = 1) {
        try {
            const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CHARACTERS}?limit=${CONFIG.CHARACTERS_PER_PAGE}&page=${page}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                characters: data.data,
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Error al obtener personajes:', error);
            throw error;
        }
    }

    // Obtener detalles de un personaje específico
    static async fetchCharacterDetails(characterId) {
        try {
            const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CHARACTER_DETAILS.replace('{id}', characterId)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error al obtener detalles del personaje:', error);
            throw error;
        }
    }

    // Buscar personajes por nombre
    static async searchCharacters(query, page = 1) {
        try {
            const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.CHARACTERS}?q=${encodeURIComponent(query)}&limit=${CONFIG.CHARACTERS_PER_PAGE}&page=${page}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                characters: data.data,
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            throw error;
        }
    }

    // Obtener anime por ID
    static async fetchAnime(animeId) {
        try {
            const url = `${CONFIG.API_BASE_URL}${ENDPOINTS.ANIME.replace('{id}', animeId)}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                return data.data;
            }
            return null;
        } catch (error) {
            console.warn(`Error obteniendo anime ${animeId}:`, error);
            return null;
        }
    }

    // Obtener anime de personajes favoritos
    static async fetchAnimeFromFavoriteCharacters(favoriteCharacters) {
        if (favoriteCharacters.length === 0) {
            return [];
        }

        try {
            const animeIds = new Set();
            
            // Obtener anime de los primeros personajes favoritos
            const charactersToCheck = favoriteCharacters.slice(0, CONFIG.MAX_FAVORITE_CHARACTERS_FOR_ANIME);
            
            for (const character of charactersToCheck) {
                try {
                    const characterDetails = await this.fetchCharacterDetails(character.mal_id);
                    if (characterDetails.anime) {
                        characterDetails.anime.forEach(anime => {
                            animeIds.add(anime.anime.mal_id);
                        });
                    }
                    // Pequeña pausa para no saturar la API
                    await new Promise(resolve => setTimeout(resolve, CONFIG.REQUEST_DELAY));
                } catch (error) {
                    console.warn(`Error obteniendo anime para personaje ${character.mal_id}:`, error);
                }
            }

            // Obtener detalles de los anime
            const uniqueAnimeIds = Array.from(animeIds).slice(0, CONFIG.MAX_ANIME_RECOMMENDATIONS);
            const animePromises = uniqueAnimeIds.map(animeId => this.fetchAnime(animeId));
            const animeResults = await Promise.all(animePromises);
            
            return animeResults.filter(anime => anime !== null);

        } catch (error) {
            console.error('Error obteniendo recomendaciones de anime:', error);
            return [];
        }
    }

    // Utilidad para manejar delays
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}