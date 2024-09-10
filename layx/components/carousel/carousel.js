class Carousel {
    constructor(selector = 'carousel') {
        this.carousels = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.carousels.forEach(carousel => {
            const main = carousel.querySelector('.main');
            const items = carousel.querySelectorAll('.item');
            const indicators = carousel.querySelectorAll('.indicator');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            const isVertical = main.classList.contains('vertical');

            const state = {
                currentIndex: 0,
                isVertical,
                itemCount: items.length
            };

            this.setupEventListeners(carousel, state);
            this.updateCarousel(carousel, state);
        });
    }

    setupEventListeners(carousel, state) {
        const main = carousel.querySelector('.main');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        prevBtn.addEventListener('click', () => this.navigate(carousel, state, -1));
        nextBtn.addEventListener('click', () => this.navigate(carousel, state, 1));

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(carousel, state, index));
        });

        main.addEventListener('scrollend', () => {
            state.currentIndex = this.calculateCurrentIndex(main, state);
            this.updateIndicators(carousel, state);
        });
    }

    navigate(carousel, state, direction) {
        state.currentIndex = (state.currentIndex + direction + state.itemCount) % state.itemCount;
        this.updateCarousel(carousel, state);
    }

    goToSlide(carousel, state, index) {
        state.currentIndex = index;
        this.updateCarousel(carousel, state);
    }

    updateCarousel(carousel, state) {
        const main = carousel.querySelector('.main');
        if (state.isVertical) {
            main.scrollTo({
                top: state.currentIndex * main.clientHeight,
                behavior: 'smooth'
            });
        } else {
            main.scrollTo({
                left: state.currentIndex * main.clientWidth,
                behavior: 'smooth'
            });
        }
        this.updateIndicators(carousel, state);
    }

    updateIndicators(carousel, state) {
        const indicators = carousel.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.currentIndex);
        });
    }

    calculateCurrentIndex(main, state) {
        if (state.isVertical) {
            return Math.round(main.scrollTop / main.clientHeight);
        } else {
            return Math.round(main.scrollLeft / main.clientWidth);
        }
    }
}

// Usage
new Carousel();