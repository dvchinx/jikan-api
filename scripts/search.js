// Extensión para funcionalidades de búsqueda
Object.assign(JikanApp.prototype, {
    
    // ===== CONFIGURACIÓN DE BÚSQUEDA =====
    
    setupSearchListeners() {
        const searchInput = DomUtils.getElementById('character-search');
        const searchButton = DomUtils.getElementById('search-button');
        const clearButton = DomUtils.getElementById('clear-search');

        if (searchInput && searchButton && clearButton) {
            // Búsqueda al hacer clic en el botón
            searchButton.addEventListener('click', () => {
                this.performSearch();
            });

            // Búsqueda al presionar Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Limpiar búsqueda
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });

            // Mostrar/ocultar botón limpiar según el contenido
            searchInput.addEventListener('input', (e) => {
                const hasValue = e.target.value.trim().length > 0;
                clearButton.style.display = hasValue ? 'block' : 'none';
            });
        }
    },

    // ===== FUNCIONALIDADES DE BÚSQUEDA =====
    
    async performSearch() {
        const searchInput = DomUtils.getElementById('character-search');
        const query = searchInput.value.trim();

        if (!query) {
            return;
        }

        // Solo buscar en el home
        if (this.currentSection !== SECTIONS.HOME) {
            this.showSection(SECTIONS.HOME);
            // Esperar un poco para que se cargue la sección
            setTimeout(() => {
                this.performSearch();
            }, 100);
            return;
        }

        this.currentSearchQuery = query;
        this.isSearchMode = true;
        this.currentPage = 1;

        try {
            await this.searchCharacters(query);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            this.showError('Error al buscar personajes. Inténtalo de nuevo.');
        }
    },

    clearSearch() {
        const searchInput = DomUtils.getElementById('character-search');
        const clearButton = DomUtils.getElementById('clear-search');

        searchInput.value = '';
        clearButton.style.display = 'none';
        
        this.currentSearchQuery = '';
        this.isSearchMode = false;
        this.currentPage = 1;

        // Volver a cargar los personajes normalmente
        if (this.currentSection === SECTIONS.HOME) {
            this.loadCharacters();
        }
    },

    async searchCharacters(query) {
        try {
            this.toggleLoading(true);
            
            const result = await ApiService.searchCharacters(query, this.currentPage);
            
            this.toggleLoading(false);

            if (result.characters && result.characters.length > 0) {
                // Guardar resultados de búsqueda y aplicar filtros si es necesario
                this.currentCharacters = result.characters;
                if (this.currentSort !== SORT_OPTIONS.DEFAULT || this.currentFavoritesFilter !== FILTER_OPTIONS.ALL) {
                    this.applyFilters();
                } else {
                    this.displayCharacters(result.characters);
                }
                this.updateSearchPagination(result.pagination);
            } else {
                this.showNoResults(query);
            }

        } catch (error) {
            this.toggleLoading(false);
            throw error;
        }
    },

    showNoResults(query) {
        if (this.charactersContainer) {
            this.charactersContainer.innerHTML = DomUtils.createNoResultsMessage(
                query, 
                'jikanApp.clearSearch()'
            );
        }
        this.hidePagination();
    },

    updateSearchPagination(pagination) {
        if (!pagination) {
            this.hidePagination();
            return;
        }

        this.maxPage = pagination.last_visible_page;
        this.hasNextPage = pagination.has_next_page;
        
        this.createSearchPagination(pagination);
    },

    createSearchPagination(pagination) {
        if (!this.paginationContainer) return;

        const paginationElement = DomUtils.createPagination(
            pagination,
            (page) => this.searchPage(page)
        );

        this.paginationContainer.innerHTML = '';
        this.paginationContainer.appendChild(paginationElement);
        this.paginationContainer.style.display = 'block';
    },

    async searchPage(page) {
        this.currentPage = page;
        await this.searchCharacters(this.currentSearchQuery);
    }
});