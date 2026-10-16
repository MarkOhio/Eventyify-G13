var loadedTicketCodes = [];
var currentEventId = new URLSearchParams(window.location.search).get("id") || localStorage.getItem("lastCreatedEventId");

function ticketText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
}

function getCodeType(code, ticketType) {
    if (ticketType === "Regular" || ticketType === "VIP" || ticketType === "VVIP") return ticketType;
    var prefix = String(code || "").split("-")[0].toUpperCase();
    if (prefix === "VVIP") return "VVIP";
    if (prefix === "VIP") return "VIP";
    if (prefix === "REG" || prefix === "REGULAR") return "Regular";
    return "Ticket";
}

function showCodes() {
    var html = "";
    loadedTicketCodes.forEach(function (ticket) {
        var code = ticket.code_string || ticket.code || "Ticket code";
        var used = ticket.status === "used";
        var ticketStatus = used ? "Used" : (ticket.status === "unused" ? "Active" : "Unknown");
        var statusClass = used ? "pill-bad" : (ticket.status === "unused" ? "pill-ok" : "pill-main");
        html += '<div class="uploaded-ticket"><div class="ticket-code-icon">#</div><div class="uploaded-ticket-info"><strong>' + ticketText(code) + '</strong><span>' + ticketText(getCodeType(code, ticket.ticket_type)) + '</span></div><span class="pill ' + statusClass + '">' + ticketStatus + '</span></div>';
    });
    document.getElementById("codesList").innerHTML = html || '<p class="muted">No ticket codes have been uploaded for this event yet.</p>';
}

async function loadTicketCodes(eventId) {
    if (!eventId) {
        document.getElementById("fileMsg").textContent = "Choose an event before loading ticket codes.";
        showCodes();
        return;
    }
    document.getElementById("codesList").textContent = "Loading ticket codes…";
    try {
        var result = await apiRequest("/events/" + encodeURIComponent(eventId) + "/codes");
        loadedTicketCodes = Array.isArray(result.tickets) ? result.tickets : (Array.isArray(result.data) ? result.data : (Array.isArray(result.codes) ? result.codes : []));
        showCodes();
        document.getElementById("fileMsg").textContent = "";
    } catch (error) {
        if (error.message.toLowerCase().indexOf("no ticket found") !== -1) {
            loadedTicketCodes = [];
            showCodes();
            document.getElementById("fileMsg").textContent = "";
        } else {
            document.getElementById("codesList").textContent = error.message;
            document.getElementById("fileMsg").textContent = error.message;
        }
    }
}

var codesFile = document.getElementById("codesFile");
document.getElementById("chooseFile").addEventListener("click", function () { codesFile.click(); });
codesFile.addEventListener("change", async function () {
    if (!codesFile.files.length) return;
    if (!currentEventId) {
        document.getElementById("fileMsg").textContent = "Create or select an event before uploading ticket codes.";
        return;
    }
    var file = codesFile.files[0];
    if (!/\.(csv|txt)$/i.test(file.name)) {
        document.getElementById("fileMsg").textContent = "Please choose a CSV or TXT file with a code column.";
        codesFile.value = "";
        return;
    }
    var form = new FormData();
    form.append("ticket", file);
    document.getElementById("fileMsg").textContent = "Uploading ticket codes…";
    document.getElementById("chooseFile").disabled = true;
    try {
        var result = await apiRequest("/events/" + encodeURIComponent(currentEventId) + "/codes", { method: "POST", body: form });
        document.getElementById("fileMsg").textContent = result.message || "Ticket codes uploaded.";
        await loadTicketCodes(currentEventId);
    } catch (error) {
        document.getElementById("fileMsg").textContent = error.message;
    } finally {
        document.getElementById("chooseFile").disabled = false;
        codesFile.value = "";
    }
});

document.getElementById("downloadCodes").addEventListener("click", function () {
    if (!loadedTicketCodes.length) {
        document.getElementById("fileMsg").textContent = "There are no ticket codes to download yet.";
        return;
    }
    var csv = "code,status\n";
    loadedTicketCodes.forEach(function (ticket) {
        var code = String(ticket.code_string || ticket.code || "").replace(/"/g, '""');
        var status = String(ticket.status || "").replace(/"/g, '""');
        csv += '"' + code + '","' + status + '"\n';
    });
    downloadCsv("eventify-ticket-codes.csv", csv);
});
loadTicketCodes(currentEventId);
