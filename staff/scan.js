var selected = null;

var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var cameraMsg = document.getElementById("cameraMsg");
var stream = null;
var scanning = false;
var lastScan = null;
var states = ["stateScan", "stateSuccess", "stateDuplicate", "stateInvalid", "stateOffline", "stateCamera"];

function fillEventInfo() {
    document.getElementById("mEventName").innerHTML = selected.name;
    document.getElementById("dEventName").innerHTML = selected.name;
    document.getElementById("dEventDate").innerHTML = formatDate(selected.startsAt);
    document.getElementById("dEventPlace").innerHTML = selected.location;
}

function stopCamera() {
    scanning = false;
    if (stream) {
        var tracks = stream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        stream = null;
    }
    video.srcObject = null;
}

function showCameraError(text) {
    document.getElementById("cameraText").innerHTML = text;
    showState("stateCamera");
}

function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showCameraError("This browser cannot open the camera here. Open the site on https or localhost, or enter the ticket code manually.");
        return;
    }
    cameraMsg.innerHTML = "Starting camera...";
    cameraMsg.classList.remove("hidden");

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (s) {
        stream = s;
        video.srcObject = s;
        video.play();
        cameraMsg.classList.add("hidden");
        scanning = true;
        requestAnimationFrame(tick);
    }).catch(function (err) {
        if (err.name == "NotAllowedError") {
            showCameraError("Camera permission was denied. Allow camera access in your browser settings, then try again.");
        } else {
            showCameraError("No camera was found on this device.");
        }
    });
}

function tick() {
    if (!scanning) {
        return;
    }
    if (video.readyState == video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (typeof jsQR == "function") {
            var image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var found = jsQR(image.data, image.width, image.height);
            if (found && found.data) {
                scanning = false;
                handleCode(found.data);
                return;
            }
        } else {
            cameraMsg.innerHTML = "The QR scanner could not load. Check your internet or enter the code manually.";
            cameraMsg.classList.remove("hidden");
        }
    }
    requestAnimationFrame(tick);
}

function showState(name) {
    for (var i = 0; i < states.length; i++) {
        if (states[i] == name) {
            document.getElementById(states[i]).classList.remove("hidden");
        } else {
            document.getElementById(states[i]).classList.add("hidden");
        }
    }
    if (name == "stateScan") {
        startCamera();
    } else {
        stopCamera();
    }
    window.scrollTo(0, 0);
}

function fillCard(prefix, who, type, code, time) {
    document.getElementById(prefix + "Name").innerHTML = who;
    document.getElementById(prefix + "Type").innerHTML = type;
    document.getElementById(prefix + "Code").innerHTML = code;
    document.getElementById(prefix + "Time").innerHTML = time;
}

function handleCode(raw) {
    stopCamera();
    var code = raw.trim();

    if (navigator.onLine == false) {
        showOffline();
        return;
    }

    scanOnServer(code);
}

function personFrom(d) {
    var p = d.attendee || d.ticket || d.data || d;
    if (p.attendee) { p = p.attendee; }
    var name = p.name || p.attendeeName || p.fullName || ((p.firstName || "") + " " + (p.lastName || "")).trim() || "Attendee";
    var type = p.ticketType || p.type || (p.ticket && p.ticket.type) || "-";
    return { name: name, type: type, when: p.checkedInAt || p.scannedAt || p.firstScannedAt || "" };
}

function scanOnServer(code) {
    showToast("Checking ticket...");
    apiRequest("POST", "/scans/scan", { body: {
        code: code, ticketCode: code, qrCode: code, qrData: code,
        eventId: selected.id, event: selected.id, gate: selected.gate
    } }).then(function (res) {
        if (res.networkError) {
            showOffline();
            return;
        }
        var d = res.data || {};
        var text = JSON.stringify(d).toLowerCase();
        var person = personFrom(d);
        var time = nowTime();
        var who = person.name;

        if (/already|duplicate|previously|been used|used/.test(text) && !/unused/.test(text)) {
            var first = time;
            if (person.when) {
                var fd = new Date(person.when);
                if (!isNaN(fd.getTime())) { first = formatHour(fd); }
            }
            saveCheckIn({ eventId: selected.id, time: time, name: who, code: code, type: person.type, status: "Duplicate", gate: selected.gate });
            fillCard("d", who, person.type, code, first);
            showState("stateDuplicate");
            return;
        }

        if (res.ok && d.success !== false && d.valid !== false && !/invalid|not found|wrong event|not valid|expired/.test(text)) {
            saveCheckIn({ eventId: selected.id, time: time, name: who, code: code, type: person.type, status: "Confirmed", gate: selected.gate });
            lastScan = { name: who, type: person.type, code: code, time: time };
            fillCard("s", who, person.type, code, time);
            showState("stateSuccess");
            return;
        }

        saveCheckIn({ eventId: selected.id, time: time, name: "Unknown ticket", code: code, type: "-", status: "Declined", gate: selected.gate });
        showState("stateInvalid");
    });
}

function showOffline() {
    var card = "";
    if (lastScan) {
        card = '<div class="person-card off"><div class="pic">' + userSvg.replace(/#fff/g, "#17152B") + '</div><div>Name : ' + lastScan.name + '<br>Ticket type : ' + lastScan.type + '<br>Ticket code : ' + lastScan.code + '<br>Check-in : ' + lastScan.time + '</div></div>';
    }
    document.getElementById("offlineCard").innerHTML = card;
    showState("stateOffline");
}

var nextButtons = document.querySelectorAll(".scanNext");
for (var n = 0; n < nextButtons.length; n++) {
    nextButtons[n].addEventListener("click", function () {
        showState("stateScan");
    });
}

document.getElementById("manualLink").addEventListener("click", function () {
    document.getElementById("manualBox").classList.toggle("hidden");
    document.getElementById("manualInput").focus();
});

document.getElementById("manualBtn").addEventListener("click", function () {
    var typed = document.getElementById("manualInput").value;
    if (typed.trim() == "") {
        return;
    }
    document.getElementById("manualInput").value = "";
    handleCode(typed);
});

document.getElementById("refreshBtn").addEventListener("click", function () {
    if (navigator.onLine) {
        showState("stateScan");
    } else {
        alert("Still offline. Connect to a network and try again.");
    }
});

document.getElementById("retryCamera").addEventListener("click", function () {
    showState("stateScan");
});

document.getElementById("useManual").addEventListener("click", function () {
    showState("stateScan");
    document.getElementById("manualBox").classList.remove("hidden");
});

window.addEventListener("offline", function () {
    showOffline();
});

window.addEventListener("online", function () {
    showState("stateScan");
});

loadEvents().then(function () {
    selected = getSelectedEvent();
    if (!selected) {
        alert("No events available to scan for.");
        window.location.href = "dashboard.html";
        return;
    }
    if (!isLive(selected)) {
        alert("This event is not live yet. Scanning opens when the event starts.");
        window.location.href = "dashboard.html";
        return;
    }
    fillEventInfo();
    if (navigator.onLine) {
        showState("stateScan");
    } else {
        showOffline();
    }
});
