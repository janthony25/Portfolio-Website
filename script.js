// ==========================================================================
// Gallery Functionality
// ==========================================================================
function initializeGalleries() {
    const galleries = document.querySelectorAll('.gallery-container');
    
    galleries.forEach(gallery => {
        let isAnimating = false;

        gallery.addEventListener('click', () => {
            if (isAnimating) return;
            handleGalleryClick(gallery, () => isAnimating = false);
            isAnimating = true;
        });
    });
}

function handleGalleryClick(gallery, callback) {
    const cards = [...gallery.querySelectorAll('.photo-card')];
    const topCard = cards[0];

    // Add sliding out animation
    topCard.classList.add('slide-out');

    // Wait for animation to complete
    setTimeout(() => {
        rotateCards(gallery, topCard, cards);
        callback();
    }, 500); // Matches CSS transition duration
}

function rotateCards(gallery, topCard, cards) {
    // Move top card to bottom
    gallery.appendChild(topCard);
    
    // Remove the slide-out class
    topCard.classList.remove('slide-out');
    
    // Update positions for remaining cards
    cards.forEach((card, index) => {
        if (index > 0) {
            card.classList.add('moving-up');
            // Remove the class after the position update
            setTimeout(() => {
                card.classList.remove('moving-up');
            }, 50);
        }
    });
}

// ==========================================================================
// Tab Functionality
// ==========================================================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            switchTab(targetTab, tabButtons, tabPanes);
        });
    });
}

function switchTab(targetTab, tabButtons, tabPanes) {
    // Remove active class from all buttons and panes
    tabButtons.forEach(button => button.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Add active class to target button and pane
    const button = document.querySelector(`[data-tab="${targetTab}"]`);
    const pane = document.getElementById(targetTab);
    
    button.classList.add('active');
    pane.classList.add('active');
}

// ==========================================================================
// Modal Functionality
// ==========================================================================
function loadModals() {
    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }

    // Load modals from modals.html
    fetch('modals.html')
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            initializeModals();
            // Initialize galleries inside modals after loading
            initializeGalleries();
        })
        .catch(error => console.error('Error loading modals:', error));
}

function initializeModals() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            openModal(modalId);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.closest('.modal').id;
            closeModal(modalId);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Initialize modal gallery functionality
    const modalGalleries = document.querySelectorAll('.modal .gallery-container');
    modalGalleries.forEach(gallery => {
        let isAnimating = false;
        gallery.addEventListener('click', () => {
            if (isAnimating) return;
            handleGalleryClick(gallery, () => isAnimating = false);
            isAnimating = true;
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex'; // Changed to flex for centering
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
// Add escape key listener for modals
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (window.getComputedStyle(modal).display === 'block' || 
                window.getComputedStyle(modal).display === 'flex') {
                closeModal(modal.id);
            }
        });
    }
});

// ==========================================================================
// Initialization
// ==========================================================================
// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGalleries();
    initializeTabs();
    loadModals();
});