  
  // Initialize carousel when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new CarouselController();
  });


class CarouselController {
    constructor() {
      // DOM Elements
      this.scrollContainer = document.querySelector(".tech-stack-scroll");
      this.prevButton = document.querySelector(".nav-button.prev");
      this.nextButton = document.querySelector(".nav-button.next");
      
      // Configuration
      this.itemWidth = 100;
      this.visibleItems = 6;
      
      // State
      this.currentIndex = 0;
      this.isDragging = false;
      this.startX = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.animationID = null;
      this.currentPosition = 0;
  
      this.initializeCarousel();
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
