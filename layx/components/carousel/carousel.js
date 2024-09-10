class Carousel {
    constructor(selector = 'carousel') {
        this.carousels = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.carousels.forEach(carousel => {
            const main = carousel.querySelector('.main');
            const items = carousel.querySelectorAll('.item');

            if (!main || items.length === 0) return;

            // Add controls and indicators if they do not exist
            this.ensureControls(carousel);
            this.ensureIndicators(carousel, items);

            const state = {
                currentIndex: 0,
                isVertical: main.classList.contains('vertical'),
                itemCount: items.length,
            };

            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            const indicatorsWrapper = carousel.querySelector('.indicator-warper');

            this.setupEventListeners(carousel, state, prevBtn, nextBtn, indicatorsWrapper);
            this.updateCarousel(carousel, state); // Ensure initial update
        });
    }

    ensureIndicators(carousel, items) {
        let indicatorWrapper = carousel.querySelector('.indicator-warper');

        if (!indicatorWrapper && carousel.hasAttribute('indicators')) {
            indicatorWrapper = document.createElement('div');
            indicatorWrapper.classList.add('indicator-warper');
            carousel.appendChild(indicatorWrapper);
        }

        if (indicatorWrapper && !carousel.querySelectorAll('.indicator').length) {
            // Clear out any existing indicators to avoid duplicates
            indicatorWrapper.innerHTML = '';

            items.forEach((item, index) => {
                const indicatorButton = document.createElement('button');
                indicatorButton.classList.add('indicator');
                indicatorButton.setAttribute('index', index);
                indicatorWrapper.appendChild(indicatorButton);
            });
        }
    }

    ensureControls(carousel) {
        let controlWrapper = carousel.querySelector('.control-warper');

        if (!controlWrapper && carousel.hasAttribute('controls')) {
            controlWrapper = document.createElement('div');
            controlWrapper.classList.add('control-warper');

            const leftControl = document.createElement('div');
            leftControl.classList.add('left');
            const prevButton = document.createElement('button');
            prevButton.classList.add('prev');
            prevButton.textContent = 'Prev';
            leftControl.appendChild(prevButton);

            const rightControl = document.createElement('div');
            rightControl.classList.add('right');
            const nextButton = document.createElement('button');
            nextButton.classList.add('next');
            nextButton.textContent = 'Next';
            rightControl.appendChild(nextButton);

            controlWrapper.appendChild(leftControl);
            controlWrapper.appendChild(rightControl);

            carousel.appendChild(controlWrapper);
        }
    }

    setupEventListeners(carousel, state, prevBtn, nextBtn, indicatorsWrapper) {
        // Event listeners for controls
        prevBtn?.addEventListener('click', () => this.navigate(carousel, state, -1));
        nextBtn?.addEventListener('click', () => this.navigate(carousel, state, 1));

        // Event delegation for indicators
        indicatorsWrapper?.addEventListener('click', (event) => {
            if (event.target.matches('.indicator')) {
                const index = parseInt(event.target.getAttribute('index'), 10);
                this.goToSlide(carousel, state, index);
            }
        });

        // Scroll event handling with debouncing
        const main = carousel.querySelector('.main');
        let scrollTimeout;
        main?.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                state.currentIndex = this.calculateCurrentIndex(main, state);
                this.updateIndicators(carousel, state);
            }, 100);
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
        const scrollPosition = state.isVertical
            ? { top: state.currentIndex * main.clientHeight, behavior: 'smooth' }
            : { left: state.currentIndex * main.clientWidth, behavior: 'smooth' };

        main.scrollTo(scrollPosition);
        this.updateIndicators(carousel, state);
    }

    updateIndicators(carousel, state) {
        const indicators = carousel.querySelectorAll('.indicator');
        indicators?.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.currentIndex);
        });
    }

    calculateCurrentIndex(main, state) {
        return state.isVertical
            ? Math.round(main.scrollTop / main.clientHeight)
            : Math.round(main.scrollLeft / main.clientWidth);
    }
}

export default new Carousel();