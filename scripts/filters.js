// Extensión de JikanApp para funcionalidades de filtros
Object.assign(JikanApp.prototype, {
    
    // ===== CONFIGURACIÓN DE FILTROS =====
    
    setupFilterListeners() {
        const sortSelect = DomUtils.getElementById('sort-select');
        const favoritesFilter = DomUtils.getElementById('favorites-filter');
        const resetFiltersBtn = DomUtils.getElementById('reset-filters');
        const gridViewBtn = DomUtils.getElementById('grid-view');
        const listViewBtn = DomUtils.getElementById('list-view');

        // Ordenamiento
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // Filtro de favoritos
        if (favoritesFilter) {
            favoritesFilter.addEventListener('change', (e) => {
                this.currentFavoritesFilter = e.target.value;
                this.applyFilters();
            });
        }

        // Reset filtros
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Vista grid/list
        if (gridViewBtn && listViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                this.setViewMode(VIEW_MODES.GRID);
            });

            listViewBtn.addEventListener('click', () => {
                this.setViewMode(VIEW_MODES.LIST);
            });
        }
    },

    // ===== APLICACIÓN DE FILTROS =====
    
    applyFilters() {
        if (!this.currentCharacters.length) return;

        let filteredCharacters = [...this.currentCharacters];

        // Aplicar filtro de favoritos
        if (this.currentFavoritesFilter === FILTER_OPTIONS.FAVORITES_ONLY) {
            filteredCharacters = filteredCharacters.filter(char => 
                StorageService.isFavorite(char.mal_id, this.favorites)
            );
        } else if (this.currentFavoritesFilter === FILTER_OPTIONS.NON_FAVORITES) {
            filteredCharacters = filteredCharacters.filter(char => 
                !StorageService.isFavorite(char.mal_id, this.favorites)
            );
        }

        // Aplicar ordenamiento
        switch (this.currentSort) {
            case SORT_OPTIONS.NAME_ASC:
                filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case SORT_OPTIONS.NAME_DESC:
                filteredCharacters.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case SORT_OPTIONS.FAVORITES_FIRST:
                filteredCharacters.sort((a, b) => {
                    const aFav = StorageService.isFavorite(a.mal_id, this.favorites);
                    const bFav = StorageService.isFavorite(b.mal_id, this.favorites);
                    if (aFav && !bFav) return -1;
                    if (!aFav && bFav) return 1;
                    return 0;
                });
                break;
        }

        this.isApplyingFilters = true;
        this.displayCharacters(filteredCharacters);
        this.isApplyingFilters = false;
    },

    resetFilters() {
        this.currentSort = SORT_OPTIONS.DEFAULT;
        this.currentFavoritesFilter = FILTER_OPTIONS.ALL;

        // Resetear los controles de UI
        const sortSelect = DomUtils.getElementById('sort-select');
        const favoritesFilter = DomUtils.getElementById('favorites-filter');

        if (sortSelect) sortSelect.value = SORT_OPTIONS.DEFAULT;
        if (favoritesFilter) favoritesFilter.value = FILTER_OPTIONS.ALL;

        // Reaplicar sin filtros
        this.applyFilters();
    },

    // ===== MODO DE VISTA =====
    
    setViewMode(mode) {
        this.currentViewMode = mode;
        
        const gridBtn = DomUtils.getElementById('grid-view');
        const listBtn = DomUtils.getElementById('list-view');
        const container = DomUtils.getElementById('characters-container');

        if (gridBtn && listBtn && container) {
            // Actualizar botones
            gridBtn.classList.toggle('active', mode === VIEW_MODES.GRID);
            listBtn.classList.toggle('active', mode === VIEW_MODES.LIST);

            // Actualizar contenedor
            if (mode === VIEW_MODES.LIST) {
                container.className = 'characters-list';
            } else {
                container.className = 'characters-grid';
            }

            // Actualizar cards existentes
            const cards = container.querySelectorAll('.character-card');
            cards.forEach(card => {
                if (mode === VIEW_MODES.LIST) {
                    card.classList.add('list-view');
                } else {
                    card.classList.remove('list-view');
                }
            });
        }
    }
});