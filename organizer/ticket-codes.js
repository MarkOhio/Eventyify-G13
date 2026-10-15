var currentEvent = null;

function showCodes(count) {
    var html = "";
    if (currentEvent && count > 0) {
        html = ticketCardHtml({ batch: "EVT-" + String(currentEvent.id).slice(-4).toUpperCase(), tickets: count, status: "Active" }, currentEvent);
    } else if (currentEvent) {
        html = '<p class="sub">No ticket codes uploaded for this event yet.</p>';
    } else {
        html = '<p class="sub">Create an event first.</p>';
    }
    document.getElementById("codesList").innerHTML = html;
}

function loadCodes() {
    if (!currentEvent) {
        showCodes(0);
        return;
    }
    apiRequest("GET", "/events/" + currentEvent.id + "/codes").then(function (res) {
        if (!res.ok) {
            showApiNotice(apiMessage(res, "Could not load ticket codes."));
            showCodes(0);
            return;
        }
        var n = unwrapList(res.data).length;
        if (n == 0 && res.data && (res.data.total || res.data.count)) { n = res.data.total || res.data.count; }
        showCodes(n);
    });
}

function showTickets() {
    var rows = "";
    for (var i = 0; i < backend.ticketTypes.length; i++) {
        var t = backend.ticketTypes[i];
        rows += "<tr><td>" + t.name + "</td><td>" + t.price + "</td><td>" + t.sold + "</td><td>" + t.available + "</td><td><span class='pill pill-ok'>" + t.status + "</span></td><td>" + t.gate + "</td></tr>";
    }
    document.getElementById("ticketsBody").innerHTML = rows;

    var promo = "";
    for (var j = 0; j < backend.promoCodes.length; j++) {
        var p = backend.promoCodes[j];
        var cls = "pill pill-ok";
        if (p.status != "Active") {
            cls = "pill pill-bad";
        }
        promo += "<tr><td>" + p.code + "</td><td>" + p.discount + "</td><td>" + p.used + "</td><td><span class='" + cls + "'>" + p.status + "</span></td></tr>";
    }
    document.getElementById("promoBody").innerHTML = promo;
}

showTickets();

var codesFile = document.getElementById("codesFile");
document.getElementById("chooseFile").addEventListener("click", function () {
    if (!currentEvent) {
        alert("Create an event first.");
        return;
    }
    codesFile.click();
});

codesFile.addEventListener("change", function () {
    if (codesFile.files.length == 0 || !currentEvent) {
        return;
    }
    var msg = document.getElementById("fileMsg");
    msg.innerHTML = "Uploading " + codesFile.files[0].name + "...";
    var form = new FormData();
    form.append("ticket", codesFile.files[0]);
    apiRequest("POST", "/events/" + currentEvent.id + "/codes", { form: form }).then(function (res) {
        codesFile.value = "";
        if (res.ok) {
            msg.innerHTML = "Codes uploaded";
            loadCodes();
        } else {
            msg.innerHTML = apiMessage(res, "Upload failed.");
        }
    });
});

document.getElementById("viewCodes").addEventListener("click", function () {
    document.getElementById("uploadedTitle").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("addCategory").addEventListener("click", function () {
    alert("Adding a ticket category is not connected yet.");
});

document.getElementById("shareLink").addEventListener("click", function () {
    alert("Share link is not connected yet.");
});

var ticketTabs = document.querySelectorAll("#ticketTabs button");
for (var t = 0; t < ticketTabs.length; t++) {
    ticketTabs[t].addEventListener("click", function () {
        for (var x = 0; x < ticketTabs.length; x++) {
            ticketTabs[x].classList.remove("active");
            document.getElementById(ticketTabs[x].getAttribute("data-t")).classList.add("hidden");
        }
        this.classList.add("active");
        document.getElementById(this.getAttribute("data-t")).classList.remove("hidden");
    });
}

loadEvents().then(function (events) {
    var picker = document.createElement("select");
    picker.className = "input";
    picker.id = "eventPicker";
    picker.style.cssText = "margin-bottom:20px;max-width:420px";
    for (var i = 0; i < events.length; i++) {
        var o = document.createElement("option");
        o.value = events[i].id;
        o.innerHTML = events[i].name;
        picker.appendChild(o);
    }
    var grid = document.querySelector(".upload-grid");
    grid.parentNode.insertBefore(picker, grid);
    var wanted = getIdFromUrl();
    if (wanted != "") { picker.value = wanted; }
    picker.addEventListener("change", function () {
        currentEvent = getEventById(picker.value);
        loadCodes();
    });
    currentEvent = events.length ? getEventById(picker.value) : null;
    loadCodes();
});
