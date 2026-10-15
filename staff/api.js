/* ===== Shared API layer (identical file in organizer/ and staff/) ===== */
var API_BASE = "https://qr-attendance-backend-zn67.onrender.com/api";   // <-- change to the deployed backend URL
var DEMO_SCAN_ANY_TIME = true;                // staff: allow scanning even if event is not "live" by time. Set false for production.

var SESSION = (window.location.pathname.indexOf("/staff/") != -1) ? "staff" : "org";
var API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function apiToken() { return localStorage.getItem(SESSION + "Token") || ""; }
function apiUser() {
    var raw = localStorage.getItem(SESSION + "User");
    if (!raw) { return { firstName: "User", lastName: "", fullName: "User", initials: "U", role: "", email: "" }; }
    try { return JSON.parse(raw); } catch (e) { return { firstName: "User", lastName: "", fullName: "User", initials: "U", role: "", email: "" }; }
}
function apiLoggedIn() { return localStorage.getItem(SESSION + "LoggedIn") == "yes"; }
function apiClearSession() {
    localStorage.removeItem(SESSION + "Token");
    localStorage.removeItem(SESSION + "User");
    localStorage.removeItem(SESSION + "LoggedIn");
}

function apiRequest(method, path, opts) {
    opts = opts || {};
    var headers = {};
    var init = { method: method, headers: headers };
    if (opts.auth !== false && apiToken() != "") { headers["Authorization"] = "Bearer " + apiToken(); }
    if (opts.form) {
        init.body = opts.form;
    } else if (opts.body) {
        headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(opts.body);
    }
    return fetch(API_BASE + path, init).then(function (r) {
        return r.text().then(function (t) {
            var data = {};
            try { data = t ? JSON.parse(t) : {}; } catch (e) { data = { message: t }; }
            var res = { ok: r.ok, status: r.status, data: data, networkError: false };
            if (r.status == 401 && opts.auth !== false && opts.noRedirect !== true) {
                apiClearSession();
                window.location.href = (SESSION == "staff" ? "" : "") + "login.html";
            }
            return res;
        });
    }).catch(function () {
        return { ok: false, status: 0, data: {}, networkError: true };
    });
}

function apiMessage(res, fallback) {
    if (res.networkError) { return "Cannot reach the server. Check your connection or the API address."; }
    var d = res.data || {};
    var m = d.message || d.error || d.msg;
    if (!m && d.errors && d.errors.length) { m = d.errors[0].msg || d.errors[0].message || d.errors[0]; }
    if (typeof m == "object") { m = JSON.stringify(m); }
    return m || fallback;
}

function unwrapList(data) {
    if (Array.isArray(data)) { return data; }
    if (!data || typeof data != "object") { return []; }
    var keys = ["events", "codes", "attendance", "attendees", "scans", "records", "items", "results", "tickets", "data"];
    for (var i = 0; i < keys.length; i++) {
        var v = data[keys[i]];
        if (Array.isArray(v)) { return v; }
        if (v && typeof v == "object") {
            var inner = unwrapList(v);
            if (inner.length) { return inner; }
        }
    }
    return [];
}

function idOf(x) {
    if (!x) { return ""; }
    if (typeof x != "object") { return String(x); }
    var v = x._id || x.id || x.eventId || x.attendeeId;
    if (v) { return String(v); }
    return idOf(x.event || x.attendee || x.data || x.user || null);
}

/* ---------- auth ---------- */
function findToken(d) {
    if (!d || typeof d != "object") { return ""; }
    var t = d.token || d.accessToken || d.access_token || d.jwt;
    if (t) { return t; }
    return findToken(d.data) || findToken(d.session) || "";
}
function findUser(d) {
    if (!d || typeof d != "object") { return {}; }
    if (d.user && typeof d.user == "object") { return d.user; }
    if (d.data && typeof d.data == "object") {
        if (d.data.user && typeof d.data.user == "object") { return d.data.user; }
        return d.data;
    }
    return d;
}
function buildUser(u, fallbackEmail) {
    var full = u.fullName || u.name || ((u.firstName || u.first_name || "") + " " + (u.lastName || u.last_name || "")).trim();
    if (full == "") { full = (u.email || fallbackEmail || "User").split("@")[0]; }
    var first = u.firstName || u.first_name || full.split(" ")[0];
    var parts = full.split(" ");
    var initials = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : "");
    return { firstName: first, lastName: parts.slice(1).join(" "), fullName: full, initials: initials.toUpperCase(), role: u.role || "", email: u.email || fallbackEmail || "" };
}

