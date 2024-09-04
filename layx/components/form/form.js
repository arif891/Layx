const modernRangeInputs = document.querySelectorAll('input[type="range"].modern');

modernRangeInputs.forEach(input => {
    // Set initial CSS custom properties
    input.style.setProperty('--value', input.value);
    input.style.setProperty('--min', input.min || '0');
    input.style.setProperty('--max', input.max || '100');

    // Update CSS custom property on input change
    input.addEventListener('input', () => {
        input.style.setProperty('--value', input.value);
    });
});