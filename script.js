// --- CONFIGURAÇÃO OFICIAL PARA A STHEFANY ---
let startDate = "2026-07-27T00:00:00"; 
let coupleNames = "Marcelo & Sthefany";
let customMessage = "Sthefany, construir meus dias ao seu lado é a melhor escolha que eu poderia ter feito. Cada segundo com você me dá certeza de que a vida é muito melhor compartilhada. Fiz cada detalhe deste cantinho pensando em nós, para que o tempo pare e a gente lembre sempre do quanto a nossa história é especial.";

// FOTO OFICIAL DO CASAL
// Dica: Para colocar a foto de vocês, basta subir uma foto chamada 'foto.jpg' 
// no mesmo repositório do GitHub ou colar o link direto de uma foto de vocês aqui embaixo.
let photos = [
    { url: "foto.jpg", caption: "Nosso amor, nossa história ❤️" }
];

let currentPhotoIndex = 0;

// --- CARREGAR DADOS ---
window.addEventListener('DOMContentLoaded', () => {
    // Se você personalizou algo no seu celular antes, ele mantém, senão assume os dados oficiais acima
    if (localStorage.getItem('startDate')) startDate = localStorage.getItem('startDate');
    if (localStorage.getItem('coupleNames')) coupleNames = localStorage.getItem('coupleNames');
    if (localStorage.getItem('customMessage')) customMessage = localStorage.getItem('customMessage');
    
    // Aplicar nos campos da página
    document.getElementById('couple-names').innerText = coupleNames;
    document.getElementById('love-message').innerText = customMessage;
    document.getElementById('input-names').value = coupleNames;
    document.getElementById('input-message').value = customMessage;
    
    // Formatar data para o input
    const dtLocal = new Date(startDate);
    document.getElementById('input-date').value = dtLocal.toISOString().slice(0, 16);
    document.getElementById('start-date-text').innerText = `Desde ${dtLocal.toLocaleDateString('pt-BR')} às ${dtLocal.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;

    initGallery();
    createFloatingHearts();
    setInterval(updateCounter, 1000);
    updateCounter();
});

// --- LÓGICA DO CONTADOR DE TEMPO ---
function updateCounter() {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;

    if (diff < 0) {
        // Se a data for no futuro (contagem regressiva ou recém iniciada)
        document.getElementById('years').innerText = 0;
        document.getElementById('months').innerText = 0;
        document.getElementById('days').innerText = 0;
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        return;
    }

    const secondsTotal = Math.floor(diff / 1000);
    const minutesTotal = Math.floor(secondsTotal / 60);
    const hoursTotal = Math.floor(minutesTotal / 60);

    const startDateObj = new Date(startDate);
    const nowDateObj = new Date();

    let years = nowDateObj.getFullYear() - startDateObj.getFullYear();
    let months = nowDateObj.getMonth() - startDateObj.getMonth();
    let days = nowDateObj.getDate() - startDateObj.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(nowDateObj.getFullYear(), nowDateObj.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const hours = hoursTotal % 24;
    const minutes = minutesTotal % 60;
    const seconds = secondsTotal % 60;

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

// --- GALERIA E CARROSSEL ---
function initGallery() {
    renderPhoto();
    renderDots();
}

function renderPhoto() {
    if (photos.length === 0) return;
    const photo = photos[currentPhotoIndex];
    document.getElementById('current-photo').src = photo.url;
    document.getElementById('photo-caption').innerText = photo.caption || "Nosso amor ❤️";
    updateDotsActive();
}

function renderDots() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === currentPhotoIndex ? 'active' : ''}`;
        dot.onclick = () => {
            currentPhotoIndex = index;
            renderPhoto();
        };
        dotsContainer.appendChild(dot);
    });
}

function updateDotsActive() {
    const dots = document.querySelectorAll('.dots-container .dot');
    dots.forEach((dot, index) => {
        if (index === currentPhotoIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    renderPhoto();
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    renderPhoto();
}

// Adicionar mais fotos se quiser direto pelo site
function handlePhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photos.push({
                url: e.target.result,
                caption: "Nossos momentos juntos ✨"
            });
            currentPhotoIndex = photos.length - 1;
            renderPhoto();
            renderDots();
        };
        reader.readAsDataURL(file);
    }
}

// --- CONFIGURAÇÕES E PAINEL ---
function toggleConfig() {
    const panel = document.getElementById('config-panel');
    panel.classList.toggle('hidden');
}

function saveSettings() {
    const newNames = document.getElementById('input-names').value;
    const newDate = document.getElementById('input-date').value;
    const newMessage = document.getElementById('input-message').value;

    if (newNames) {
        coupleNames = newNames;
        localStorage.setItem('coupleNames', coupleNames);
        document.getElementById('couple-names').innerText = coupleNames;
    }

    if (newDate) {
        startDate = newDate;
        localStorage.setItem('startDate', startDate);
        const dtLocal = new Date(startDate);
        document.getElementById('start-date-text').innerText = `Desde ${dtLocal.toLocaleDateString('pt-BR')} às ${dtLocal.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`;
    }

    if (newMessage) {
        customMessage = newMessage;
        localStorage.setItem('customMessage', customMessage);
        document.getElementById('love-message').innerText = customMessage;
    }

    toggleConfig();
    alert('Alterações salvas com sucesso! ❤️');
}

// --- ANIMAÇÃO DE CORAÇÕES FLUTUANTES ---
function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const heartSymbols = ['❤️', '💖', '✨', '💕', '💗'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        
        const duration = Math.random() * 3 + 4;
        heart.style.animationDuration = duration + 's';

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 400);
}
