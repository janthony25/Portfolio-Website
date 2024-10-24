class GalleryController {
    constructor() {
        this.galleries = document.querySelectorAll('.gallery-container');
        this.initializeGalleries();
    }

    initializeGalleries() {
        this.galleries.forEach(gallery => {
            let isAnimating = false;

            gallery.addEventListener('click', () => {
                if (isAnimating) return;
                this.handleGalleryClick(gallery, () => isAnimating = false);
                isAnimating = true;
            });
        });
    }

    handleGalleryClick(gallery, callback) {
        const cards = [...gallery.querySelectorAll('.photo-card')];
        const topCard = cards[0];

        // Add sliding out animation
        topCard.classList.add('slide-out');

        // Wait for animation to complete
        setTimeout(() => {
            this.rotateCards(gallery, topCard, cards);
            callback();
        }, 500); // Matches CSS transition duration
    }

    rotateCards(gallery, topCard, cards) {
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
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new GalleryController();
});