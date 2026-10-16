(async function () {
    try { await fetchApiEvents(); } catch (error) {
        var detail = document.getElementById("dName");
        if (detail) detail.textContent = error.message;
        return;
    }
var ev = getEventById(getIdFromUrl());
if (!ev) {
    document.getElementById("dName").textContent = "Event not found. Return to Events and choose an event.";
    return;
}
var assignedStaff = [];
try {
    var staffResponse = await apiRequest("/auth/staffs");
    var allStaff = Array.isArray(staffResponse) ? staffResponse : (Array.isArray(staffResponse.data) ? staffResponse.data : []);
    var assignedIds = Array.isArray(ev.staff) ? ev.staff.map(function (entry) {
        return String(entry && (entry._id || entry.id) || entry);
    }) : [];
    assignedStaff = allStaff.filter(function (person) {
        return assignedIds.indexOf(String(person._id || person.id || "")) !== -1;
    });
} catch (staffError) {
    document.getElementById("dStaff").textContent = "Could not load assigned staff: " + staffError.message;
}

var bannerImage = document.getElementById("bannerImg");
if (ev.image) bannerImage.src = ev.image; else bannerImage.style.display = "none";
document.getElementById("dName").innerHTML = ev.name;
document.getElementById("dStatus").textContent = ev.status;
document.getElementById("mName").innerHTML = ev.name;
document.getElementById("dDate").innerHTML = ev.longDate;
document.getElementById("dLocation").innerHTML = ev.city;
document.getElementById("dAbout").innerHTML = ev.about.replace(ev.name, "<b>" + ev.name + "</b>");
document.getElementById("sTotal").innerHTML = ev.totalTickets;
document.getElementById("sChecked").innerHTML = ev.checkedIn;
document.getElementById("sRemaining").innerHTML = ev.remaining;
document.getElementById("sCategory").innerHTML = ev.category;
document.getElementById("sCapacity").innerHTML = ev.capacity;
document.getElementById("editLinkD").href = "create-event.html?edit=" + ev.id;
document.getElementById("editLinkM").href = "create-event.html?edit=" + ev.id;
var attendanceLink = document.getElementById("attendanceLink");
if (attendanceLink) attendanceLink.href = "attendance.html?id=" + encodeURIComponent(ev.id);
var endButtons = document.querySelectorAll(".end-event-btn");
function updateEndedState() {
    var ended = localStorage.getItem("eventifyEnded_" + ev.id) === "yes";
    var status = ended ? "Ended" : ev.status;
    var statusClass = status === "Active" ? "status-active" : (status === "Ended" ? "status-ended" : "status-upcoming");
    document.getElementById("dStatus").textContent = status;
    document.getElementById("dStatus").className = "pill " + statusClass;
    document.getElementById("mStatus").textContent = status;
    document.getElementById("mStatus").className = "pill only-mobile " + statusClass;
    endButtons.forEach(function (button) {
        button.textContent = ended ? "Event Ended" : "End Event";
        button.disabled = ended;
    });
}
endButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (localStorage.getItem("eventifyEnded_" + ev.id) === "yes") return;
        if (!window.confirm("End this event? This status will be saved only in this browser.")) return;
        localStorage.setItem("eventifyEnded_" + ev.id, "yes");
        ev.status = "Ended";
        updateEndedState();
    });
});
updateEndedState();

var staffHtml = "";
function staffText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
}
for (var s = 0; s < assignedStaff.length; s++) {
    var p = assignedStaff[s];
    var name = [p.firstName, p.lastName].filter(Boolean).join(" ") || p.name || p.email || "Staff member";
    staffHtml += '<div class="staff-card"><div class="staff-left"><div class="avatar">' + userSvg + '</div><div><p class="staff-name">' + staffText(name) + '</p><p class="staff-sub">' + staffText(p.email || "") + '</p></div></div><span class="active-pill">Assigned</span></div>';
}
if (!staffHtml) staffHtml = '<p class="sub">No staff are assigned to this event.</p>';
if (document.getElementById("dStaff").textContent.indexOf("Could not load assigned staff:") !== 0) document.getElementById("dStaff").innerHTML = staffHtml;

var tabs = document.querySelectorAll("#detailTabs button");
for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () {
        for (var x = 0; x < tabs.length; x++) {
            tabs[x].classList.remove("active");
            document.getElementById(tabs[x].getAttribute("data-panel")).classList.remove("show");
        }
        this.classList.add("active");
        document.getElementById(this.getAttribute("data-panel")).classList.add("show");
    });
}

var bannerFile = document.getElementById("bannerFile");
document.getElementById("bannerBtn").addEventListener("click", function () {
    bannerFile.click();
});
bannerFile.addEventListener("change", function () {
    if (bannerFile.files.length > 0) {
        document.getElementById("bannerImg").src = URL.createObjectURL(bannerFile.files[0]);
    }
});

})();
