// Extensión para funcionalidades del explorador
Object.assign(JikanApp.prototype, {
    
    // ===== EXPLORADOR DE ANIME =====
    
    async showExplorer() {
        const explorerContainer = DomUtils.getElementById('explorer-container');
        const animeRecommendations = DomUtils.getElementById('anime-recommendations');
        
        if (!explorerContainer || !animeRecommendations) {
            console.error('Contenedores del explorador no encontrados');
            return;
        }

        // Mostrar loading
        animeRecommendations.innerHTML = DomUtils.createExplorerLoadingElement();

        try {
            const favoriteCharacters = StorageService.getFavoritesList(this.favorites);
            const recommendedAnime = await ApiService.fetchAnimeFromFavoriteCharacters(favoriteCharacters);
            
            animeRecommendations.innerHTML = '';

            if (recommendedAnime.length === 0) {
                animeRecommendations.innerHTML = DomUtils.createNoRecommendationsMessage(
                    'jikanApp.showSection("home")'
                );
            } else {
                recommendedAnime.forEach(anime => {
                    const animeCard = DomUtils.createAnimeCard(
                        anime,
                        (url) => window.open(url, '_blank')
                    );
                    animeRecommendations.appendChild(animeCard);
                });
            }

        } catch (error) {
            console.error('Error mostrando explorer:', error);
            animeRecommendations.innerHTML = `
                <div class="no-recommendations">
                    <h3>❌ Error cargando recomendaciones</h3>
                    <p>Hubo un problema obteniendo las recomendaciones. Inténtalo de nuevo más tarde.</p>
                    <button class="nav-button" onclick="jikanApp.showExplorer()" style="margin-top: 1rem;">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
});