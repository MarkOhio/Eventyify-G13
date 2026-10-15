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

loadEvents().then(function () {
    var ev = getEventById(getIdFromUrl());
    if (!ev) {
        document.getElementById("dName").innerHTML = "Event not found";
        return;
    }
    document.getElementById("bannerImg").src = ev.image;
    document.getElementById("dName").innerHTML = ev.name;
    document.getElementById("dStatus").innerHTML = ev.status;
    document.getElementById("mName").innerHTML = ev.name;
    document.getElementById("dDate").innerHTML = ev.longDate;
    document.getElementById("dLocation").innerHTML = ev.city;
    document.getElementById("dAbout").innerHTML = ev.about.replace(ev.name, "<b>" + ev.name + "</b>");
    document.getElementById("sCategory").innerHTML = ev.category;
    document.getElementById("sCapacity").innerHTML = ev.capacity;
    document.getElementById("editLinkD").href = "create-event.html?edit=" + ev.id;
    document.getElementById("editLinkM").href = "create-event.html?edit=" + ev.id;
    document.getElementById("dStaff").innerHTML = '<p class="sub">Staff assignment is not connected to the backend yet.</p>';

    var total = 0;
    var checked = 0;
    document.getElementById("sTotal").innerHTML = "...";
    document.getElementById("sChecked").innerHTML = "...";
    document.getElementById("sRemaining").innerHTML = "...";
    Promise.all([
        apiRequest("GET", "/events/" + ev.id + "/codes"),
        apiRequest("GET", "/scans/events/" + ev.id + "/attendance")
    ]).then(function (r) {
        if (r[0].ok) {
            total = unwrapList(r[0].data).length;
            if (r[0].data && (r[0].data.total || r[0].data.count)) { total = r[0].data.total || r[0].data.count; }
        }
        if (r[1].ok) {
            var d = r[1].data || {};
            var list = unwrapList(d);
            checked = Number(d.checkedIn || d.checkedInCount || d.totalCheckedIn || list.length || 0);
            if (total == 0) { total = Number(d.total || d.totalAttendees || 0); }
        }
        document.getElementById("sTotal").innerHTML = total;
        document.getElementById("sChecked").innerHTML = checked;
        document.getElementById("sRemaining").innerHTML = Math.max(total - checked, 0);
    });
});
