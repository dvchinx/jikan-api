// Utilidades para manejo del DOM
class DomUtils {
    
    // Obtener elemento por ID
    static getElementById(id) {
        return document.getElementById(id);
    }

    // Crear card de personaje
    static createCharacterCard(character, isFavorite, onFavoriteClick, onCharacterClick) {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character-card';
        characterDiv.setAttribute('data-character-id', character.mal_id);
        
        const imageUrl = character.images?.jpg?.image_url || 'https://via.placeholder.com/200x280?text=Sin+Imagen';
        const favoriteIcon = isFavorite ? '❤️' : '🤍';
        const favoriteClass = isFavorite ? 'favorite-btn favorite-active' : 'favorite-btn';

        characterDiv.innerHTML = `
            <div class="character-image">
                <img src="${imageUrl}" alt="${character.name}" loading="lazy">
                <button class="${favoriteClass}">${favoriteIcon}</button>
            </div>
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <p class="character-kanji">${character.name_kanji || 'N/A'}</p>
            </div>
        `;
        
        // Agregar evento click para el botón de favorito
        const favoriteBtn = characterDiv.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onFavoriteClick(character, favoriteBtn);
        });
        
        // Agregar evento click para mostrar detalles
        characterDiv.addEventListener('click', () => {
            onCharacterClick(character.mal_id);
        });
        
        return characterDiv;
    }

    // Crear card de anime
    static createAnimeCard(anime, onAnimeClick) {
        const animeDiv = document.createElement('div');
        animeDiv.className = 'anime-card';
        
        const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/280x400?text=Sin+Imagen';
        const score = anime.score ? anime.score.toFixed(1) : 'N/A';
        const synopsis = anime.synopsis || 'Sin sinopsis disponible.';
        const maxLength = 200;
        const truncatedSynopsis = synopsis.length > maxLength ? synopsis.substring(0, maxLength) + '...' : synopsis;

        animeDiv.innerHTML = `
            <img src="${imageUrl}" alt="${anime.title}" class="anime-poster" loading="lazy">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title}</h3>
                <div class="anime-score">⭐ ${score}</div>
                <p class="anime-synopsis">${truncatedSynopsis}</p>
                ${anime.genres && anime.genres.length > 0 ? `
                    <div class="anime-genres">
                        ${anime.genres.slice(0, 3).map(genre => `<span class="anime-genre">${genre.name}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // Evento click para abrir el anime en MyAnimeList
        animeDiv.addEventListener('click', () => {
            onAnimeClick(anime.url);
        });

        return animeDiv;
    }

    // Crear paginación
    static createPagination(pagination, onPageClick) {
        const totalPages = pagination.last_visible_page;
        const currentPage = pagination.current_page;

        let paginationHTML = '<div class="pagination">';

        // Botón anterior
        if (currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">← Anterior</button>`;
        }

        // Números de página (mostrar máximo 5 páginas)
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += '<span class="pagination-dots">...</span>';
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Botón siguiente
        if (currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">Siguiente →</button>`;
        }

        paginationHTML += '</div>';

        const container = document.createElement('div');
        container.innerHTML = paginationHTML;

        // Agregar event listeners
        container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                onPageClick(page);
            });
        });

        return container;
    }

    // Mostrar mensaje de error
    static createErrorMessage(message, onRetry) {
        return `
            <div class="error-message">
                <h3>Error al cargar personajes</h3>
                <p>${message}</p>
                <button onclick="${onRetry}" class="retry-button">Reintentar</button>
            </div>
        `;
    }

    // Mostrar mensaje de no resultados
    static createNoResultsMessage(query, onClearSearch) {
        return `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h2>No se encontraron personajes</h2>
                <p>No se encontraron resultados para: <strong>"${query}"</strong></p>
                <button class="clear-search-btn" onclick="${onClearSearch}">
                    Limpiar búsqueda
                </button>
            </div>
        `;
    }

    // Mostrar mensaje de favoritos vacíos
    static createEmptyFavoritesMessage(onGoHome) {
        return `
            <div class="empty-favorites">
                <div class="empty-icon">💔</div>
                <h2>No tienes personajes favoritos</h2>
                <p>Marca algunos personajes como favoritos desde la sección Home para verlos aquí.</p>
                <button class="back-to-home-btn" onclick="${onGoHome}">
                    Ir a Home
                </button>
            </div>
        `;
    }

    // Mostrar loading
    static createLoadingElement(message = 'Cargando...') {
        return `
            <div class="loading">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    // Mostrar loading para explorer
    static createExplorerLoadingElement() {
        return `
            <div class="loading-explorer">
                <div class="spinner"></div>
                <p>Descubriendo anime basado en tus favoritos...</p>
            </div>
        `;
    }

    // Mostrar mensaje de no recomendaciones
    static createNoRecommendationsMessage(onGoHome) {
        return `
            <div class="no-recommendations">
                <h3>🎭 No hay recomendaciones disponibles</h3>
                <p>Agrega algunos personajes a tus favoritos para descubrir anime increíbles.</p>
                <button class="nav-button" onclick="${onGoHome}" style="margin-top: 1rem;">
                    Ir a Home
                </button>
            </div>
        `;
    }

    // Utlidad para manejar errores de imágenes
    static handleImageError(img) {
        img.src = 'https://via.placeholder.com/200x280?text=Sin+Imagen';
        img.alt = 'Imagen no disponible';
    }

    // Actualizar contador de favoritos en la UI
    static updateFavoritesCount(count) {
        const countElement = this.getElementById('favorites-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    // Agregar efecto visual a botón
    static addButtonEffect(button, scale = 1.3, duration = 200) {
        button.style.transform = `scale(${scale})`;
        setTimeout(() => {
            button.style.transform = '';
        }, duration);
    }
}