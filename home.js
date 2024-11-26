// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {

// Get all the container items
const containerItems = document.querySelectorAll('.container-item');


// Loop through each item and add event listeners for mouseover and mouseout
containerItems.forEach(item => {
    // Mouseover effect
    item.addEventListener('mouseover', () => {
        item.style.transform = 'scale(1.1)';
    });

    // Mouseout effect
    item.addEventListener('mouseout', () => {
        if (!hoverDisabled) { // Only reset styles if not disabled
            item.style.transform = 'scale(1)'; // Reset scale
        }
        hoverDisabled = true;

    })

    // Loop through each item and add event listeners for mouseover and mouseout on the <h3> tag
containerItems.forEach(item => {
    const heading = item.querySelector('h3'); // Get the heading element

    // Mouseover effect for the heading
    heading.addEventListener('mouseover', () => {
        heading.style.color = '#f39c12'; // Change text color to yellow
        heading.style.fontSize = '18px'; // Increase font size
    });

    // Mouseout effect for the heading
    heading.addEventListener('mouseout', () => {
        heading.style.color = 'black'; // Reset text color
        heading.style.fontSize = '16px'; // Reset font size
    });

    
})})});
