// ==========================================================================
// Contact Button Hover Functionality
// ==========================================================================
function initializeContactButtonHover() {
    const contactButton = document.querySelector('.contact-button');
    const contactHoverContent = document.querySelector('.contact-hover-content');
    const profilePhotoContainer = document.querySelector('.profile-photo-container');

    if (contactButton && contactHoverContent) {
        contactButton.addEventListener('mouseenter', () => {
            // Original hover content functionality
            contactHoverContent.style.opacity = '1';
            contactHoverContent.style.visibility = 'visible';
            
            // Add profile photo animation with transition
            if (profilePhotoContainer) {
                // First set the transition
                profilePhotoContainer.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                // Then apply the transform and box-shadow
                profilePhotoContainer.style.transform = 'scale(1.05)';
                profilePhotoContainer.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.15)';
            }
        });

        contactButton.addEventListener('mouseleave', () => {
            // Original hover content functionality
            contactHoverContent.style.opacity = '0';
            contactHoverContent.style.visibility = 'hidden';
            
            // Remove profile photo animation while keeping transition
            if (profilePhotoContainer) {
                // Keep the transition for smooth return animation
                profilePhotoContainer.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                profilePhotoContainer.style.transform = '';
                profilePhotoContainer.style.boxShadow = '';
            }
        });
    }
}

// ==========================================================================
// Floating Contact Button Functionality
// ==========================================================================
function initializeFloatingContact() {
    // Create and append floating button HTML
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-contact-button';
    floatingButton.innerHTML = `
        <img src="/photos/send.png" alt="Contact">
        <span>Contact me</span>
    `;
    document.body.appendChild(floatingButton);

    // Get references to elements
    const mainContactButton = document.querySelector('.contact-button');
    const contactTabButton = document.querySelector('[data-tab="contact"]');

    // Add click handler to floating button
    floatingButton.addEventListener('click', () => {
        contactTabButton.style.display = 'block';
        contactTabButton.click();
        document.querySelector('.tabs-container').scrollIntoView({ behavior: 'smooth' });
    });

    // Function to check if main button is half visible
    const isMainButtonHalfVisible = () => {
        if (!mainContactButton) return true;
        
        const buttonRect = mainContactButton.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the button is visible in the viewport
        const visibleHeight = Math.min(buttonRect.bottom, windowHeight) - Math.max(buttonRect.top, 0);
        const buttonHeight = buttonRect.height;
        
        // If less than 50% of the button is visible, return true
        return visibleHeight < (buttonHeight / 2);
    };

    // Improved scroll detection with contact section awareness
    const handleScroll = () => {
        const isContactTabActive = document.getElementById('contact').classList.contains('active');
        const shouldShow = !isContactTabActive && isMainButtonHalfVisible();
        
        floatingButton.style.opacity = shouldShow ? '1' : '0';
        floatingButton.style.visibility = shouldShow ? 'visible' : 'hidden';
    };

    // Attach scroll listener with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();
    
    // Add tab change listener to trigger visibility check
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(handleScroll, 0);
        });
    });
}



// ==========================================================================
// Contact Button Functionality
// ==========================================================================
function initializeContactButton() {
    const contactButton = document.querySelector('.contact-button');
    const contactTabButton = document.querySelector('[data-tab="contact"]');
    
    if (contactButton) {
        contactButton.addEventListener('click', () => {
            contactTabButton.style.display = 'block'; // Show the contact tab button
            contactTabButton.click();
            document.querySelector('.tabs-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

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
    
    // Hide contact tab button if switching to a different tab
    const contactTabButton = document.querySelector('[data-tab="contact"]');
    if (targetTab !== 'contact') {
        contactTabButton.style.display = 'none';
    }
    
    button.classList.add('active');
    pane.classList.add('active');
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeGalleries();
    initializeTabs();
    initializeContactButton(); 
    initializeFloatingContact();
    initializeContactButtonHover(); 

});