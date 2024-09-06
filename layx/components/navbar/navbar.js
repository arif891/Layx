class Navbar {
    constructor(navbarElement) {
        this.navbar = navbarElement;
        this.navbarWarp = this.navbar.querySelector('.warp-able');
        this.navbarToggler = this.navbar.querySelector('.toggler');
        this.navbarCloseBtn = this.navbar.querySelector('.close');
        this.navbarBackdrop = this.navbar.querySelector('backdrop') || null;
        this.previousScrollPosition = window.scrollY;
        this.scrollDistance = window.innerHeight * 0.2;

        this.initialize();
    }

    initialize() {
        this.navbarToggler.addEventListener('click', () => this.handleTogglerClick());

        if (this.navbarCloseBtn) {
            this.navbarCloseBtn.addEventListener('click', () => this.toggleNavbar());
        }

        if (this.navbar.classList.contains('update-scroll-state')) {
            window.addEventListener('scroll', () => this.updateScrollState(), { passive: true });
        }
    }

    handleTogglerClick() {
        if (!this.navbarBackdrop && !this.navbarWarp.classList.contains('full')) {
            this.navbarBackdrop = document.createElement('backdrop');
            this.navbarBackdrop.classList.add('navbar-backdrop');
            this.navbarBackdrop.addEventListener('click', () => this.toggleNavbar());

            this.navbarWarp.insertAdjacentElement('afterend', this.navbarBackdrop);
        }
        this.toggleNavbar();
    }

    toggleNavbar() {
        this.navbar.classList.toggle('open');
        this.navbarWarp.classList.toggle('open');

        if (this.navbarBackdrop && !this.navbarWarp.classList.contains('full')) {
            this.navbarBackdrop.classList.toggle('open');
        }

        document.body.style.overflow = this.navbar.classList.contains('open') ? 'hidden' : '';
    }

    updateScrollState() {
        const scrolledPastDistance = window.scrollY > this.scrollDistance;
        const scrollingDown = this.previousScrollPosition < window.scrollY && window.scrollY > this.scrollDistance * 3;

        this.navbar.classList.toggle('scrolled', scrolledPastDistance);
        this.navbar.classList.toggle('scrollingDown', scrollingDown);
        this.previousScrollPosition = window.scrollY;
    }

    static initializeAll() {
        const navbars = document.querySelectorAll('navbar');
        navbars.forEach(navbar => new Navbar(navbar));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Navbar.initializeAll();
});

// Export an instance of Navbar to initialize it when imported
export default Navbar;