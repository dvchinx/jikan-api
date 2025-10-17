// Extensión de JikanApp para funcionalidades de favoritos
Object.assign(JikanApp.prototype, {
    
    // ===== MANEJO DE FAVORITOS =====
    
    toggleFavorite(character) {
        const isFavorite = StorageService.isFavorite(character.mal_id, this.favorites);
        
        if (isFavorite) {
            this.favorites = StorageService.removeFromFavorites(character.mal_id, this.favorites);
        } else {
            this.favorites = StorageService.addToFavorites(character, this.favorites);
        }
        
        this.updateFavoritesCount();
        
        // Actualizar UI si estamos en la vista de favoritos
        if (this.currentSection === SECTIONS.FAVORITES) {
            this.showFavorites();
        }
    },

    toggleFavoriteUI(character, buttonElement) {
        // Alternar el estado en localStorage
        this.toggleFavorite(character);
        
        // Actualizar el botón inmediatamente
        const isNowFavorite = StorageService.isFavorite(character.mal_id, this.favorites);
        
        if (isNowFavorite) {
            buttonElement.classList.add('favorite-active');
            buttonElement.textContent = '❤️';
        } else {
            buttonElement.classList.remove('favorite-active');
            buttonElement.textContent = '🤍';
        }
        
        // Agregar efecto visual temporal
        DomUtils.addButtonEffect(buttonElement);

        // Re-aplicar filtros si estamos en el home y hay filtros activos
        if (this.currentSection === SECTIONS.HOME && 
            (this.currentSort !== SORT_OPTIONS.DEFAULT || this.currentFavoritesFilter !== FILTER_OPTIONS.ALL)) {
            setTimeout(() => {
                this.applyFilters();
            }, 250);
        }
    },

    updateFavoritesCount() {
        const count = StorageService.getFavoritesCount(this.favorites);
        DomUtils.updateFavoritesCount(count);
    },

    // ===== VISTA DE FAVORITOS =====
    
    showFavorites() {
        if (!this.charactersContainer) return;

        const favoriteCharacters = StorageService.getFavoritesList(this.favorites);
        
        if (favoriteCharacters.length === 0) {
            this.charactersContainer.innerHTML = DomUtils.createEmptyFavoritesMessage(
                'jikanApp.showSection("home")'
            );
        } else {
            this.displayCharacters(favoriteCharacters);
        }
    }
});