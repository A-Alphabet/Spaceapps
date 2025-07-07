// Set a fixed target date (5 days from when this was created)
const countDownDate = new Date('2025-07-12T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Function to update with animation
    function updateWithAnimation(elementId, newValue) {
        const element = document.getElementById(elementId);
        const currentValue = element.textContent;
        if (currentValue !== newValue.toString().padStart(2, '0')) {
            element.classList.add('changing');
            element.textContent = newValue.toString().padStart(2, '0');
            setTimeout(() => {
                element.classList.remove('changing');
            }, 300);
        }
    }

    updateWithAnimation('days', days);
    updateWithAnimation('hours', hours);
    updateWithAnimation('minutes', minutes);
    updateWithAnimation('seconds', seconds);

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = "We're live!";
    }
}

setInterval(updateCountdown, 1000);
updateCountdown(); 