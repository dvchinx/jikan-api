// Extensión de JikanApp para funcionalidades del modal informativo
Object.assign(JikanApp.prototype, {
    
    // ===== MODAL INFORMATIVO =====
    
    showInfoModal() {
        const modal = DomUtils.getElementById('info-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
            
            // Agregar listener para cerrar con ESC
            this.addEscapeListener();
            
            // Agregar listener para cerrar al hacer click fuera del modal
            this.addOutsideClickListener();
        }
    },

    closeInfoModal() {
        const modal = DomUtils.getElementById('info-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll del body
            
            // Remover listeners
            this.removeEscapeListener();
            this.removeOutsideClickListener();
        }
    },

    // Listener para cerrar con tecla ESC
    addEscapeListener() {
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeInfoModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    },

    removeEscapeListener() {
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
            this.escapeHandler = null;
        }
    },

    // Listener para cerrar al hacer click fuera del modal
    addOutsideClickListener() {
        this.outsideClickHandler = (e) => {
            const modal = DomUtils.getElementById('info-modal');
            const modalContent = modal?.querySelector('.modal-content');
            
            if (modal && e.target === modal && !modalContent?.contains(e.target)) {
                this.closeInfoModal();
            }
        };
        
        const modal = DomUtils.getElementById('info-modal');
        if (modal) {
            modal.addEventListener('click', this.outsideClickHandler);
        }
    },

    removeOutsideClickListener() {
        if (this.outsideClickHandler) {
            const modal = DomUtils.getElementById('info-modal');
            if (modal) {
                modal.removeEventListener('click', this.outsideClickHandler);
            }
            this.outsideClickHandler = null;
        }
    }
});