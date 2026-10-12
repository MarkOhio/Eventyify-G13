const screens = document.querySelectorAll('.screen');
const splash = document.getElementById('splash');
const app = document.getElementById('app');
const backButton = document.getElementById('backButton');
const myDetailsButton = document.getElementById('myDetailsButton');
let currentScreen = 'eventsScreen';
let previousScreen = 'eventsScreen';
let selectedEvent = null;
let attendee = JSON.parse(localStorage.getItem('attendeeDetails') || 'null');
let countdownNumber = 59;
let countdownTimer;

function showScreen(screenId, addToHistory = true) {
    if (addToHistory && currentScreen !== screenId) previousScreen = currentScreen;
    screens.forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    currentScreen = screenId;
    backButton.classList.toggle('hidden', screenId === 'eventsScreen');
    myDetailsButton.classList.toggle('hidden', !attendee || screenId === 'eventsScreen' || screenId === 'personalScreen' || screenId === 'verifyScreen');
    if (screenId === 'detailsScreen') fillDetails();
}

async function loadEvents(search = '') {
    const list = document.getElementById('eventsList');
    list.innerHTML = '';
    const events = await mockApi.getEvents();
    const filteredEvents = events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()));
    filteredEvents.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.innerHTML = `<img src="${event.image}"><span class="event-date-badge">${event.day}<br><small>${event.month}</small></span><div class="event-card-info"><strong>${event.title}</strong><span>◷ ${event.date} · ${event.time}</span><br><span>⌖ ${event.location}</span></div>`;
        card.addEventListener('click', () => openEvent(event.id));
        list.appendChild(card);
    });
    if (!filteredEvents.length) list.innerHTML = '<p class="muted">No events found.</p>';
}

async function openEvent(id) {
    selectedEvent = await mockApi.getEvent(id);
    if (!selectedEvent) return;
    document.getElementById('eventHeroImage').src = selectedEvent.image;
    document.getElementById('eventBadge').innerHTML = `${selectedEvent.day}<br><small>${selectedEvent.month}</small>`;
    document.getElementById('eventTitle').textContent = selectedEvent.title;
    document.getElementById('eventMeta').textContent = `◷ ${selectedEvent.date} · ${selectedEvent.time   } 　⌖ ${selectedEvent.location}`;
    document.getElementById('eventDescription').textContent = selectedEvent.description;
    showScreen('eventScreen');
}

document.getElementById('eventSearch').addEventListener('input', event => loadEvents(event.target.value));
document.getElementById('getTicketButton').addEventListener('click', () => {
    if (attendee && localStorage.getItem('pendingTicket') !== 'true') {
        showScreen('qrScreen');
        fillTicket();
    } else {
        document.getElementById('personalForm').reset();
        showScreen('personalScreen');
    }
});

document.getElementById('personalForm').addEventListener('submit', async event => {
    event.preventDefault();
    attendee = await mockApi.saveAttendee({
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        ticketType: document.getElementById('ticketType').value,
        eventId: selectedEvent ? selectedEvent.id : 1,
        eventTitle: selectedEvent ? selectedEvent.title : 'Tech & Creators Summit 2026'
    });
    document.getElementById('ticketCode').value = '';
    document.getElementById('verifyMessage').textContent = '';
    startCountdown();
    showScreen('verifyScreen');
});

document.getElementById('verifyForm').addEventListener('submit', async event => {
    event.preventDefault();
    const result = await mockApi.verifyTicket(document.getElementById('ticketCode').value);
    const message = document.getElementById('verifyMessage');
    if (result.valid) {
        attendee = result.attendee;
        showScreen('confirmedScreen');
    } else {
        message.textContent = result.message;
    }
});

document.getElementById('resendButton').addEventListener('click', async () => {
    await mockApi.resendCode();
    document.getElementById('verifyMessage').textContent = 'A new code has been sent.';
    startCountdown();
});

function startCountdown() {
    clearInterval(countdownTimer);
    countdownNumber = 59;
    updateCountdown();
    countdownTimer = setInterval(() => {
        countdownNumber--;
        updateCountdown();
        if (countdownNumber <= 0) clearInterval(countdownTimer);
    }, 1000);
}

function updateCountdown() {
    document.getElementById('countdown').textContent = `00:${String(Math.max(countdownNumber, 0)).padStart(2, '0')}`;
}

document.getElementById('viewTicketButton').addEventListener('click', () => {
    fillTicket();
    showScreen('qrScreen');
});
document.getElementById('viewEventButton').addEventListener('click', async () => {
    await openEvent(attendee ? attendee.eventId : 1);
});
document.getElementById('directionsButton').addEventListener('click', () => showScreen('mapScreen'));
document.getElementById('myDetailsButton').addEventListener('click', () => showScreen('detailsScreen'));
backButton.addEventListener('click', () => {
    if (currentScreen === 'eventScreen') showScreen('eventsScreen');
    else if (currentScreen === 'personalScreen') showScreen('eventScreen');
    else if (currentScreen === 'verifyScreen') showScreen('personalScreen');
    else if (currentScreen === 'qrScreen' || currentScreen === 'detailsScreen' || currentScreen === 'mapScreen') showScreen('confirmedScreen');
    else showScreen(previousScreen, false);
});

document.getElementById('downloadButton').addEventListener('click', async () => {
    const svg = document.querySelector('#qrCode svg');
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendee-ticket.svg';
    link.click();
    URL.revokeObjectURL(url);
});

function fillTicket() {
    const eventTitle = attendee ? attendee.eventTitle : (selectedEvent ? selectedEvent.title : 'Tech & Creators Summit 2026');
    document.getElementById('qrEventTitle').textContent = eventTitle;
    document.getElementById('qrEventMeta').textContent = 'Sat, Oct 17th, 2026 · 8:00 AM · Logos, Nigeria';
    document.getElementById('qrCode').innerHTML = makeQrPattern(attendee ? attendee.code : 'CSV-456');
}

function makeQrPattern(value) {
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed += value.charCodeAt(i) * (i + 3);
    let rects = '';
    for (let y = 0; y < 25; y++) {
        for (let x = 0; x < 25; x++) {
            seed = (seed * 9301 + 49297) % 233280;
            const finder = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
            if (finder) {
                const xx = x > 17 ? x - 18 : x;
                const yy = y > 17 ? y - 18 : y;
                if (xx === 0 || xx === 6 || yy === 0 || yy === 6 || (xx >= 2 && xx <= 4 && yy >= 2 && yy <= 4)) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
            } else if (seed % 3 !== 0) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
    }
    return `<svg viewBox="-1 -1 27 27" xmlns="http://www.w3.org/2000/svg"><rect x="-1" y="-1" width="27" height="27" fill="white"/><g fill="#111">${rects}</g></svg>`;
}

function fillDetails() {
    if (!attendee) return;
    document.getElementById('profileName').textContent = `${attendee.firstName} ${attendee.lastName}`;
    document.getElementById('profileEmail').textContent = attendee.email;
    document.getElementById('detailTicketType').textContent = attendee.ticketType;
    document.getElementById('detailTicketCode').textContent = attendee.code;
}

async function startApp() {
    await loadEvents();
    setTimeout(() => {
        splash.classList.add('hide');
        app.classList.remove('hidden');
        setTimeout(() => splash.remove(), 400);
        showScreen('eventsScreen', false);
    }, 1200);
}
startApp();
