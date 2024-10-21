const carousel = document.querySelector('.carousel');

function scrollLeft() {
    carousel.scrollBy({
        left: -150,
        behavior: 'smooth'
    });
}

function scrollRight() {
    carousel.scrollBy({
        left: 150,
        behavior: 'smooth'
    });
}
