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