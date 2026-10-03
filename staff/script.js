var eyeButtons = document.querySelectorAll("[data-eye]");
for (var i = 0; i < eyeButtons.length; i++) {
    eyeButtons[i].addEventListener("click", function () {
        var box = document.getElementById(this.getAttribute("data-eye"));
        if (box.type == "password") {
            box.type = "text";
        } else {
            box.type = "password";
        }
    });
}

var googleBtn = document.getElementById("googleBtn");
var appleBtn = document.getElementById("appleBtn");
if (googleBtn) {
    googleBtn.addEventListener("click", function () {
        alert("Google sign in is not connected yet. This will call the backend later.");
    });
}
if (appleBtn) {
    appleBtn.addEventListener("click", function () {
        alert("Apple sign in is not connected yet. This will call the backend later.");
    });
}

var signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var err = document.getElementById("errorText");
        var name = document.getElementById("fullName").value;
        if (name == "") {
            name = document.getElementById("firstName").value + " " + document.getElementById("lastName").value;
        }
        var email = document.getElementById("email").value;
        var pass = document.getElementById("password").value;
        var pass2 = document.getElementById("confirmPassword").value;
        if (name.trim() == "" || email == "" || pass == "") {
            err.innerHTML = "Please fill in all the fields.";
            return;
        }
        if (pass.length < 6) {
            err.innerHTML = "Password must be at least 6 characters.";
            return;
        }
        if (pass != pass2) {
            err.innerHTML = "Passwords do not match.";
            return;
        }
        localStorage.setItem("staffNewName", name);
        localStorage.setItem("staffNewEmail", email);
        localStorage.setItem("staffNewPass", pass);
        window.location.href = "verify-email.html";
    });
}

var otpBoxes = document.getElementById("otpBoxes");
if (otpBoxes) {
    var boxes = otpBoxes.getElementsByTagName("input");
    for (var b = 0; b < boxes.length; b++) {
        boxes[b].index = b;
        boxes[b].addEventListener("input", function () {
            if (this.value != "" && this.index < 5) {
                boxes[this.index + 1].focus();
            }
            checkOtp();
        });
        boxes[b].addEventListener("keydown", function (e) {
            if (e.key == "Backspace" && this.value == "" && this.index > 0) {
                boxes[this.index - 1].focus();
            }
        });
    }
    boxes[0].focus();

    function checkOtp() {
        var code = "";
        for (var c = 0; c < boxes.length; c++) {
            code = code + boxes[c].value;
        }
        if (code.length < 6) {
            return;
        }
        if (code == backend.otpCode) {
            window.location.href = "login.html";
        } else {
            document.getElementById("otpError").style.display = "block";
            for (var d = 0; d < boxes.length; d++) {
                boxes[d].value = "";
            }
            boxes[0].focus();
        }
    }

    document.getElementById("resendBtn").addEventListener("click", function () {
        alert("A new code has been sent. (Dummy backend, use " + backend.otpCode + ")");
        document.getElementById("otpError").style.display = "none";
    });
}

var loginForm = document.getElementById("loginForm");
if (loginForm) {
    document.getElementById("forgotLink").addEventListener("click", function (e) {
        e.preventDefault();
        alert("Password reset is not connected yet.");
    });
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = document.getElementById("loginEmail").value;
        var pass = document.getElementById("loginPassword").value;
        var err = document.getElementById("errorText");
        var ok = false;
        if (email == backend.user.email && pass == backend.user.password) {
            ok = true;
        }
        if (email == localStorage.getItem("staffNewEmail") && pass == localStorage.getItem("staffNewPass")) {
            ok = true;
        }
        if (ok == false) {
            err.innerHTML = "Wrong email or password. Try " + backend.user.email + " / " + backend.user.password;
            return;
        }
        localStorage.setItem("staffLoggedIn", "yes");
        window.location.href = "dashboard.html";
    });
}

var pageName = document.body.getAttribute("data-page");

