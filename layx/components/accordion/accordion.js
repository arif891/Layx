export default function accordion() {
const accordions = document.querySelectorAll("accordion");

accordions.forEach(accordion => {
    accordion.addEventListener("click", (event) => {
        const title = event.target.closest('.accordion-title');
        if (!title) return;

        const item = title.closest('.accordion-item');
        const items = accordion.querySelectorAll(".accordion-item");
        item.classList.toggle('active');
        items.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove("active");
            }
        });
    });
});
}