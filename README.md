# 📁 Estructura Modular de Scripts

La aplicación Jikan API tiene una arquitectura modular para mejorar la mantenibilidad, escalabilidad y organización del código.

## 🗂️ Estructura de Archivos

### **scripts/config.js**
- **Propósito:** Configuración y constantes globales
- **Contenido:** URLs de API, límites de paginación, claves de almacenamiento, opciones de filtros
- **Uso:** Centraliza toda la configuración en un solo lugar

### **scripts/storage.js**
- **Propósito:** Manejo de LocalStorage
- **Funciones:** Cargar/guardar favoritos, verificar estado de favoritos
- **Beneficios:** Abstrae la lógica de persistencia de datos

### **scripts/api.js**
- **Propósito:** Comunicación con la API de Jikan
- **Funciones:** Fetch de personajes, búsquedas, detalles, anime relacionado
- **Beneficios:** Centraliza todas las llamadas HTTP

### **scripts/dom-utils.js**
- **Propósito:** Utilidades para manipulación del DOM
- **Funciones:** Creación de elementos, mensajes de estado, manejo de imágenes
- **Beneficios:** Reutilización de código UI

### **scripts/app-core.js**
- **Propósito:** Clase principal de la aplicación
- **Contenido:** Constructor, inicialización, navegación básica, carga de personajes
- **Rol:** Núcleo de la aplicación

### **scripts/search.js**
- **Propósito:** Funcionalidades de búsqueda
- **Funciones:** Búsqueda por texto, paginación de resultados, limpieza de búsqueda
- **Integración:** Extiende JikanApp con métodos de búsqueda

### **scripts/filters.js**
- **Propósito:** Sistema de filtros y ordenamiento
- **Funciones:** Filtros por favoritos, ordenamiento alfabético, vista grid/list
- **Beneficios:** Funcionalidades avanzadas de filtrado

### **scripts/favorites.js**
- **Propósito:** Manejo de favoritos
- **Funciones:** Toggle de favoritos, actualización de UI, vista de favoritos
- **Integración:** Se conecta con storage.js para persistencia

### **scripts/explorer.js**
- **Propósito:** Explorador de anime
- **Funciones:** Recomendaciones basadas en favoritos, visualización de anime
- **Características:** Funcionalidad única de descubrimiento

### **scripts/navigation.js**
- **Propósito:** Navegación y utilidades generales
- **Funciones:** Detalles de personajes, paginación, manejo de errores
- **Rol:** Funcionalidades de navegación y UI

### **scripts/main.js**
- **Propósito:** Inicialización y punto de entrada
- **Funciones:** Instanciación de la app, funciones globales para HTML
- **Rol:** Orquestador principal

## 🔄 Flujo de Carga

1. **config.js** - Define todas las constantes
2. **storage.js** - Prepara servicios de almacenamiento
3. **api.js** - Configura servicios de API
4. **dom-utils.js** - Utilitades de DOM disponibles
5. **app-core.js** - Clase principal definida
6. **search.js** - Extiende funcionalidades de búsqueda
7. **filters.js** - Extiende funcionalidades de filtros
8. **favorites.js** - Extiende funcionalidades de favoritos
9. **explorer.js** - Extiende funcionalidades del explorador
10. **navigation.js** - Extiende navegación y utilidades
11. **main.js** - Inicializa la aplicación

## 🔧 Extensibilidad

Para agregar nuevas funcionalidades:

1. **Nueva funcionalidad simple:** Agregar al archivo correspondiente
2. **Nueva sección:** Crear nuevo archivo y extender JikanApp
3. **Nuevo servicio:** Crear archivo independiente en /scripts
4. **Nueva configuración:** Agregar a config.js

## 📊 Comparación

| Aspecto | Modular |
|---------|-----------------|
| Líneas por archivo | 50-200 |
| Localización bugs | Fácil |
| Agregar features | Simple |
| Testing | Granular |
| Colaboración | Paralela |

## ✍️ Copyright
Jesús Flórez (dvchinx)