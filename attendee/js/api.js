/* Attendee API layer (replaces the mock database) */
const API_BASE = 'https://qr-attendance-backend-zn67.onrender.com/apii';   // <-- change to the deployed backend URL
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ordinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
    const l = n % 10;
    return n + (l === 1 ? 'st' : l === 2 ? 'nd' : l === 3 ? 'rd' : 'th');
}

function parseTimeStr(t) {
    if (!t) return null;
    const m = String(t).trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (!m) return null;
    let h = Number(m[1]);
    const mi = Number(m[2] || 0);
    if (m[3]) {
        const ap = m[3].toLowerCase();
        if (ap === 'pm' && h < 12) h += 12;
        if (ap === 'am' && h === 12) h = 0;
    }
    return [h, mi];
}

function unwrapList(data) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== 'object') return [];
    for (const k of ['events', 'data', 'items', 'results']) {
        const v = data[k];
        if (Array.isArray(v)) return v;
        if (v && typeof v === 'object') {
            const inner = unwrapList(v);
            if (inner.length) return inner;
        }
    }
    return [];
}

function idOf(x) {
    if (!x) return '';
    if (typeof x !== 'object') return String(x);
    const v = x._id || x.id || x.attendeeId;
    if (v) return String(v);
    return idOf(x.attendee || x.data || x.user || null);
}

function normalizeEvent(e, index) {
    let d = new Date(e.startDate || e.date || e.eventDate || e.startsAt || e.dateTime);
    if (isNaN(d.getTime())) d = new Date();
    const tm = parseTimeStr(e.startTime || e.time);
    if (tm) d.setHours(tm[0], tm[1], 0, 0);
    let h = d.getHours();
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const loc = e.location || e.venue || e.address || '';
    let image = e.image || e.imageUrl || e.banner || e.poster || '';
    if (image && !/^(https?:|data:)/.test(image)) image = API_ORIGIN + (image.charAt(0) === '/' ? image : '/' + image);
    if (!image) image = index % 2 === 0 ? 'assets/event-tech.jpg' : 'assets/event-climate.jpg';
    return {
        id: idOf(e),
        title: e.name || e.title || 'Untitled event',
        date: `${DAYN[d.getDay()]}, ${MON[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`,
        time: `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`,
        day: String(d.getDate()).padStart(2, '0'),
        month: MON[d.getMonth()].toUpperCase(),
        location: loc,
        address: loc,
        image: image,
        description: e.description || e.about || ''
    };
}

async function request(method, path, body, auth) {
    const headers = {};
    const token = localStorage.getItem('attendeeToken');
    if (auth && token) headers['Authorization'] = 'Bearer ' + token;
    const init = { method, headers };
    if (body) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }
    try {
        const r = await fetch(API_BASE + path, init);
        const text = await r.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { message: text }; }
        return { ok: r.ok, status: r.status, data, networkError: false };
    } catch (e) {
        return { ok: false, status: 0, data: {}, networkError: true };
    }
}

function apiMessage(res, fallback) {
    if (res.networkError) return 'Cannot reach the server. Check your connection.';
    const d = res.data || {};
    let m = d.message || d.error || d.msg;
    if (!m && d.errors && d.errors.length) m = d.errors[0].msg || d.errors[0].message || d.errors[0];
    if (m && typeof m === 'object') m = JSON.stringify(m);
    return m || fallback;
}

const api = {
    events: [],
    lastError: '',

    getEvents: async function () {
        const res = await request('GET', '/events', null, true);
        if (!res.ok) {
            this.lastError = apiMessage(res, 'Could not load events.');
            this.events = [];
            return [];
        }
        this.lastError = '';
        this.events = unwrapList(res.data).map(normalizeEvent);
        return this.events;
    },

    getEvent: async function (id) {
        if (!this.events.length) await this.getEvents();
        return this.events.find(event => String(event.id) === String(id));
    },

    saveAttendee: async function (details) {
        const res = await request('POST', '/attendees/register', {
            firstName: details.firstName,
            lastName: details.lastName,
            name: details.firstName + ' ' + details.lastName,
            fullName: details.firstName + ' ' + details.lastName,
            email: details.email,
            phone: details.phone,
            ticketType: details.ticketType,
            eventId: details.eventId,
            event: details.eventId
        }, true);
        if (!res.ok) return { ok: false, message: apiMessage(res, 'Could not register. Try again.') };
        const attendee = { ...details, attendeeId: idOf(res.data), code: '', status: 'Pending' };
        localStorage.setItem('attendeeDetails', JSON.stringify(attendee));
        localStorage.setItem('pendingTicket', 'true');
        return { ok: true, attendee };
    },

    verifyTicket: async function (code) {
        const attendee = JSON.parse(localStorage.getItem('attendeeDetails') || 'null');
        if (!attendee) return { valid: false, message: 'Register first.' };
        const entered = code.trim();
        const res = await request('POST', '/tickets/verify-code', {
            code: entered, ticketCode: entered, eventId: attendee.eventId,
            attendeeId: attendee.attendeeId, email: attendee.email
        }, true);
        const d = res.data || {};
        if (!res.ok || d.valid === false || d.success === false) {
            return { valid: false, message: apiMessage(res, 'Invalid ticket code.') };
        }
        attendee.code = entered;
        attendee.qrValue = entered;
        attendee.status = 'Valid';
        if (attendee.attendeeId && attendee.eventId) {
            const t = await request('GET', `/attendees/${attendee.attendeeId}/events/${attendee.eventId}/ticket`, null, true);
            if (t.ok) {
                const ticket = (t.data && (t.data.ticket || t.data.data)) || t.data || {};
                attendee.qrValue = ticket.qrCode || ticket.qr || ticket.qrImage || ticket.qrData || ticket.code || ticket.ticketCode || entered;
            }
        }
        localStorage.setItem('attendeeDetails', JSON.stringify(attendee));
        localStorage.removeItem('pendingTicket');
        return { valid: true, attendee };
    }
};
