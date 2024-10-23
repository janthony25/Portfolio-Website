// Main initialization
document.addEventListener("DOMContentLoaded", () => {
    PortfolioApp.initialize();
});

// Main application class
class PortfolioApp {
    static initialize() {
        new CarouselController();
        new DarkModeController();
        new GalleryController();
    }
}

// Gallery functionality
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
        }, 1200); // Matches CSS transition duration
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

// Tech Stack Carousel functionality
class CarouselController {
    constructor() {
        this.initializeElements();
        this.setupProperties();
        this.initializeCarousel();
    }

    initializeElements() {
        this.scrollContainer = document.querySelector(".tech-stack-scroll");
        this.prevButton = document.querySelector(".nav-button.prev");
        this.nextButton = document.querySelector(".nav-button.next");
    }

    setupProperties() {
        this.itemWidth = 100;
        this.visibleItems = 6;
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;
        this.currentPosition = 0;
    }

    initializeCarousel() {
        this.addDragListeners();
        this.preventImageDragging();
        this.addButtonListeners();
        this.updateCarousel();
    }

    addDragListeners() {
        // Mouse events
        this.scrollContainer.addEventListener("mousedown", this.handleDragStart.bind(this));
        this.scrollContainer.addEventListener("mousemove", this.handleDragMove.bind(this));
        this.scrollContainer.addEventListener("mouseup", this.handleDragEnd.bind(this));
        this.scrollContainer.addEventListener("mouseleave", this.handleDragEnd.bind(this));

        // Touch events
        this.scrollContainer.addEventListener("touchstart", this.handleDragStart.bind(this));
        this.scrollContainer.addEventListener("touchmove", this.handleDragMove.bind(this));
        this.scrollContainer.addEventListener("touchend", this.handleDragEnd.bind(this));
    }

    preventImageDragging() {
        const images = document.querySelectorAll(".tech-icon img");
        images.forEach(img => {
            img.addEventListener("dragstart", (e) => e.preventDefault());
        });
    }

    addButtonListeners() {
        this.prevButton.addEventListener("click", () => this.handlePrevClick());
        this.nextButton.addEventListener("click", () => this.handleNextClick());
    }

    getPositionX(event) {
        return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
    }

    setPosition() {
        const maxTranslate = -(this.scrollContainer.children.length - this.visibleItems) * this.itemWidth;
        this.currentTranslate = Math.min(0, Math.max(maxTranslate, this.currentTranslate));
        this.scrollContainer.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updateButtonVisibility();
    }

    animate() {
        this.setPosition();
        if (this.isDragging) {
            this.animationID = requestAnimationFrame(this.animate.bind(this));
        }
    }

    handleDragStart(event) {
        this.isDragging = true;
        this.startX = this.getPositionX(event);
        this.animationID = requestAnimationFrame(this.animate.bind(this));
        this.scrollContainer.style.cursor = 'grabbing';
    }

    handleDragMove(event) {
        if (!this.isDragging) return;
        
        event.preventDefault();
        this.currentPosition = this.getPositionX(event);
        this.currentTranslate = this.prevTranslate + this.currentPosition - this.startX;
    }

    handleDragEnd() {
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.prevTranslate = this.currentTranslate;
        this.snapToNearestItem();
        this.scrollContainer.style.cursor = 'grab';
    }

    snapToNearestItem() {
        this.currentIndex = Math.round(-this.currentTranslate / this.itemWidth);
        const maxIndex = this.scrollContainer.children.length - this.visibleItems;
        this.currentIndex = Math.max(0, Math.min(maxIndex, this.currentIndex));
        this.updateCarousel();
    }

    handlePrevClick() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    handleNextClick() {
        if (this.currentIndex < this.scrollContainer.children.length - this.visibleItems) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        this.currentTranslate = -this.currentIndex * this.itemWidth;
        this.prevTranslate = this.currentTranslate;
        this.setPosition();
    }

    updateButtonVisibility() {
        const maxTranslate = -(this.scrollContainer.children.length - this.visibleItems) * this.itemWidth;
        this.prevButton.style.display = this.currentTranslate < 0 ? "flex" : "none";
        this.nextButton.style.display = this.currentTranslate > maxTranslate ? "flex" : "none";
    }
}

// Dark Mode functionality
class DarkModeController {
    constructor() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.darkModeIcon = document.getElementById('darkModeIcon');
        this.initializeDarkMode();
    }

    initializeDarkMode() {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            this.darkModeToggle.classList.add('dark-mode');
        }

        // Add event listener
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        this.darkModeToggle.classList.toggle('dark-mode');
        
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', null);
        }
    }
}