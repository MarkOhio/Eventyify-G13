var attendanceRows = [];
var attendanceEvent = null;

function escapeAttendance(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
}

function getTicketType(code) {
    var prefix = String(code || "").split("-")[0].toUpperCase();
    if (prefix === "VVIP") return "VVIP";
    if (prefix === "VIP") return "VIP";
    if (prefix === "REG" || prefix === "REGULAR") return "Regular";
    return "—";
}

function showAttendanceRows() {
    var search = document.getElementById("liveSearch");
    var query = (search ? search.value : "").toLowerCase();
    var rows = "";
    var cards = "";
    attendanceRows.forEach(function (scan) {
        var code = scan.ticketCode || scan.code || "";
        var attendee = scan.attendee || null;
        var name = attendee ? ([attendee.firstName, attendee.lastName].filter(Boolean).join(" ").trim() || attendee.name || attendee.fullName || "") : "";
        var email = attendee && attendee.email ? attendee.email : "";
        var type = scan.ticketType || scan.ticket_type || getTicketType(code);
        var result = String(scan.result || scan.status || "unknown").toLowerCase();
        var status = result === "valid" || result === "used" || result === "confirmed" ? "Checked in" : result;
        var statusClass = status === "Checked in" ? "pill-ok" : "pill-bad";
        var rawTime = scan.time || scan.checkedInAt || scan.firstCheckedInAt || scan.createdAt;
        var parsedTime = rawTime ? new Date(rawTime) : null;
        var time = parsedTime && !Number.isNaN(parsedTime.getTime()) ? parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
        var searchText = (name + " " + email + " " + code + " " + type + " " + status).toLowerCase();
        if (searchText.indexOf(query) === -1) return;
        rows += "<tr><td>" + escapeAttendance(name || "—") + "</td><td>" + escapeAttendance(email || "—") + "</td><td>" + escapeAttendance(type || "—") + "</td><td>" + escapeAttendance(time) + "</td><td><span class='pill " + statusClass + "'>" + escapeAttendance(status) + "</span></td></tr>";
        cards += '<div class="live-row"><div class="staff-left"><div class="avatar">' + userSvg + '</div><div><p class="staff-name">' + escapeAttendance(name || code || "Unknown attendee") + '</p><p class="staff-sub">' + escapeAttendance(type) + (code ? ' · ' + escapeAttendance(code) : '') + '</p></div></div><span class="time-pill">' + escapeAttendance(time) + '</span></div>';
    });
    var message = attendanceRows.length ? "No scans match your search." : "No scans recorded yet.";
    document.getElementById("mLiveList").innerHTML = cards || '<p class="muted">' + message + '</p>';
    document.getElementById("liveBody").innerHTML = rows || "<tr><td colspan='5'>" + message + "</td></tr>";
    document.getElementById("mHistList").innerHTML = cards || '<p class="muted">' + message + '</p>';
    document.getElementById("histBody").innerHTML = rows || "<tr><td colspan='5'>" + message + "</td></tr>";
}

async function loadAttendanceFromBackend() {
    var eventId = new URLSearchParams(window.location.search).get("id") || localStorage.getItem("lastCreatedEventId");
    if (!eventId) {
        var message = "Choose an event first. Open attendance from an event or create an event.";
        document.getElementById("mLiveList").textContent = message;
        document.getElementById("liveBody").innerHTML = "<tr><td colspan='5'>" + message + "</td></tr>";
        document.getElementById("mHistList").textContent = message;
        document.getElementById("histBody").innerHTML = "<tr><td colspan='5'>" + message + "</td></tr>";
        return;
    }
    try {
        var result = await apiRequest("/scans/events/" + encodeURIComponent(eventId) + "/attendance");
        var data = result.data || result;
        var total = Number(data.totalTickets || 0);
        var checked = Number(data.checkedIn || 0);
        var percent = Number(data.attendanceRate || 0);
        attendanceRows = Array.isArray(data.recentScans) ? data.recentScans : [];
        attendanceEvent = data.event || null;
        document.getElementById("mCount").textContent = checked;
        document.getElementById("mPercent").textContent = percent + "% of total attendees";
        document.getElementById("mDonut").style.background = "conic-gradient(#5B4BDB 0 " + percent + "%, #E0E0E3 " + percent + "% 100%)";
        document.getElementById("dTotal").textContent = total;
        document.getElementById("dChecked").textContent = checked;
        document.getElementById("dRemaining").textContent = Number(data.notYetCheckedIn || Math.max(total - checked, 0));
        var date = attendanceEvent && attendanceEvent.date ? new Date(attendanceEvent.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }) : "";
        document.getElementById("mHistDate").textContent = date;
        document.getElementById("dHistDate").textContent = date;
        showAttendanceRows();
    } catch (error) {
        document.getElementById("mLiveList").textContent = error.message;
        document.getElementById("liveBody").innerHTML = "<tr><td colspan='5'>" + escapeAttendance(error.message) + "</td></tr>";
    }
}

function showView(view) {
    document.querySelectorAll("[data-view]").forEach(function (button) {
        button.classList.toggle("active", button.getAttribute("data-view") === view);
    });
    document.getElementById("mLive").classList.toggle("hidden", view !== "live");
    document.getElementById("mHistory").classList.toggle("hidden", view !== "history");
    document.getElementById("dLive").classList.toggle("hidden", view !== "live");
    document.getElementById("dHistory").classList.toggle("hidden", view !== "history");
    document.getElementById("liveActions").classList.toggle("hidden", view !== "live");
    document.getElementById("historyActions").classList.toggle("hidden", view !== "history");
    document.getElementById("dTitle").textContent = view === "live" ? "Live Attendance" : "Attendance History";
    document.getElementById("dSub").textContent = view === "live" ? "Track and monitor who’s currently at your event in real time." : "Recent ticket scans for this event.";
    window.scrollTo(0, 0);
}

document.querySelectorAll("[data-view]").forEach(function (button) {
    button.addEventListener("click", function () { showView(this.getAttribute("data-view")); });
});
document.getElementById("histBack").addEventListener("click", function () { showView("live"); });
document.getElementById("refreshBtn").addEventListener("click", loadAttendanceFromBackend);
document.getElementById("liveSearch").addEventListener("input", showAttendanceRows);

document.querySelectorAll(".exportBtn").forEach(function (button) {
    button.addEventListener("click", function () {
        var csv = "Name,Email,Ticket type,Checked in,Status\n";
        attendanceRows.forEach(function (scan) {
            var attendee = scan.attendee || {};
            var name = [attendee.firstName, attendee.lastName].filter(Boolean).join(" ").trim() || attendee.name || "";
            var email = attendee.email || "";
            var code = scan.ticketCode || scan.code || "";
            var type = scan.ticketType || scan.ticket_type || getTicketType(code);
            var rawTime = scan.time || scan.checkedInAt || scan.firstCheckedInAt || scan.createdAt;
            var time = rawTime ? new Date(rawTime).toLocaleString() : "";
            var result = String(scan.result || scan.status || "Unknown").toLowerCase();
            var status = result === "valid" || result === "used" || result === "confirmed" ? "Checked in" : result;
            csv += '"' + name.replace(/"/g, '""') + '","' + email.replace(/"/g, '""') + '","' + String(type).replace(/"/g, '""') + '","' + time.replace(/"/g, '""') + '","' + String(status).replace(/"/g, '""') + '"\n';
        });
        downloadCsv("attendance-results.csv", csv);
    });
});

loadAttendanceFromBackend();
