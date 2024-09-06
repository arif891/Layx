export default class Accordion {
    constructor(selector = 'accordion') {
      this.accordions = document.querySelectorAll(selector);
      this.init();
    }
  
    init() {
      this.accordions.forEach(accordion => {
        accordion.addEventListener('click', this.toggleAccordion.bind(this));
      });
    }
  
    toggleAccordion(event) {
      const title = event.target.closest('.title');
      if (!title) return;
  
      const currentItem = title.closest('.item');
      const allItems = currentItem.closest('accordion').querySelectorAll('.item');
  
      currentItem.classList.toggle('active');
  
      allItems.forEach(item => {
        if (item !== currentItem) {
          item.classList.remove('active');
        }
      });
    }
  }