function apiRegister(first, last, email, pass, role) {
    return apiRequest("POST", "/auth/register", { auth: false, body: {
        firstName: first, lastName: last, name: first + " " + last, fullName: first + " " + last,
        email: email, password: pass, confirmPassword: pass, role: role
    } });
}
function apiVerifyEmail(email, code) {
    return apiRequest("POST", "/auth/verify-code", { auth: false, body: { email: email, code: code, verificationCode: code, otp: code } });
}
function apiLogin(email, pass, expectedRole) {
    return apiRequest("POST", "/auth/login", { auth: false, body: { email: email, password: pass } }).then(function (res) {
        if (!res.ok) { return { ok: false, message: apiMessage(res, "Wrong email or password.") }; }
        var token = findToken(res.data);
        if (token == "") { return { ok: false, message: "Login succeeded but no token was found in the response: " + JSON.stringify(res.data).slice(0, 200) }; }
        var user = buildUser(findUser(res.data) || {}, email);
        if (user.role && String(user.role).toLowerCase() != expectedRole) {
            return { ok: false, message: "This account is a " + user.role + " account. Use the " + expectedRole + " site." };
        }
        localStorage.setItem(SESSION + "Token", token);
        localStorage.setItem(SESSION + "User", JSON.stringify(user));
        localStorage.setItem(SESSION + "LoggedIn", "yes");
        return { ok: true, user: user };
    });
}
function apiLogout() {
    return apiRequest("POST", "/auth/logout", { noRedirect: true }).then(function () {
        apiClearSession();
        window.location.href = "login.html";
    });
}
/* Password reset: no screens exist, so this uses prompts (forgot-password -> verify-reset-code -> confirm-reset-password) */
function runPasswordReset(prefill) {
    var email = prompt("Enter your account email:", prefill || "");
    if (!email) { return; }
    apiRequest("POST", "/auth/forgot-password", { auth: false, body: { email: email } }).then(function (r1) {
        if (!r1.ok) { alert(apiMessage(r1, "Could not start password reset.")); return; }
        var code = prompt("Enter the reset code sent to your email:");
        if (!code) { return; }
        apiRequest("POST", "/auth/verify-reset-code", { auth: false, body: { email: email, code: code, resetCode: code, otp: code } }).then(function (r2) {
            if (!r2.ok) { alert(apiMessage(r2, "Invalid reset code.")); return; }
            var np = prompt("Enter your new password (min 6 characters):");
            if (!np) { return; }
            apiRequest("POST", "/auth/confirm-reset-password", { auth: false, body: { email: email, code: code, resetCode: code, otp: code, password: np, newPassword: np, confirmPassword: np } }).then(function (r3) {
                if (r3.ok) { alert("Password updated. Log in with the new password."); } else { alert(apiMessage(r3, "Could not update password.")); }
            });
        });
    });
}

