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
    const headerContainer = document.querySelector('.header-container');

    // Add click handler to floating button
    floatingButton.addEventListener('click', () => {
        contactTabButton.style.display = 'block';
        contactTabButton.click();
        document.querySelector('.tabs-container').scrollIntoView({ behavior: 'smooth' });
    });

    // Function to check if main contact button is visible
    const isMainButtonHidden = () => {
        const computedStyle = window.getComputedStyle(mainContactButton);
        return computedStyle.display === 'none';
    };

    // Improved scroll detection with contact section awareness
    const handleScroll = () => {
        const headerRect = headerContainer.getBoundingClientRect();
        const isContactTabActive = document.getElementById('contact').classList.contains('active');
        
        // Show floating button when header is out of view OR main button is hidden (after tab change)
        const shouldShow = !isContactTabActive && (headerRect.bottom < 0 || isMainButtonHidden());
        
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
            setTimeout(handleScroll, 0); // Run after tab change is complete
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
});