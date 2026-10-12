function showLive() {
    var live = backend.liveAttendance;
    var percent = Math.round(live.checkedIn / live.total * 100);
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
    var more = Math.floor(Math.random() * 5) + 1;
    if (backend.liveAttendance.checkedIn + more <= backend.liveAttendance.total) {
        backend.liveAttendance.checkedIn = backend.liveAttendance.checkedIn + more;
    }
    showLive();
});

var exportButtons = document.querySelectorAll(".exportBtn");
for (var x = 0; x < exportButtons.length; x++) {
    exportButtons[x].addEventListener("click", function () {
        var text = "Name,Ticket,Time,Status,Gate\n";
        for (var i = 0; i < backend.attendees.length; i++) {
            var a = backend.attendees[i];
            text += a.name + "," + a.ticket + "," + a.time + "," + a.status + "," + a.gate + "\n";
        }
        downloadCsv("attendance-history.csv", text);
    });
}

showLive();
showHistory();
if (window.location.hash == "#history") {
    showView("history");
}
