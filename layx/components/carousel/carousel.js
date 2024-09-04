const carousel = document.getElementById('carouselInner');
const items = carousel.querySelectorAll('.portfolio__items');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const indicators = document.querySelectorAll('.indicators');

let currentSlide = 0;

// Function to update carousel indicators
const updateIndicators = () => {
  indicators.forEach((indicator, index) => {
    if (index === currentSlide) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
};

// Event listener for next button
nextBtn.addEventListener('click', () => {
  currentSlide++;
  if (currentSlide >= items.length) currentSlide = 0;
  carousel.scrollTo({ left: currentSlide * carousel.offsetWidth, behavior: 'smooth' });
  updateIndicators();
});

// Event listener for previous button
prevBtn.addEventListener('click', () => {
  currentSlide--;
  if (currentSlide < 0) currentSlide = items.length - 1;
  carousel.scrollTo({ left: currentSlide * carousel.offsetWidth, behavior: 'smooth' });
  updateIndicators();
});

// Event listener for indicator buttons
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    currentSlide = index;
    carousel.scrollTo({ left: currentSlide * carousel.offsetWidth, behavior: 'smooth' });
    updateIndicators();
  });
});

// Listen for scroll event on carousel container
carousel.addEventListener('scroll', () => {
  const scrollPosition = carousel.scrollLeft;
  const slideWidth = carousel.offsetWidth;
  currentSlide = Math.round(scrollPosition / slideWidth);
  updateIndicators();
});

// Initially update indicators
updateIndicators();