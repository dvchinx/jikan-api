// Controlador principal de la aplicación
class JikanApp {
    constructor() {
        // Elementos del DOM
        this.charactersContainer = null;
        this.loadingElement = null;
        this.paginationContainer = null;
        
        // Estado de la aplicación
        this.currentPage = 1;
        this.maxPage = null;
        this.hasNextPage = true;
        this.currentView = 'list';
        this.selectedCharacter = null;
        this.currentSection = SECTIONS.HOME;
        
        // Estado de búsqueda
        this.currentSearchQuery = '';
        this.isSearchMode = false;
        
        // Estado de filtros
        this.currentSort = SORT_OPTIONS.DEFAULT;
        this.currentFavoritesFilter = FILTER_OPTIONS.ALL;
        this.currentViewMode = VIEW_MODES.GRID;
        this.currentCharacters = [];
        this.isApplyingFilters = false;
        
        // Favoritos
        this.favorites = StorageService.loadFavorites();
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDOMElements();
            this.setupEventListeners();
            DomUtils.updateFavoritesCount(StorageService.getFavoritesCount(this.favorites));
            this.loadCharacters();
        });

        // Agregar listener global para errores de imágenes
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                DomUtils.handleImageError(e.target);
            }
        }, true);
    }

    setupDOMElements() {
        this.charactersContainer = DomUtils.getElementById('characters-container');
        this.loadingElement = DomUtils.getElementById('loading');
        this.paginationContainer = DomUtils.getElementById('pagination-container');
    }

    setupEventListeners() {
        this.setupSearchListeners();
        this.setupFilterListeners();
    }

    // ===== NAVEGACIÓN =====
    
    showSection(section) {
        this.currentSection = section;
        
        // Actualizar navegación
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        DomUtils.getElementById(`${section}-tab`).classList.add('active');
        
        // Ocultar/mostrar contenedores según la sección
        const charactersContainer = DomUtils.getElementById('characters-container');
        const paginationContainer = DomUtils.getElementById('pagination-container');
        const explorerContainer = DomUtils.getElementById('explorer-container');
        const filterControls = DomUtils.getElementById('filter-controls');
        
        if (section === SECTIONS.HOME) {
            this.currentView = 'list';
            charactersContainer.style.display = 'grid';
            paginationContainer.style.display = 'block';
            explorerContainer.style.display = 'none';
            filterControls.style.display = 'block';
            
            // Si está en modo búsqueda, mantener la búsqueda
            if (this.isSearchMode && this.currentSearchQuery) {
                this.searchCharacters(this.currentSearchQuery);
            } else {
                this.loadCharacters(this.currentPage);
                this.showPagination();
            }
        } else if (section === SECTIONS.FAVORITES) {
            charactersContainer.style.display = 'grid';
            paginationContainer.style.display = 'none';
            explorerContainer.style.display = 'none';
            filterControls.style.display = 'none';
            this.showFavorites();
            this.hidePagination();
        } else if (section === SECTIONS.EXPLORER) {
            charactersContainer.style.display = 'none';
            paginationContainer.style.display = 'none';
            explorerContainer.style.display = 'block';
            filterControls.style.display = 'none';
            this.showExplorer();
        }
    }

    // ===== CARGA DE PERSONAJES =====
    
    async loadCharacters(page = this.currentPage) {
        try {
            this.toggleLoading(true);
            
            const result = await ApiService.fetchCharacters(page);
            
            if (result.characters && result.characters.length > 0) {
                this.currentPage = page;
                
                // Guardar personajes y aplicar filtros si es necesario
                this.currentCharacters = result.characters;
                if (this.currentSort !== SORT_OPTIONS.DEFAULT || this.currentFavoritesFilter !== FILTER_OPTIONS.ALL) {
                    this.applyFilters();
                } else {
                    this.displayCharacters(result.characters);
                }
                
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

    displayCharacters(characters) {
        if (!this.charactersContainer) {
            console.error('Contenedor de personajes no encontrado');
            return;
        }

        // Guardar personajes actuales si no es una aplicación de filtros
        if (!this.isApplyingFilters) {
            this.currentCharacters = characters;
        }

        // Limpiar contenedor
        this.charactersContainer.innerHTML = '';

        characters.forEach(character => {
            const isFavorite = StorageService.isFavorite(character.mal_id, this.favorites);
            const characterCard = DomUtils.createCharacterCard(
                character, 
                isFavorite,
                (char, btn) => this.toggleFavoriteUI(char, btn),
                (charId) => this.showCharacterDetails(charId)
            );
            
            // Aplicar vista actual
            if (this.currentViewMode === VIEW_MODES.LIST) {
                characterCard.classList.add('list-view');
            }
            
            this.charactersContainer.appendChild(characterCard);
        });

        // Asegurar que el contenedor tenga la clase correcta
        if (this.currentViewMode === VIEW_MODES.LIST) {
            this.charactersContainer.className = 'characters-list';
        } else {
            this.charactersContainer.className = 'characters-grid';
        }
    }

    // Continúa en el siguiente archivo...
}