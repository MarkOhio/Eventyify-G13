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
        localStorage.setItem("newUserName", name);
        localStorage.setItem("newUserEmail", email);
        localStorage.setItem("newUserPass", pass);
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
            localStorage.setItem("emailVerified", "yes");
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
        if (email == backend.organizer.email && pass == backend.organizer.password) {
            ok = true;
        }
        if (email == localStorage.getItem("newUserEmail") && pass == localStorage.getItem("newUserPass")) {
            ok = true;
        }
        if (ok == false) {
            err.innerHTML = "Wrong email or password. Try " + backend.organizer.email + " / " + backend.organizer.password;
            return;
        }
        localStorage.setItem("loggedIn", "yes");
        window.location.href = "dashboard.html";
    });
}

var pageName = document.body.getAttribute("data-page");

var icons = {
    home: '<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/>',
    events: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    tickets: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/>',
    staff: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c3 .2 5 2.3 5 5.8"/>',
    attendees: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
    reports: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17v-4M12 17V8M16 17v-6"/>',
    live: '<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>'
};

var navItems = [
    { key: "dashboard", href: "dashboard.html", mobile: "Home", desktop: "Dashboard", icon: "home", mobileShow: true },
    { key: "events", href: "event-details.html", mobile: "Events", desktop: "Events", icon: "events", mobileShow: true },
    { key: "tickets", href: "upload-ticket-codes.html", mobile: "", desktop: "Tickets & Codes", icon: "tickets", mobileShow: false },
    { key: "staff", href: "staff-management.html", mobile: "Staffs", desktop: "Staff Management", icon: "staff", mobileShow: true },
    { key: "attendees", href: "attendance.html#history", mobile: "", desktop: "Attendees", icon: "attendees", mobileShow: false },
    { key: "reports", href: "reports.html", mobile: "Reports", desktop: "Reports", icon: "reports", mobileShow: true },
    { key: "live", href: "attendance.html#live", mobile: "Attendance", desktop: "Live Attendance", icon: "live", mobileShow: true },
    { key: "settings", href: "settings.html", mobile: "", desktop: "Settings", icon: "settings", mobileShow: false }
];

function buildNav() {
    var active = pageName;
    if (pageName == "attendance") {
        active = "live";
        if (window.location.hash == "#history") {
            active = "attendees";
        }
    }
    var html = '<div class="nav">';
    html += '<div class="side-brand"><div class="logo-box"><svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18v-6a6 6 0 0 1 6-6h6"/><path d="M30 6h6a6 6 0 0 1 6 6v6"/><path d="M6 30v6a6 6 0 0 0 6 6h6"/><path d="M30 42h6a6 6 0 0 0 6-6v-6"/><circle cx="24" cy="24" r="3" fill="#fff" stroke="none"/></svg></div><span class="script">Eventify</span></div>';
    for (var i = 0; i < navItems.length; i++) {
        var n = navItems[i];
        var cls = "nav-link";
        if (n.key == active) {
            cls += " active";
        }
        if (n.mobileShow == false) {
            cls += " only-desktop";
        }
        html += '<a class="' + cls + '" href="' + n.href + '"><svg viewBox="0 0 24 24">' + icons[n.icon] + '</svg>';
        html += '<span class="only-mobile">' + n.mobile + '</span><span class="only-desktop">' + n.desktop + '</span></a>';
    }
    html += '<div class="side-user"><div class="avatar">JD</div><div><p>' + backend.organizer.fullName + '</p><p>' + backend.organizer.role + '</p></div></div>';
    html += '</div>';
    document.getElementById("navArea").innerHTML = html;
}

if (pageName) {
    if (localStorage.getItem("loggedIn") != "yes") {
        window.location.href = "login.html";
    }
    buildNav();
    window.addEventListener("hashchange", buildNav);
}

function eventCardHtml(ev) {
    var h = '<a class="event-card" href="event-details.html?id=' + ev.id + '">';
    h += '<div class="thumb"><img src="' + ev.image + '" alt="" onerror="this.remove()"></div>';
    h += '<div class="info"><p class="name">' + ev.name + '</p>';
    h += '<p>' + ev.date + ' . ' + ev.time + '</p>';
    h += '<p>' + ev.location + '</p></div>';
    h += '<span class="badge">Upcoming</span></a>';
    return h;
}

var greetName = document.getElementById("greetName");
if (greetName) {
    greetName.innerHTML = backend.organizer.firstName;
    document.getElementById("totalEvents").innerHTML = backend.events.length;
    document.getElementById("totalAttendance").innerHTML = backend.totalAttendance.toLocaleString();
    document.getElementById("totalTickets").innerHTML = backend.totalTickets.toLocaleString();
    document.getElementById("pendingCount").innerHTML = (backend.totalAttendance - backend.checkedIn).toLocaleString();

    var list = "";
    for (var e = 0; e < backend.events.length; e++) {
        list += eventCardHtml(backend.events[e]);
    }
    document.getElementById("eventList").innerHTML = list;

    var rate = Math.round(backend.checkedIn / backend.totalAttendance * 100);
    document.getElementById("ratePercent").innerHTML = rate + "%";
    document.getElementById("rateCount").innerHTML = backend.checkedIn.toLocaleString() + "/" + backend.totalAttendance.toLocaleString();
    document.getElementById("donut").style.background = "conic-gradient(#e6a23c 0 " + rate + "%, #b8946c " + rate + "% 100%)";
}
