// --- CONFIGURAÇÃO INICIAL (Você pode alterar a data de início aqui ou direto no site) ---
let startDate = "2024-06-12T00:00:00"; // Altere para a data de vocês (Ano-Mês-DiaTHH:mm:ss)
let coupleNames = "Marcelo & Meu Amor";
let customMessage = "Desde que você entrou na minha vida, os dias ganharam mais cor e o tempo passou a fazer sentido. Que esse contador nunca pare de crescer, porque é ao seu lado que eu quero passar todos os meus segundos.";

// Lista inicial de fotos (fotos românticas padrão do Unsplash, você pode adicionar as suas)
let photos = [
    { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80", caption: "Nosso começo ❤️" },
    { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80", caption: "Momentos inesquecíveis ✨" },
    { url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80", caption: "Para todo sempre 💍" }
];

let currentPhotoIndex = 0;

// --- CARREGAR DADOS SALVOS NO NAVEGADOR (Se houver) ---
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('startDate')) startDate = localStorage.getItem('startDate');
    if (localStorage.getItem('coupleNames')) coupleNames = localStorage.getItem('coupleNames');
    if (localStorage.getItem('customMessage')) customMessage = localStorage.getItem('customMessage');
    if (localStorage.getItem('savedPhotos')) {
        try {
            photos = JSON.parse(localStorage.getItem('savedPhotos'));
        } catch(e) {}
    }

    // Aplicar nos campos
    document.getElementById('couple-names').innerText = coupleNames;
    document.getElementById('love-message').innerText = customMessage;
    document.getElementById('input-names').value = coupleNames;
    document.getElementById('input-message').value = customMessage;
    
    // Formatar data para o input datetime-local
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

    if (diff < 0) return;

    const secondsTotal = Math.floor(diff / 1000);
    const minutesTotal = Math.floor(secondsTotal / 60);
    const hoursTotal = Math.floor(minutesTotal / 60);
    const daysTotal = Math.floor(hoursTotal / 24);

    // Cálculo aproximado de anos e meses
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

// Adicionar foto direto pelo celular/PC
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
            localStorage.setItem('savedPhotos', JSON.stringify(photos));
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
