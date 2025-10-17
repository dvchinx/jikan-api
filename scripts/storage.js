// Servicio para manejo de LocalStorage
class StorageService {
    
    // Cargar favoritos desde localStorage
    static loadFavorites() {
        try {
            const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : {};
        } catch (error) {
            console.error('Error cargando favoritos:', error);
            return {};
        }
    }

    // Guardar favoritos en localStorage
    static saveFavorites(favorites) {
        try {
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error guardando favoritos:', error);
        }
    }

    // Verificar si un personaje está en favoritos
    static isFavorite(characterId, favorites) {
        return favorites.hasOwnProperty(characterId);
    }

    // Agregar personaje a favoritos
    static addToFavorites(character, favorites) {
        favorites[character.mal_id] = character;
        this.saveFavorites(favorites);
        return favorites;
    }

    // Remover personaje de favoritos
    static removeFromFavorites(characterId, favorites) {
        delete favorites[characterId];
        this.saveFavorites(favorites);
        return favorites;
    }

    // Obtener lista de personajes favoritos
    static getFavoritesList(favorites) {
        return Object.values(favorites);
    }

    // Obtener contador de favoritos
    static getFavoritesCount(favorites) {
        return Object.keys(favorites).length;
    }
}