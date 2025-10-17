// Archivo principal - Inicialización de la aplicación
// Instancia global de la aplicación
let jikanApp;

// Inicializar la aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    jikanApp = new JikanApp();
});

// Funciones globales para compatibilidad con onclick en HTML
window.jikanApp = {
    showSection: (section) => jikanApp?.showSection(section),
    clearSearch: () => jikanApp?.clearSearch(),
    showExplorer: () => jikanApp?.showExplorer(),
    backToList: () => jikanApp?.backToList(),
    loadCharacters: () => jikanApp?.loadCharacters(),
    goToPage: (page) => jikanApp?.goToPage(page)
};