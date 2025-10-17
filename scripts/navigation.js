// Extensión de JikanApp para navegación y utilidades
Object.assign(JikanApp.prototype, {
    
    // ===== DETALLES DE PERSONAJES =====
    
    async showCharacterDetails(characterId) {
        try {
            this.toggleLoading(true);
            this.currentView = 'detail';
            this.selectedCharacter = characterId;
            
            const character = await ApiService.fetchCharacterDetails(characterId);
            
            if (character) {
                this.displayCharacterDetail(character);
                this.hidePagination();
            } else {
                this.showError('No se pudo cargar el personaje');
            }
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.toggleLoading(false);
        }
    },

    displayCharacterDetail(character) {
        if (!this.charactersContainer) return;

        const imageUrl = character.images?.jpg?.large_image_url || 
                        character.images?.jpg?.image_url || 
                        'https://via.placeholder.com/400x600?text=Sin+Imagen';
        
        const about = character.about || 'No hay información disponible sobre este personaje.';
        const favorites = character.favorites ? character.favorites.toLocaleString() : 'N/A';
        
        this.charactersContainer.innerHTML = `
            <div class="character-detail">
                <button class="back-button" onclick="jikanApp.backToList()">
                    ← Volver a la lista
                </button>
                <div class="detail-content">
                    <div class="detail-image">
                        <img src="${imageUrl}" alt="${character.name}" loading="lazy">
                    </div>
                    <div class="detail-info">
                        <h1>${character.name}</h1>
                        <h2 class="detail-kanji">${character.name_kanji || 'N/A'}</h2>
                        
                        <div class="detail-stats">
                            <div class="stat-item">
                                <span class="stat-label">❤️ Favoritos</span>
                                <span class="stat-value">${favorites}</span>
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
    },

    backToList() {
        this.currentView = 'list';
        this.selectedCharacter = null;
        this.loadCharacters(this.currentPage);
        this.showPagination();
    },

    // ===== PAGINACIÓN =====
    
    updatePagination(pagination) {
        if (!pagination) {
            this.hidePagination();
            return;
        }

        this.maxPage = pagination.last_visible_page;
        this.hasNextPage = pagination.has_next_page;
        
        this.createPagination(pagination);
    },

    createPagination(pagination) {
        if (!this.paginationContainer) return;

        const paginationElement = DomUtils.createPagination(
            pagination,
            (page) => this.goToPage(page)
        );

        this.paginationContainer.innerHTML = '';
        this.paginationContainer.appendChild(paginationElement);
        this.paginationContainer.style.display = 'block';
    },

    async goToPage(page) {
        if (this.isSearchMode && this.currentSearchQuery) {
            await this.searchPage(page);
        } else {
            await this.loadCharacters(page);
        }
    },

    showPagination() {
        if (this.paginationContainer) {
            this.paginationContainer.style.display = 'block';
        }
    },

    hidePagination() {
        if (this.paginationContainer) {
            this.paginationContainer.style.display = 'none';
        }
    },

    // ===== UTILIDADES DE UI =====
    
    toggleLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'block' : 'none';
        }
    },

    showError(message) {
        if (this.charactersContainer) {
            this.charactersContainer.innerHTML = DomUtils.createErrorMessage(
                message,
                'jikanApp.loadCharacters()'
            );
        }
    }
});