class Sheet {
    constructor(selector = 'sheet') {
        this.sheets = document.querySelectorAll(selector);
        this.dragThreshold = 0.4; // 40% of sheet size
        this.init();
    }

    init() {
        this.addTriggerListeners();
        this.addCloseButtonListeners();
        this.addBackdropListeners();
        this.addDragListeners();
    }

    addTriggerListeners() {
        document.querySelectorAll('[data-sheet-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = trigger.getAttribute('data-sheet-target');
                const targetSheet = document.querySelector(targetId);
                if (targetSheet) {
                    this.toggleSheet(targetSheet);
                }
            });
        });
    }

    addCloseButtonListeners() {
        document.querySelectorAll('.close').forEach(closeButton => {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                const sheet = closeButton.closest('sheet');
                if (sheet) {
                    this.closeSheet(sheet);
                }
            });
        });
    }

    addBackdropListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'backdrop') {
                const sheet = e.target.previousElementSibling;
                if (sheet && (sheet.tagName.toLowerCase() === 'sheet' || sheet.classList.contains('sheet'))) {
                    this.closeSheet(sheet);
                }
            }
        });
    }

    addDragListeners() {
        this.sheets.forEach(sheet => {
            let startY, startX;
            let currentY, currentX;
            let isDragging = false;

            const onTouchStart = (e) => {
                startY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
                isDragging = true;
                sheet.style.transition = 'none';
            };

            const onTouchMove = (e) => {
                if (!isDragging) return;

                currentY = e.touches[0].clientY;
                currentX = e.touches[0].clientX;

                const deltaY = currentY - startY;
                const deltaX = currentX - startX;

                if (sheet.classList.contains('top')) {
                    sheet.style.transform = `translateY(${Math.min(0, deltaY)}px)`;
                } else if (sheet.classList.contains('bottom')) {
                    sheet.style.transform = `translateY(${Math.max(0, deltaY)}px)`;
                } else if (sheet.classList.contains('left')) {
                    sheet.style.transform = `translateX(${Math.min(0, deltaX)}px)`;
                } else if (sheet.classList.contains('right')) {
                    sheet.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
                }
            };

            const onTouchEnd = () => {
                if (!isDragging) return;

                isDragging = false;
                sheet.style.transition = '';

                const sheetRect = sheet.getBoundingClientRect();
                const threshold = this.dragThreshold * (
                    sheet.classList.contains('top') || sheet.classList.contains('bottom')
                        ? sheetRect.height
                        : sheetRect.width
                );

                const deltaY = currentY - startY;
                const deltaX = currentX - startX;

                let shouldClose = false;

                if (sheet.classList.contains('top')) {
                    shouldClose = deltaY < -threshold;
                } else if (sheet.classList.contains('bottom')) {
                    shouldClose = deltaY > threshold;
                } else if (sheet.classList.contains('left')) {
                    shouldClose = deltaX < -threshold;
                } else if (sheet.classList.contains('right')) {
                    shouldClose = deltaX > threshold;
                }

                if (shouldClose) {
                    this.closeSheet(sheet);
                } else {
                    sheet.style.transform = '';
                }
            };

            const draggbleArea = document.querySelector('.draggable-area');

            if (draggbleArea) {
                draggbleArea.addEventListener('touchstart', onTouchStart);
                draggbleArea.addEventListener('touchmove', onTouchMove);
                draggbleArea.addEventListener('touchend', onTouchEnd);
            } else {
                sheet.addEventListener('touchstart', onTouchStart);
                sheet.addEventListener('touchmove', onTouchMove);
                sheet.addEventListener('touchend', onTouchEnd);
            }
        });
    }

    openSheet(sheet) {
        sheet.setAttribute('open', '');
        sheet.style.transform = '';
        if (!sheet.classList.contains('none-modal')) {
            let sheetBackdrop = sheet.parentElement.querySelector('backdrop');
            if (!sheetBackdrop) {
                sheetBackdrop = document.createElement('backdrop');
                sheetBackdrop.classList.add('sheet-backdrop');
                sheet.insertAdjacentElement('afterend', sheetBackdrop);
            }
            sheetBackdrop.setAttribute('open', '');
        }
    }

    closeSheet(sheet) {
        sheet.removeAttribute('open');
        sheet.style.transform = '';
        if (!sheet.classList.contains('none-modal')) {
            let sheetBackdrop = sheet.nextElementSibling;
            if (sheetBackdrop && sheetBackdrop.tagName.toLowerCase() === 'backdrop') {
                sheetBackdrop.removeAttribute('open');
            }
        }
    }

    toggleSheet(sheet) {
        if (sheet.hasAttribute('open')) {
            this.closeSheet(sheet);
        } else {
            this.openSheet(sheet);
        }
    }

}

export default new Sheet();