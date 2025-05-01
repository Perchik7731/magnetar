const monster = document.getElementById('monster');
const clickSound = document.getElementById('click-sound');
clickSound.volume = 0.1;

const counter = document.getElementById('clicks-count');
const progressBar = document.getElementById('progress-bar');
const levelText = document.getElementById('level-text');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const menuButton = document.getElementById('menu-button');
const shopZone = document.getElementById('shop-zone');

const clickPowerDisplay = document.getElementById('click-power');
const passiveIncomeDisplay = document.getElementById('passive-income');

let isMuted = false;
let clicks = 0;
let clickPower = 1;
let passiveIncome = 0;
let level = 1;
const clicksPerLevel = 500;

// Обновление прогресса и уровня
function updateProgressAndLevel() {
    const progress = (clicks % clicksPerLevel) / clicksPerLevel * 100;
    progressBar.style.width = `${progress}%`;
    const newLevel = Math.floor(clicks / clicksPerLevel) + 1;
    if (newLevel !== level) {
        level = newLevel;
        levelText.textContent = `Уровень ${level}`;
    }
}

// Клик по монстру
monster.addEventListener('click', (e) => {
    clicks += clickPower;
    counter.textContent = clicks;
    updateProgressAndLevel();

    if (!isMuted) {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    const energy = document.createElement('img');
    energy.src = 'assets/monster-clickelement.png';
    energy.className = 'energy';
    energy.style.left = `${e.clientX}px`;
    energy.style.top = `${e.clientY}px`;
    energy.style.setProperty('--x', `${(Math.random() - 0.5) * 300}px`);
    energy.style.setProperty('--y', `${(Math.random() - 0.5) * 300}px`);

    document.body.appendChild(energy);
    setTimeout(() => energy.remove(), 3000);
});

// Звук
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    clickSound.muted = isMuted;
    muteIcon.style.backgroundImage = isMuted
        ? "url('assets/dinamikOFF.png')"
        : "url('assets/dinamikOn.png')";
});

// Открытие магазина
menuButton.addEventListener('click', () => {
    shopZone.classList.toggle('open');
});

// Улучшения
document.querySelectorAll('.upgrade-item').forEach(item => {
    item.addEventListener('click', () => {
        let cost = parseInt(item.getAttribute('data-cost'));
        const bonus = parseInt(item.getAttribute('data-bonus'));

        if (clicks >= cost) {
            clicks -= cost;
            counter.textContent = clicks;
            updateProgressAndLevel();

            // Проверка: это апгрейд пассивного дохода или клика?
            if (item.querySelector('p').textContent.includes('секунд')) {
                passiveIncome += bonus;
                passiveIncomeDisplay.textContent = passiveIncome;
            } else {
                clickPower += bonus;
                clickPowerDisplay.textContent = clickPower;
            }

            // Увеличение стоимости и обновление в DOM
            cost = Math.floor(cost * 1.5);
            item.setAttribute('data-cost', cost);
            const costDisplay = item.querySelector('.upgrade-cost') || item.querySelector('.cost');
            if (costDisplay) costDisplay.textContent = `Цена: ${cost}`;

            // Анимация
            item.classList.add('clicked');
            setTimeout(() => item.classList.remove('clicked'), 300);
        }
    });
});

// Пассивный доход каждую секунду
setInterval(() => {
    clicks += passiveIncome;
    counter.textContent = clicks;
    updateProgressAndLevel();
}, 1000);