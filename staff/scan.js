var selected = getSelectedEvent();

if (!selected) {
    alert("You have no accepted events yet.");
    window.location.href = "dashboard.html";
} else if (!isLive(selected)) {
    alert("This event is not live yet. Scanning opens when the event starts.");
    window.location.href = "dashboard.html";
}

var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var cameraMsg = document.getElementById("cameraMsg");
var stream = null;
var scanning = false;
var lastScan = null;
var states = ["stateScan", "stateSuccess", "stateDuplicate", "stateInvalid", "stateOffline", "stateCamera"];

if (selected) {
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
    var code = raw.trim().toUpperCase();
    var match = code.match(/[A-Z]{3}-\d+/);
    if (match) {
        code = match[0];
    }

    if (navigator.onLine == false) {
        showOffline();
        return;
    }

    var ticket = backend.tickets[code];
    if (ticket == undefined || ticket.eventId != selected.id) {
        saveCheckIn({ eventId: selected.id, time: nowTime(), name: "Unknown ticket", code: code, type: "-", status: "Declined", gate: selected.gate });
        showState("stateInvalid");
        return;
    }

    var firstTime = "";
    var all = getCheckIns();
    for (var i = 0; i < all.length; i++) {
        if (all[i].eventId == selected.id && all[i].code == code && all[i].status == "Confirmed") {
            firstTime = all[i].time;
        }
    }

    if (firstTime != "") {
        saveCheckIn({ eventId: selected.id, time: nowTime(), name: ticket.name, code: code, type: ticket.type, status: "Duplicate", gate: selected.gate });
        fillCard("d", ticket.name, ticket.type, code, firstTime);
        showState("stateDuplicate");
    } else {
        var time = nowTime();
        saveCheckIn({ eventId: selected.id, time: time, name: ticket.name, code: code, type: ticket.type, status: "Confirmed", gate: selected.gate });
        lastScan = { name: ticket.name, type: ticket.type, code: code, time: time };
        fillCard("s", ticket.name, ticket.type, code, time);
        showState("stateSuccess");
    }
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

if (selected && isLive(selected)) {
    if (navigator.onLine) {
        showState("stateScan");
    } else {
        showOffline();
    }
}
