// Configuration
const countDownDate = new Date('2025-07-10T05:30:00+05:30').getTime();

// DOM Elements
const elements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    progressFill: document.getElementById('progressFill'),
    progressPercent: document.getElementById('progressPercent'),
    themeToggle: document.getElementById('themeToggle'),
    loadingScreen: document.getElementById('loadingScreen')
};

// Initialize Particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ff9800' },
                shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#ff9800', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme === 'light' ? 'light-theme' : '';
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// Progress Bar
function updateProgress() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    
    // Calculate progress based on countdown time remaining
    // Using 30 days as reference for more sensitive progress
    const maxCountdownTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    let progress = 0;
    if (distance <= 0) {
        progress = 100; // Countdown finished
    } else {
        // Calculate progress: 0% when countdown is at max, 100% when countdown is 0
        progress = ((maxCountdownTime - distance) / maxCountdownTime) * 100;
    }
    
    progress = Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
    elements.progressFill.style.width = `${progress}%`;
    elements.progressPercent.textContent = `${Math.round(progress)}%`;
}

// Countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    function updateWithAnimation(elementId, newValue) {
        const element = document.getElementById(elementId);
        const currentValue = element.textContent;
        const formattedValue = newValue.toString().padStart(2, '0');
        if (currentValue !== formattedValue) {
            element.classList.add('changing');
            element.textContent = formattedValue;
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
        document.getElementById('countdown').innerHTML = `<div class="launch-message"><i class="fas fa-rocket"></i><h3>Website is loading, please wait...</h3></div>`;
    }
}

// Loading Screen
function hideLoadingScreen() {
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// Initialize everything
function init() {
    hideLoadingScreen();
    initParticles();
    initTheme();
    elements.themeToggle.addEventListener('click', toggleTheme);
    updateCountdown();
    updateProgress();
    setInterval(updateCountdown, 1000);
    setInterval(updateProgress, 1000);
}

document.addEventListener('DOMContentLoaded', init); 