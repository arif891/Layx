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

            const state = this.createState(main, items);
            this.setupDOM(carousel, items);
            this.setupEventListeners(carousel, state);
            this.updateCarousel(carousel, state);
        });
    }

    createState(main, items) {
        return {
            currentIndex: 0,
            isVertical: main.classList.contains('vertical'),
            itemCount: items.length,
            itemSizes: Array.from(items).map(item => 
                this.isVertical ? item.offsetHeight : item.offsetWidth
            ),
            totalSize: Array.from(items).reduce((sum, item) => 
                sum + (this.isVertical ? item.offsetHeight : item.offsetWidth), 0
            ),
        };
    }

    setupDOM(carousel, items) {
        this.ensureControls(carousel);
        this.ensureIndicators(carousel, items.length);
    }

    ensureControls(carousel) {
        if (!carousel.hasAttribute('controls')) return;

        const controlWrapper = document.createElement('div');
        controlWrapper.className = 'control-wrapper';
        ['prev', 'next'].forEach(direction => {
            const button = document.createElement('button');
            button.className = direction;
            button.textContent = direction.charAt(0).toUpperCase() + direction.slice(1);
            controlWrapper.appendChild(button);
        });
        carousel.appendChild(controlWrapper);
    }

    ensureIndicators(carousel, itemCount) {
        if (!carousel.hasAttribute('indicators')) return;

        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.className = 'indicator-wrapper';
        for (let i = 0; i < itemCount; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('data-index', i);
            indicatorWrapper.appendChild(indicator);
        }
        carousel.appendChild(indicatorWrapper);
    }

    setupEventListeners(carousel, state) {
        const main = carousel.querySelector('.main');
        carousel.addEventListener('click', this.handleClick.bind(this, carousel, state));
        main.addEventListener('scroll', this.debounce(this.handleScroll.bind(this, carousel, state), 100));
    }

    handleClick(carousel, state, event) {
        const { target } = event;
        if (target.classList.contains('prev')) this.navigate(carousel, state, -1);
        else if (target.classList.contains('next')) this.navigate(carousel, state, 1);
        else if (target.classList.contains('indicator')) {
            const index = parseInt(target.getAttribute('data-index'), 10);
            this.goToSlide(carousel, state, index);
        }
    }

    handleScroll(carousel, state) {
        const main = carousel.querySelector('.main');
        state.currentIndex = this.calculateCurrentIndex(main, state);
        this.updateIndicators(carousel, state);
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
        const scrollPosition = this.calculateScrollPosition(state);
        const scrollOptions = {
            [state.isVertical ? 'top' : 'left']: scrollPosition,
            behavior: 'smooth'
        };
        main.scrollTo(scrollOptions);
        this.updateIndicators(carousel, state);
    }

    updateIndicators(carousel, state) {
        carousel.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === state.currentIndex);
        });
    }

    calculateCurrentIndex(main, state) {
        const scrollPosition = state.isVertical ? main.scrollTop : main.scrollLeft;
        let accumulatedSize = 0;
        for (let i = 0; i < state.itemCount; i++) {
            if (accumulatedSize + state.itemSizes[i] / 2 > scrollPosition) {
                return i;
            }
            accumulatedSize += state.itemSizes[i];
        }
        return state.itemCount - 1;
    }

    calculateScrollPosition(state) {
        return state.itemSizes.slice(0, state.currentIndex).reduce((sum, size) => sum + size, 0);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

export default new Carousel();