var sideItems = [
    { key: "dashboard", href: "dashboard.html", text: "My Events", icon: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' },
    { key: "scan", href: "scan-qr.html", text: "Scan QR", icon: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16"/>' },
    { key: "history", href: "check-in-history.html", text: "Check in History", icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
    { key: "settings", href: "settings.html", text: "Settings", icon: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>' }
];

function buildSidebar() {
    var html = '<div class="sidebar">';
    html += '<div class="side-brand"><div class="logo-box"><svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18v-6a6 6 0 0 1 6-6h6"/><path d="M30 6h6a6 6 0 0 1 6 6v6"/><path d="M6 30v6a6 6 0 0 0 6 6h6"/><path d="M30 42h6a6 6 0 0 0 6-6v-6"/><circle cx="24" cy="24" r="3" fill="#fff" stroke="none"/></svg></div><span class="script">Eventify</span></div>';
    for (var i = 0; i < sideItems.length; i++) {
        var s = sideItems[i];
        var cls = "side-link";
        if (s.key == pageName) {
            cls += " active";
        }
        html += '<a class="' + cls + '" href="' + s.href + '"><svg viewBox="0 0 24 24">' + s.icon + '</svg><span>' + s.text + '</span></a>';
    }
    html += '<div class="side-user"><div class="avatar">' + backend.user.initials + '</div><div><p>' + backend.user.fullName + '</p><p>' + backend.user.role + '</p></div></div>';
    html += '</div>';
    document.getElementById("sidebarArea").innerHTML = html;
}

if (pageName) {
    if (localStorage.getItem("staffLoggedIn") != "yes") {
        window.location.href = "login.html";
    }
    buildSidebar();
}

function getSelectedEvent() {
    var id = Number(localStorage.getItem("staffEvent"));
    if (id == 0) {
        id = 1;
    }
    for (var i = 0; i < backend.events.length; i++) {
        if (backend.events[i].id == id) {
            return backend.events[i];
        }
    }
    return backend.events[0];
}

function chooseEvent(id) {
    localStorage.setItem("staffEvent", id);
}

function getScans() {
    var saved = localStorage.getItem("staffScans");
    if (saved == null) {
        return [];
    }
    return JSON.parse(saved);
}

function saveScan(scan) {
    var scans = getScans();
    scans.push(scan);
    localStorage.setItem("staffScans", JSON.stringify(scans));
}

function nowTime() {
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = "AM";
    if (h >= 12) {
        ampm = "PM";
    }
    h = h % 12;
    if (h == 0) {
        h = 12;
    }
    if (m < 10) {
        m = "0" + m;
    }
    return h + ":" + m + ampm;
}

var eventList = document.getElementById("eventList");
if (eventList) {
    document.getElementById("greeting").innerHTML = "Good Morning, " + backend.user.firstName + " &#128075;";
    document.getElementById("deskGreeting").innerHTML = "Good Morning, " + backend.user.firstName + " &#128075;";
    document.getElementById("todayText").innerHTML = backend.todayText;
    document.getElementById("avatarSmall").innerHTML = backend.user.initials;

    var cards = "";
    for (var e = 0; e < backend.events.length; e++) {
        var ev = backend.events[e];
        cards += '<div class="ev-card">';
        cards += '<div class="logo-box"><svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18v-6a6 6 0 0 1 6-6h6"/><path d="M30 6h6a6 6 0 0 1 6 6v6"/><path d="M6 30v6a6 6 0 0 0 6 6h6"/><path d="M30 42h6a6 6 0 0 0 6-6v-6"/><circle cx="24" cy="24" r="3" fill="#fff" stroke="none"/></svg></div>';
        if (ev.status == "Live") {
            cards += '<span class="live-tag">LIVE</span>';
        }
        cards += '<span class="badge">' + ev.status + '</span>';
        cards += '<p class="ev-name">' + ev.name + '</p>';
        cards += '<p class="ev-line"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>' + ev.date + '</p>';
        cards += '<p class="ev-line"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/></svg>' + ev.location + '</p>';
        cards += '<p class="ev-gate">' + ev.gate + ' <span class="only-desktop"> . ' + ev.guests + ' Registered Guests.</span></p>';
        cards += '<div class="ev-buttons"><a class="btn-orange" href="scan-qr.html" onclick="chooseEvent(' + ev.id + ')"><span class="only-mobile">Scan</span><span class="only-desktop">Scan QR</span></a>';
        cards += '<a class="btn-outline" href="check-in-history.html" onclick="chooseEvent(' + ev.id + ')">Check-ins</a></div>';
        cards += '</div>';
    }
    eventList.innerHTML = cards;

    document.getElementById("viewAll").addEventListener("click", function (e) {
        e.preventDefault();
        alert("All assigned events are already shown.");
    });
}

var viewfinder = document.getElementById("viewfinder");
if (viewfinder) {
    var selected = getSelectedEvent();
    document.getElementById("mobileEventName").innerHTML = selected.name;
    document.getElementById("deskEventName").innerHTML = selected.name + " . " + selected.status;
    document.getElementById("deskEventDate").innerHTML = selected.dateLong;
    document.getElementById("deskEventPlace").innerHTML = selected.location;

    var states = ["stateScan", "stateSuccess", "stateDuplicate", "stateInvalid", "stateOffline"];

    function showState(name) {
        for (var i = 0; i < states.length; i++) {
            if (states[i] == name) {
                document.getElementById(states[i]).classList.remove("hidden");
            } else {
                document.getElementById(states[i]).classList.add("hidden");
            }
        }
    }

    function showCounts() {
        var scans = getScans();
        var checked = 0;
        var dup = 0;
        var bad = 0;
        for (var i = 0; i < scans.length; i++) {
            if (scans[i].status == "Confirmed") {
                checked = checked + 1;
            }
            if (scans[i].status == "Duplicate") {
                dup = dup + 1;
            }
            if (scans[i].status == "Declined") {
                bad = bad + 1;
            }
        }
        document.getElementById("statChecked").innerHTML = checked;
        document.getElementById("statTotal").innerHTML = selected.guests;
        document.getElementById("statDuplicate").innerHTML = dup;
        document.getElementById("statInvalid").innerHTML = bad;
    }

    function initials(name) {
        var parts = name.split(" ");
        var result = parts[0].charAt(0);
        if (parts.length > 1) {
            result = result + parts[1].charAt(0);
        }
        return result;
    }

    function runScan() {
        if (navigator.onLine == false) {
            showState("stateOffline");
            return;
        }
        var index = Number(localStorage.getItem("staffScanIndex"));
        var code = backend.scanQueue[index % backend.scanQueue.length];
        localStorage.setItem("staffScanIndex", index + 1);

        var ticket = backend.tickets[code];
        if (ticket == undefined) {
            saveScan({ time: nowTime(), name: "Unknown ticket", code: code, status: "Declined", gate: selected.gate });
            showCounts();
            showState("stateInvalid");
            return;
        }

        var scans = getScans();
        var firstTime = "";
        for (var i = 0; i < scans.length; i++) {
            if (scans[i].code == code && scans[i].status == "Confirmed") {
                firstTime = scans[i].time;
            }
        }

        if (firstTime != "") {
            saveScan({ time: nowTime(), name: ticket.name, code: code, status: "Duplicate", gate: selected.gate });
            document.getElementById("dPic").innerHTML = initials(ticket.name);
            document.getElementById("dName").innerHTML = ticket.name;
            document.getElementById("dCode").innerHTML = code;
            document.getElementById("dTime").innerHTML = firstTime;
            showCounts();
            showState("stateDuplicate");
        } else {
            var time = nowTime();
            saveScan({ time: time, name: ticket.name, code: code, status: "Confirmed", gate: selected.gate });
            document.getElementById("sPic").innerHTML = initials(ticket.name);
            document.getElementById("sName").innerHTML = ticket.name;
            document.getElementById("sCode").innerHTML = code;
            document.getElementById("sTime").innerHTML = time;
            showCounts();
            showState("stateSuccess");
        }
    }

    viewfinder.addEventListener("click", runScan);

    var nextButtons = document.querySelectorAll(".scanNext");
    for (var n = 0; n < nextButtons.length; n++) {
        nextButtons[n].addEventListener("click", function () {
            showState("stateScan");
        });
    }

    document.getElementById("refreshBtn").addEventListener("click", function () {
        if (navigator.onLine) {
            showState("stateScan");
        } else {
            alert("Still offline. Connect to a network and try again.");
        }
    });
    window.addEventListener("offline", function () {
        showState("stateOffline");
    });
    window.addEventListener("online", function () {
        showState("stateScan");
    });

    showCounts();
    if (navigator.onLine == false) {
        showState("stateOffline");
    }
}

var mHistory = document.getElementById("mHistory");
if (mHistory) {
    document.getElementById("histEvent").innerHTML = getSelectedEvent().name;

    function allCheckIns() {
        var saved = getScans();
        var list = [];
        for (var i = saved.length - 1; i >= 0; i--) {
            list.push(saved[i]);
        }
        for (var j = 0; j < backend.history.length; j++) {
            list.push(backend.history[j]);
        }
        return list;
    }

    function showHistory() {
        var list = allCheckIns();
        var filter = document.getElementById("statusFilter").value;
        var text = document.getElementById("historySearch").value.toLowerCase();
        var cards = "";
        var rows = "";
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            if (filter != "All" && c.status != filter) {
                continue;
            }
            if (text != "" && c.name.toLowerCase().indexOf(text) == -1 && c.code.toLowerCase().indexOf(text) == -1) {
                continue;
            }
            cards += '<div class="check-row"><div><p class="nm">' + c.name + '</p><p class="tm">' + c.time + '</p></div><span class="st ' + c.status + '">' + c.status + '</span></div>';
            var shown = c.status;
            if (shown == "Confirmed") {
                shown = "Valid";
            }
            rows += "<tr><td>" + c.time + "</td><td>" + c.name + "</td><td>" + c.code + "</td><td><span class='status-pill " + c.status + "'>" + shown + "</span></td><td>" + c.gate + "</td></tr>";
        }
        if (cards == "") {
            cards = '<p style="color:#e6a23c;font-size:14px">No check-ins found.</p>';
        }
        mHistory.innerHTML = cards;
        document.getElementById("hBody").innerHTML = rows;
    }

    document.getElementById("statusFilter").addEventListener("change", showHistory);
    document.getElementById("historySearch").addEventListener("input", showHistory);
    showHistory();
}

var settingCards = document.querySelectorAll(".setting-card[data-msg]");
for (var sc = 0; sc < settingCards.length; sc++) {
    settingCards[sc].addEventListener("click", function () {
        alert(this.getAttribute("data-msg"));
    });
}
var logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("staffLoggedIn");
        window.location.href = "login.html";
    });
}