/* ---------- events ---------- */
var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function ordinal(n) {
    if (n % 100 >= 11 && n % 100 <= 13) { return n + "th"; }
    var l = n % 10;
    if (l == 1) { return n + "st"; }
    if (l == 2) { return n + "nd"; }
    if (l == 3) { return n + "rd"; }
    return n + "th";
}
function parseTimeStr(t) {
    if (!t) { return null; }
    var m = String(t).trim().match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (!m) { return null; }
    var h = Number(m[1]);
    var mi = Number(m[2] || 0);
    if (m[3]) {
        var ap = m[3].toLowerCase();
        if (ap == "pm" && h < 12) { h += 12; }
        if (ap == "am" && h == 12) { h = 0; }
    }
    return [h, mi];
}
function parseEventDate(raw, timeStr) {
    var d = new Date(raw);
    if (isNaN(d.getTime())) { d = new Date(String(raw || "").replace(/(\d+)(st|nd|rd|th)/, "$1")); }
    if (isNaN(d.getTime())) { return null; }
    var tm = parseTimeStr(timeStr);
    if (tm) { d.setHours(tm[0], tm[1], 0, 0); }
    return d;
}
function clockText(d) {
    var h = d.getHours();
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h == 0) { h = 12; }
    return h + ":" + pad2(d.getMinutes()) + " " + ap;
}
function resolveImage(p, fallback) {
    if (!p) { return fallback; }
    if (/^(https?:|data:)/.test(p)) { return p; }
    return API_ORIGIN + (p.charAt(0) == "/" ? p : "/" + p);
}
function normalizeEvent(e) {
    var start = parseEventDate(e.startDate || e.date || e.eventDate || e.startsAt || e.dateTime, e.startTime || e.time);
    var end = null;
    if (e.endDate || e.endsAt) { end = parseEventDate(e.endDate || e.endsAt, e.endTime); }
    var startMs = start ? start.getTime() : 0;
    var endMs = end ? end.getTime() : (start ? startMs + 8 * 3600000 : 0);
    var now = new Date().getTime();
    var status = "Upcoming";
    if (start && now >= startMs && now <= endMs) { status = "Active"; }
    if (start && now > endMs) { status = "Past"; }
    var loc = e.location || e.venue || e.address || "";
    var d = start || new Date();
    var total = Number(e.totalTickets || e.ticketCount || e.codesCount || e.totalCodes || 0);
    var checked = Number(e.checkedIn || e.checkedInCount || 0);
    return {
        id: idOf(e),
        name: e.name || e.title || "Untitled event",
        day: pad2(d.getDate()),
        month: MON[d.getMonth()],
        date: DAYN[d.getDay()] + ", " + ordinal(d.getDate()) + " " + MON[d.getMonth()] + " " + d.getFullYear(),
        longDate: DAYN[d.getDay()] + ", " + MON[d.getMonth()] + " " + ordinal(d.getDate()) + ", " + d.getFullYear() + " - " + clockText(d),
        time: clockText(d).replace(" ", ""),
        location: loc,
        shortLocation: loc,
        city: loc,
        image: resolveImage(e.image || e.imageUrl || e.banner || e.poster, "assets/event1.png"),
        status: status,
        category: e.category || e.type || e.eventType || "Event",
        capacity: e.capacity || total || "-",
        about: e.description || e.about || "",
        totalTickets: total,
        checkedIn: checked,
        remaining: Math.max(total - checked, 0),
        guests: total,
        gate: e.gate || "Main Gate",
        startsAt: startMs,
        endsAt: endMs
    };
}
function fetchEvents() {
    return apiRequest("GET", "/events").then(function (res) {
        if (!res.ok) { showApiNotice(apiMessage(res, "Could not load events.")); return []; }
        var list = unwrapList(res.data).map(normalizeEvent);
        list.sort(function (a, b) { return a.startsAt - b.startsAt; });
        return list;
    });
}
function showApiNotice(text) {
    var old = document.getElementById("apiNotice");
    if (old) { old.parentNode.removeChild(old); }
    var box = document.createElement("div");
    box.id = "apiNotice";
    box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;background:#D92D20;color:#fff;padding:10px 16px;font:14px Inter,sans-serif;text-align:center";
    box.innerHTML = text;
    document.body.appendChild(box);
    setTimeout(function () { if (box.parentNode) { box.parentNode.removeChild(box); } }, 6000);
}
function csvCell(v) {
    v = String(v == null ? "" : v);
    if (/[",\n]/.test(v)) { v = '"' + v.replace(/"/g, '""') + '"'; }
    return v;
}
