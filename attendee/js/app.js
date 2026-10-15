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
    const events = await api.getEvents();
    const filteredEvents = events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()));
    filteredEvents.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        card.innerHTML = `<img src="${event.image}"><span class="event-date-badge">${event.day}<br><small>${event.month}</small></span><div class="event-card-info"><strong>${event.title}</strong><span>◷ ${event.date} · ${event.time}</span><br><span>⌖ ${event.location}</span></div>`;
        card.addEventListener('click', () => openEvent(event.id));
        list.appendChild(card);
    });
    if (!filteredEvents.length) list.innerHTML = '<p class="muted">' + (api.lastError || 'No events found.') + '</p>';
}

async function openEvent(id, updateUrl = true) {
    selectedEvent = await api.getEvent(id);
    if (!selectedEvent) return;
    document.getElementById('eventHeroImage').src = selectedEvent.image;
    document.getElementById('eventBadge').innerHTML = `${selectedEvent.day}<br><small>${selectedEvent.month}</small>`;
    document.getElementById('eventTitle').textContent = selectedEvent.title;
    document.getElementById('eventMeta').textContent = `◷ ${selectedEvent.date} · ${selectedEvent.time   } 　⌖ ${selectedEvent.location}`;
    document.getElementById('eventDescription').textContent = selectedEvent.description;
    if (updateUrl && new URLSearchParams(window.location.search).get('event') !== String(selectedEvent.id)) {
        history.pushState({ eventId: selectedEvent.id }, '', `${window.location.pathname}?event=${selectedEvent.id}`);
    }
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
    const saved = await api.saveAttendee({
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        ticketType: document.getElementById('ticketType').value,
        eventId: selectedEvent ? selectedEvent.id : '',
        eventTitle: selectedEvent ? selectedEvent.title : ''
    });
    if (!saved.ok) {
        alert(saved.message);
        return;
    }
    attendee = saved.attendee;
    document.getElementById('ticketCode').value = '';
    document.getElementById('verifyMessage').textContent = '';
    startCountdown();
    showScreen('verifyScreen');
});

document.getElementById('verifyForm').addEventListener('submit', async event => {
    event.preventDefault();
    const result = await api.verifyTicket(document.getElementById('ticketCode').value);
    const message = document.getElementById('verifyMessage');
    if (result.valid) {
        attendee = result.attendee;
        showScreen('confirmedScreen');
    } else {
        message.textContent = result.message;
    }
});

document.getElementById('resendButton').addEventListener('click', async () => {
    document.getElementById('verifyMessage').textContent = 'Resending codes is not available yet. Use the ticket code you were given.';
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
    await openEvent(attendee ? attendee.eventId : '');
});
document.getElementById('directionsButton').addEventListener('click', async () => {
    const eventId = attendee && attendee.eventId ? attendee.eventId : (selectedEvent ? selectedEvent.id : '');
    const event = await api.getEvent(eventId);
    if (!event) return;
    selectedEvent = event;
    document.getElementById('mapAddress').textContent = event.address;
    document.getElementById('eventMap').src = `https://maps.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`;
    document.getElementById('openDirectionsLink').href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}`;
    showScreen('mapScreen');
});
document.getElementById('myDetailsButton').addEventListener('click', () => showScreen('detailsScreen'));
backButton.addEventListener('click', () => {
    if (currentScreen === 'eventScreen') {
        history.pushState({}, '', window.location.pathname);
        selectedEvent = null;
        showScreen('eventsScreen');
    }
    else if (currentScreen === 'personalScreen') showScreen('eventScreen');
    else if (currentScreen === 'verifyScreen') showScreen('personalScreen');
    else if (currentScreen === 'qrScreen' || currentScreen === 'detailsScreen' || currentScreen === 'mapScreen') showScreen('confirmedScreen');
    else showScreen(previousScreen, false);
});

document.getElementById('downloadButton').addEventListener('click', async () => {
    const svg = document.querySelector('#qrCode svg');
    const img = document.querySelector('#qrCode img');
    const link = document.createElement('a');
    if (svg) {
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        link.href = URL.createObjectURL(blob);
        link.download = 'attendee-ticket.svg';
    } else if (img) {
        link.href = img.src;
        link.download = 'attendee-ticket.png';
    } else return;
    link.click();
});

function fillTicket() {
    const eventTitle = attendee ? attendee.eventTitle : (selectedEvent ? selectedEvent.title : '');
    const event = api.events.find(item => String(item.id) === String(attendee ? attendee.eventId : (selectedEvent ? selectedEvent.id : '')));
    document.getElementById('qrEventTitle').textContent = eventTitle;
    document.getElementById('qrEventMeta').textContent = event ? `${event.date} · ${event.time} · ${event.location}` : '';
    const value = attendee ? (attendee.qrValue || attendee.code) : '';
    const box = document.getElementById('qrCode');
    if (!value) {
        box.innerHTML = '';
    } else if (String(value).startsWith('data:image') || /^https?:/.test(String(value))) {
        box.innerHTML = `<img src="${value}" alt="Ticket QR" style="width:100%;height:100%">`;
    } else {
        const qr = qrcode(0, 'M');
        qr.addData(String(value));
        qr.make();
        box.innerHTML = qr.createSvgTag({ scalable: true, margin: 2 });
    }
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
    setTimeout(async () => {
        splash.classList.add('hide');
        app.classList.remove('hidden');
        setTimeout(() => splash.remove(), 400);
        const eventId = new URLSearchParams(window.location.search).get('event');
        if (eventId) {
            await openEvent(eventId, false);
        } else {
            showScreen('eventsScreen', false);
        }
    }, 1200);
}

window.addEventListener('popstate', async () => {
    const eventId = new URLSearchParams(window.location.search).get('event');
    if (eventId) {
        await openEvent(eventId, false);
    } else {
        selectedEvent = null;
        showScreen('eventsScreen', false);
    }
});

startApp();
