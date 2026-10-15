function showLive() {
    var live = backend.liveAttendance;
    var percent = live.total > 0 ? Math.round(live.checkedIn / live.total * 100) : 0;
    document.getElementById("mCount").innerHTML = live.checkedIn;
    document.getElementById("mPercent").innerHTML = percent + "% of total attendees";
    document.getElementById("mDonut").style.background = "conic-gradient(#5B4BDB 0 " + percent + "%, #E0E0E3 " + percent + "% 100%)";
    document.getElementById("dTotal").innerHTML = live.total;
    document.getElementById("dChecked").innerHTML = live.checkedIn;
    document.getElementById("dRemaining").innerHTML = live.total - live.checkedIn;

    var text = document.getElementById("liveSearch").value.toLowerCase();
    var cards = "";
    var rows = "";
    for (var i = 0; i < backend.liveAttendees.length; i++) {
        var a = backend.liveAttendees[i];
        if (a.name.toLowerCase().indexOf(text) == -1 && a.ticket.toLowerCase().indexOf(text) == -1) {
            continue;
        }
        if (i < 2) {
            cards += '<div class="live-row"><div class="staff-left"><div class="avatar">' + userSvg + '</div><div><p class="staff-name">' + a.name + '</p><p class="staff-sub">Checked in</p></div></div><span class="time-pill">' + a.time + '</span></div>';
        }
        rows += "<tr><td>" + a.name + "</td><td>" + a.ticket + "</td><td>" + a.time + "</td><td><span class='pill pill-ok'>Checked in</span></td><td>" + a.gate + "</td></tr>";
    }
    document.getElementById("mLiveList").innerHTML = cards;
    document.getElementById("liveBody").innerHTML = rows;
}

function showHistory() {
    document.getElementById("mHistDate").innerHTML = backend.report.date;
    document.getElementById("dHistDate").innerHTML = backend.report.date;
    var list = "";
    var rows = "";
    for (var i = 0; i < backend.attendees.length; i++) {
        var a = backend.attendees[i];
        var cls = "pill pill-ok";
        if (a.status == "Invalid") {
            cls = "pill pill-bad";
        }
        list += '<div class="hist-row"><span>' + a.name + '</span><span>' + a.time + '</span><span><span class="' + cls + '">' + a.status + '</span></span></div>';
        rows += "<tr><td>" + a.name + "</td><td>" + a.ticket + "</td><td>" + a.time + "</td><td><span class='" + cls + "'>" + a.status + "</span></td><td>" + a.gate + "</td></tr>";
    }
    document.getElementById("mHistList").innerHTML = list;
    document.getElementById("histBody").innerHTML = rows;
}

function showView(view) {
    var viewButtons = document.querySelectorAll("[data-view]");
    for (var i = 0; i < viewButtons.length; i++) {
        if (viewButtons[i].getAttribute("data-view") == view) {
            viewButtons[i].classList.add("active");
        } else {
            viewButtons[i].classList.remove("active");
        }
    }
    if (view == "live") {
        document.getElementById("mLive").classList.remove("hidden");
        document.getElementById("mHistory").classList.add("hidden");
        document.getElementById("dLive").classList.remove("hidden");
        document.getElementById("dHistory").classList.add("hidden");
        document.getElementById("liveActions").classList.remove("hidden");
        document.getElementById("historyActions").classList.add("hidden");
        document.getElementById("dTitle").innerHTML = "Live Attendance";
        document.getElementById("dSub").innerHTML = "Track and monitor who’s currently at your event in real time.";
    } else {
        document.getElementById("mLive").classList.add("hidden");
        document.getElementById("mHistory").classList.remove("hidden");
        document.getElementById("dLive").classList.add("hidden");
        document.getElementById("dHistory").classList.remove("hidden");
        document.getElementById("liveActions").classList.add("hidden");
        document.getElementById("historyActions").classList.remove("hidden");
        document.getElementById("dTitle").innerHTML = "Attendance History";
        document.getElementById("dSub").innerHTML = "Everyone who has scanned in so far.";
    }
    window.scrollTo(0, 0);
}

