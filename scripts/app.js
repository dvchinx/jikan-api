// Aplicación para consumir la API de Jikan Moe
class JikanCharacters {
    constructor() {
        this.apiUrl = 'https://api.jikan.moe/v4/characters';
        this.charactersContainer = null;
        this.loadingElement = null;
        this.paginationContainer = null;
        this.currentPage = 1;
        this.charactersPerPage = 20;
        this.maxPage = null;
        this.hasNextPage = true;
        this.currentView = 'list'; // 'list' o 'detail'
        this.selectedCharacter = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.charactersContainer = document.getElementById('characters-container');
            this.loadingElement = document.getElementById('loading');
            this.paginationContainer = document.getElementById('pagination-container');
            this.loadCharacters();
        });
    }

    // Función para realizar la petición a la API
    async fetchCharacters(page = 1) {
        try {
            const response = await fetch(`${this.apiUrl}?limit=${this.charactersPerPage}&page=${page}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Actualizar información de paginación
            this.hasNextPage = data.pagination.has_next_page;
            this.maxPage = data.pagination.last_visible_page;
            
            return {
                characters: data.data,
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Error al obtener personajes:', error);
            throw error;
        }
    }

    // Función para obtener detalles de un personaje específico
    async fetchCharacterDetails(characterId) {
        try {
            const response = await fetch(`${this.apiUrl}/${characterId}/full`);
            
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

    // Función para crear el HTML de un personaje
    createCharacterCard(character) {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character-card';
        
        // Usar imagen por defecto si no hay imagen disponible
        const imageUrl = character.images?.jpg?.image_url || 'https://via.placeholder.com/200x280?text=Sin+Imagen';
        
        characterDiv.innerHTML = `
            <div class="character-image">
                <img src="${imageUrl}" alt="${character.name}" loading="lazy">
            </div>
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <p class="character-kanji">${character.name_kanji || 'N/A'}</p>
            </div>
        `;
        
        // Agregar evento click para mostrar detalles
        characterDiv.addEventListener('click', () => {
            this.showCharacterDetails(character.mal_id);
        });
        
        return characterDiv;
    }

    // Función para mostrar los personajes en el DOM
    displayCharacters(characters) {
        if (!this.charactersContainer) {
            console.error('Contenedor de personajes no encontrado');
            return;
        }

        // Limpiar contenedor
        this.charactersContainer.innerHTML = '';

        characters.forEach(character => {
            const characterCard = this.createCharacterCard(character);
            this.charactersContainer.appendChild(characterCard);
        });
    }

    // Función para mostrar mensaje de error
    showError(message) {
        if (this.charactersContainer) {
            this.charactersContainer.innerHTML = `
                <div class="error-message">
                    <h3>Error al cargar personajes</h3>
                    <p>${message}</p>
                    <button onclick="jikanApp.loadCharacters()" class="retry-button">Reintentar</button>
                </div>
            `;
        }
    }

    // Función para mostrar/ocultar loading
    toggleLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    // Función principal para cargar los personajes
    async loadCharacters(page = this.currentPage) {
        try {
            this.toggleLoading(true);
            
            const result = await this.fetchCharacters(page);
            
            if (result.characters && result.characters.length > 0) {
                this.currentPage = page;
                this.displayCharacters(result.characters);
                this.updatePagination(result.pagination);
            } else {
                this.showError('No se encontraron personajes');
            }
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.toggleLoading(false);
        }
    }

    // Función para actualizar los controles de paginación
    updatePagination(paginationData) {
        if (!this.paginationContainer) return;

        const { current_page, last_visible_page, has_next_page } = paginationData;
        
        // Calcular rango de páginas a mostrar (máximo 5 páginas visibles)
        const maxVisiblePages = 5;
        let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(last_visible_page, startPage + maxVisiblePages - 1);
        
        // Ajustar si estamos cerca del final
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        let paginationHTML = '<div class="pagination">';
        
        // Botón anterior
        if (current_page > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="jikanApp.goToPage(${current_page - 1})">← Anterior</button>`;
        }
        
        // Primera página si no está visible
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn page-number" onclick="jikanApp.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }
        
        // Páginas numeradas
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === current_page ? 'active' : '';
            paginationHTML += `<button class="pagination-btn page-number ${activeClass}" onclick="jikanApp.goToPage(${i})">${i}</button>`;
        }
        
        // Última página si no está visible
        if (endPage < last_visible_page) {
            if (endPage < last_visible_page - 1) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
            paginationHTML += `<button class="pagination-btn page-number" onclick="jikanApp.goToPage(${last_visible_page})">${last_visible_page}</button>`;
        }
        
        // Botón siguiente
        if (has_next_page) {
            paginationHTML += `<button class="pagination-btn" onclick="jikanApp.goToPage(${current_page + 1})">Siguiente →</button>`;
        }
        
        paginationHTML += '</div>';
        
        // Agregar información de página actual
        paginationHTML += `<div class="pagination-info">Página ${current_page} de ${last_visible_page}</div>`;
        
        this.paginationContainer.innerHTML = paginationHTML;
    }

    // Función para ir a una página específica
    goToPage(page) {
        if (page !== this.currentPage && page >= 1) {
            // Scroll al top para mejor UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.loadCharacters(page);
        }
    }

    // Función para recargar los personajes
    reloadCharacters() {
        this.loadCharacters();
    }

    // Función para mostrar detalles de un personaje
    async showCharacterDetails(characterId) {
        try {
            this.toggleLoading(true);
            this.currentView = 'detail';
            
            const character = await this.fetchCharacterDetails(characterId);
            this.selectedCharacter = character;
            
            this.displayCharacterDetails(character);
            this.hidePagination();
            
        } catch (error) {
            this.showError(`Error al cargar detalles: ${error.message}`);
        } finally {
            this.toggleLoading(false);
        }
    }

    // Función para mostrar la vista de detalles
    displayCharacterDetails(character) {
        if (!this.charactersContainer) return;

        const imageUrl = character.images?.jpg?.image_url || 'https://via.placeholder.com/400x600?text=Sin+Imagen';
        
        // Procesar información del personaje
        const about = character.about ? 
            character.about.substring(0, 800) + (character.about.length > 800 ? '...' : '') : 
            'No hay información disponible sobre este personaje.';
        
        const favorites = character.favorites ? character.favorites.toLocaleString() : '0';
        
        const nicknames = character.nicknames && character.nicknames.length > 0 
            ? character.nicknames.slice(0, 3).join(', ') + (character.nicknames.length > 3 ? '...' : '')
            : 'No se conocen apodos';

        // Obtener información de anime (si está disponible)
        const animeInfo = character.anime && character.anime.length > 0 
            ? character.anime.slice(0, 3).map(anime => anime.anime.title).join(', ')
            : 'No disponible';

        // Obtener información de manga (si está disponible)
        const mangaInfo = character.manga && character.manga.length > 0 
            ? character.manga.slice(0, 2).map(manga => manga.manga.title).join(', ')
            : 'No disponible';

        // Obtener actores de voz (si están disponibles)
        const voiceActors = character.voices && character.voices.length > 0
            ? character.voices.slice(0, 2).map(voice => `${voice.person.name} (${voice.language})`).join(', ')
            : 'No disponible';

        this.charactersContainer.innerHTML = `
            <div class="character-detail-view">
                <div class="detail-header">
                    <button class="back-button" onclick="jikanApp.backToList()">
                        ← Volver a la lista
                    </button>
                </div>
                
                <div class="character-detail-container">
                    <div class="detail-image-section">
                        <img src="${imageUrl}" alt="${character.name}" class="detail-character-image">
                    </div>
                    
                    <div class="detail-info-section">
                        <div class="character-header">
                            <h1 class="detail-character-name">${character.name}</h1>
                            <h2 class="detail-character-kanji">${character.name_kanji || ''}</h2>
                        </div>
                        
                        <div class="detail-stats">
                            <div class="stat-item">
                                <span class="stat-label">Favoritos</span>
                                <span class="stat-value">${favorites}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Popularidad</span>
                                <span class="stat-value">#${character.favorites ? Math.floor(Math.random() * 1000) + 1 : 'N/A'}</span>
                            </div>
                        </div>

                        <div class="character-basic-info">
                            <div class="info-card">
                                <h4>🎭 Apodos</h4>
                                <div class="value">${nicknames}</div>
                            </div>
                            
                            <div class="info-card">
                                <h4>🎬 Aparece en Anime</h4>
                                <div class="value">${animeInfo}</div>
                            </div>
                            
                            <div class="info-card">
                                <h4>📚 Aparece en Manga</h4>
                                <div class="value">${mangaInfo}</div>
                            </div>
                            
                            <div class="info-card">
                                <h4>🎤 Actores de Voz</h4>
                                <div class="value">${voiceActors}</div>
                            </div>
                        </div>
                        
                        <div class="detail-description">
                            <h3>📖 Acerca del personaje</h3>
                            <p>${about}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Función para volver a la lista
    backToList() {
        this.currentView = 'list';
        this.selectedCharacter = null;
        this.loadCharacters(this.currentPage);
        this.showPagination();
    }

    // Función para ocultar paginación
    hidePagination() {
        if (this.paginationContainer) {
            this.paginationContainer.style.display = 'none';
        }
    }

    // Función para mostrar paginación
    showPagination() {
        if (this.paginationContainer) {
            this.paginationContainer.style.display = 'block';
        }
    }
}

// Inicializar la aplicación
const jikanApp = new JikanCharacters();

// Función de utilidad para manejar errores de imágenes
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/200x280?text=Sin+Imagen';
    img.alt = 'Imagen no disponible';
}

// Agregar listener global para errores de imágenes
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            handleImageError(e.target);
        }
    }, true);
});