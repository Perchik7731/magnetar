const monster = document.getElementById('monster');
const clickSound = document.getElementById('click-sound');
clickSound.volume = 0.1;

const counter = document.getElementById('clicks-count');
const progressBar = document.getElementById('progress-bar');
const levelText = document.getElementById('level-text');

const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
let isMuted = false;

const menuButton = document.getElementById('menu-button');
const shopZone = document.getElementById('shop-zone');

let clicks = 0;
let clickPower = 1;
let passiveIncome = 0;
let level = 1;
const clicksPerLevel = 25;

const clickPowerDisplay = document.getElementById('click-power');
const passiveIncomeDisplay = document.getElementById('passive-income');

// Функция обновления уровня и прогресс-бара
function updateProgressAndLevel() {
    const progress = (clicks % clicksPerLevel) / clicksPerLevel * 100;
    progressBar.style.width = `${progress}%`;

    const newLevel = Math.floor(clicks / clicksPerLevel) + 1;
    if (newLevel !== level) {
        level = newLevel;
        levelText.textContent = (level >= 10) ? `Уровень ${level}` : `Уровень ${level}`;
    }
}

monster.addEventListener('click', (e) => {
    clicks += clickPower;
    counter.textContent = clicks;
    updateProgressAndLevel();

    clickSound.currentTime = 0;
    clickSound.play();

    const energy = document.createElement('img');
    energy.src = 'assets/monster-clickelement.png';
    energy.className = 'energy';

    const x = e.clientX;
    const y = e.clientY;
    energy.style.left = `${x}px`;
    energy.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 300 + 'px';
    const dy = (Math.random() - 0.5) * 300 + 'px';
    energy.style.setProperty('--x', dx);
    energy.style.setProperty('--y', dy);

    document.body.appendChild(energy);
    setTimeout(() => {
        energy.remove();
    }, 3000);
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    clickSound.muted = isMuted;
    muteIcon.style.backgroundImage = isMuted
        ? "url('assets/dinamikOFF.png')"
        : "url('assets/dinamikOn.png')";
});

menuButton.addEventListener('click', () => {
    shopZone.classList.toggle('open');
});

// Обработка улучшений
document.querySelectorAll('.upgrade-item').forEach(item => {
    let cost = parseInt(item.getAttribute('data-cost'));
    const bonus = parseInt(item.getAttribute('data-bonus'));
    const isAutoclicker = item.id === 'autoclicker-upgrade';

    item.addEventListener('click', () => {
        if (clicks >= cost) {
            clicks -= cost;
            counter.textContent = clicks;
            updateProgressAndLevel();

            if (isAutoclicker) {
                passiveIncome += 1; // Увеличиваем строго на +1
                passiveIncomeDisplay.textContent = passiveIncome;
                cost = Math.floor(cost * 1.5);
                item.setAttribute('data-cost', cost);
                item.querySelector('.upgrade-cost').textContent = `Цена: ${cost}`;
            } else {
                clickPower += bonus;
                clickPowerDisplay.textContent = clickPower;
            }

            item.classList.add('clicked');
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 300);
        }
    });
});

// Пассивный доход каждую секунду
setInterval(() => {
    clicks += passiveIncome;
    counter.textContent = clicks;
    updateProgressAndLevel();
}, 1000);