var viewButtons2 = document.querySelectorAll("[data-view]");
for (var v = 0; v < viewButtons2.length; v++) {
    viewButtons2[v].addEventListener("click", function () {
        showView(this.getAttribute("data-view"));
    });
}

document.getElementById("histBack").addEventListener("click", function () {
    showView("live");
});

document.getElementById("liveSearch").addEventListener("input", showLive);

document.getElementById("filterBtn").addEventListener("click", function () {
    alert("Filter options are not connected yet.");
});

document.getElementById("refreshBtn").addEventListener("click", function () {
    loadAttendance();
});

var exportButtons = document.querySelectorAll(".exportBtn");
for (var x = 0; x < exportButtons.length; x++) {
    exportButtons[x].addEventListener("click", function () {
        var text = "Name,Ticket,Time,Status,Gate\n";
        for (var i = 0; i < backend.attendees.length; i++) {
            var a = backend.attendees[i];
            text += csvCell(a.name) + "," + csvCell(a.ticket) + "," + csvCell(a.time) + "," + csvCell(a.status) + "," + csvCell(a.gate) + "\n";
        }
        downloadCsv("attendance-history.csv", text);
    });
}

function attendeeName(a) {
    return a.name || a.attendeeName || a.fullName || ((a.firstName || "") + " " + (a.lastName || "")).trim() || (a.attendee && (a.attendee.name || ((a.attendee.firstName || "") + " " + (a.attendee.lastName || "")).trim())) || "Attendee";
}

function attendeeTime(a) {
    var raw = a.checkedInAt || a.scannedAt || a.scanTime || a.timestamp || a.time || a.createdAt;
    if (!raw) { return "-"; }
    var d = new Date(raw);
    if (isNaN(d.getTime())) { return String(raw); }
    return clockText(d).replace(" ", "");
}

function loadAttendance() {
    if (!attendanceEvent) {
        showLive();
        showHistory();
        return;
    }
    apiRequest("GET", "/scans/events/" + attendanceEvent.id + "/attendance").then(function (res) {
        if (!res.ok) {
            showApiNotice(apiMessage(res, "Could not load attendance."));
            return;
        }
        var d = res.data || {};
        var list = unwrapList(d);
        var rows = [];
        for (var i = 0; i < list.length; i++) {
            var a = list[i];
            var ticket = a.ticketType || a.type || (a.ticket && a.ticket.type) || "-";
            var status = a.status || "Active";
            if (/invalid|declined|duplicate/i.test(status)) { status = "Invalid"; } else { status = "Active"; }
            rows.push({ name: attendeeName(a), ticket: ticket, time: attendeeTime(a), status: status, gate: a.gate || "-" });
        }
        var checked = Number(d.checkedIn || d.checkedInCount || d.totalCheckedIn || rows.length);
        var total = Number(d.total || d.totalAttendees || d.totalTickets || attendanceEvent.totalTickets || checked);
        backend.liveAttendance = { total: total, checkedIn: checked };
        backend.liveAttendees = rows;
        backend.attendees = rows;
        var t = new Date();
        backend.report.date = DAYN[t.getDay()] + ", " + MON[t.getMonth()] + " " + ordinal(t.getDate()) + ", " + t.getFullYear();
        showLive();
        showHistory();
    });
}

var attendanceEvent = null;
backend.liveAttendance = { total: 0, checkedIn: 0 };
backend.liveAttendees = [];
backend.attendees = [];
showLive();
showHistory();
if (window.location.hash == "#history") {
    showView("history");
}

loadEvents().then(function (events) {
    var wanted = getIdFromUrl();
    attendanceEvent = wanted != "" ? getEventById(wanted) : null;
    if (!attendanceEvent) {
        for (var i = 0; i < events.length; i++) {
            if (events[i].status == "Active") { attendanceEvent = events[i]; break; }
        }
    }
    if (!attendanceEvent && events.length) { attendanceEvent = events[events.length - 1]; }
    if (attendanceEvent) {
        document.getElementById("dSub").innerHTML = attendanceEvent.name + " - track who is at your event in real time.";
    }
    loadAttendance();
});
