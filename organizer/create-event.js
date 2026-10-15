var editId = "";
if (window.location.search.indexOf("edit=") != -1) {
    editId = decodeURIComponent(window.location.search.split("edit=")[1].split("&")[0]);
}

var tabButtons = document.querySelectorAll("#mTabs button");
var tabIds = ["tabDetails", "tabStaff", "tabTicket"];

function showTab(id) {
    for (var i = 0; i < tabButtons.length; i++) {
        var tabId = tabButtons[i].getAttribute("data-tab");
        if (tabId == id) {
            tabButtons[i].classList.add("active");
            document.getElementById(tabId).classList.add("show");
        } else {
            tabButtons[i].classList.remove("active");
            document.getElementById(tabId).classList.remove("show");
        }
    }
    window.scrollTo(0, 0);
}

for (var t = 0; t < tabButtons.length; t++) {
    tabButtons[t].addEventListener("click", function () {
        showTab(this.getAttribute("data-tab"));
    });
}

document.getElementById("next1").addEventListener("click", function () {
    if (editId != "") {
        alert("Editing events is not available on the backend yet.");
        return;
    }
    showTab("tabStaff");
});

document.getElementById("next2").addEventListener("click", function () {
    showTab("tabTicket");
});

var addedStaff = [];

function showStaffList() {
    document.getElementById("mStaffList").innerHTML = '<p class="sub">Staff assignment is not connected to the backend yet.</p>';
    return;
    var text = document.getElementById("mStaffSearch").value.toLowerCase();
    var html = "";
    for (var i = 0; i < backend.staffCandidates.length; i++) {
        var p = backend.staffCandidates[i];
        if (p.name.toLowerCase().indexOf(text) == -1) {
            continue;
        }
        var button = '<button class="btn btn-small" type="button" onclick="addStaffToEvent(' + i + ')">+ Add Staff</button>';
        if (addedStaff.indexOf(i) != -1) {
            button = '<button class="btn btn-small btn-outline" type="button" onclick="addStaffToEvent(' + i + ')">Added</button>';
        }
        html += '<div class="staff-card"><div class="staff-left"><div class="avatar">' + userSvg + '</div><div><p class="staff-name">' + p.name + '</p><p class="staff-sub">Active</p></div></div>' + button + '</div>';
    }
    document.getElementById("mStaffList").innerHTML = html;
}

function addStaffToEvent(index) {
    var place = addedStaff.indexOf(index);
    if (place == -1) {
        addedStaff.push(index);
    } else {
        addedStaff.splice(place, 1);
    }
    showStaffList();
}

document.getElementById("mStaffSearch").addEventListener("input", showStaffList);
showStaffList();


var imageFile = document.getElementById("imageFile");
var imageButtons = document.querySelectorAll(".imageBtn");
for (var b = 0; b < imageButtons.length; b++) {
    imageButtons[b].addEventListener("click", function () {
        imageFile.click();
    });
}
imageFile.addEventListener("change", function () {
    if (imageFile.files.length > 0) {
        var messages = document.querySelectorAll(".imageMsg");
        for (var m = 0; m < messages.length; m++) {
            messages[m].innerHTML = imageFile.files[0].name;
        }
    }
});

var codesFile = document.getElementById("codesFile");
var codesButtons = document.querySelectorAll(".codesBtn");
for (var c = 0; c < codesButtons.length; c++) {
    codesButtons[c].addEventListener("click", function () {
        codesFile.click();
    });
}
codesFile.addEventListener("change", function () {
    if (codesFile.files.length > 0) {
        document.querySelector(".codesMsg").innerHTML = codesFile.files[0].name + " selected";
    }
});

function fieldValue(desktopId, mobileId) {
    var d = document.getElementById(desktopId);
    var m = document.getElementById(mobileId);
    if (d && d.value.trim() != "" && d.offsetParent !== null) { return d.value.trim(); }
    if (m && m.value.trim() != "" && m.offsetParent !== null) { return m.value.trim(); }
    if (d && d.value.trim() != "") { return d.value.trim(); }
    if (m) { return m.value.trim(); }
    return "";
}

function toIsoDate(text) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) { return text; }
    var d = new Date(text.replace(/(\d+)(st|nd|rd|th)/, "$1"));
    if (isNaN(d.getTime())) { return ""; }
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

function toTime24(text) {
    var t = parseTimeStr(text);
    if (!t) { return ""; }
    return pad2(t[0]) + ":" + pad2(t[1]);
}

var creating = false;
function createEvent() {
    if (creating) { return; }
    if (editId != "") {
        alert("Editing events is not available on the backend yet.");
        return;
    }
    var name = fieldValue("dEventTitle", "mName");
    var dateRaw = fieldValue("dStart", "mDate");
    var timeRaw = fieldValue("dStartTime", "mTime");
    var location = fieldValue("dVenue", "mLocation");
    var about = fieldValue("dDescription", "mAbout");
    var category = document.getElementById("dType").value;
    var endDate = document.getElementById("dEnd").value;
    var endTime = document.getElementById("dEndTime").value;

    var date = toIsoDate(dateRaw);
    var time = toTime24(timeRaw);
    if (name == "" || location == "") {
        alert("Enter the event name and location.");
        showTab("tabDetails");
        return;
    }
    if (date == "") {
        alert("Enter a valid date (for example 17 Oct 2026).");
        showTab("tabDetails");
        return;
    }

    var form = new FormData();
    form.append("name", name);
    form.append("title", name);
    form.append("date", date);
    form.append("startDate", date);
    form.append("time", time);
    form.append("startTime", time);
    form.append("location", location);
    form.append("venue", location);
    form.append("description", about);
    if (category != "") { form.append("category", category); }
    if (endDate != "") { form.append("endDate", endDate); }
    if (endTime != "") { form.append("endTime", endTime); }
    if (imageFile.files.length > 0) { form.append("image", imageFile.files[0]); }

    creating = true;
    var buttons = document.querySelectorAll(".createBtn");
    for (var b = 0; b < buttons.length; b++) { buttons[b].disabled = true; }

    apiRequest("POST", "/events", { form: form }).then(function (res) {
        if (!res.ok) {
            creating = false;
            for (var b2 = 0; b2 < buttons.length; b2++) { buttons[b2].disabled = false; }
            alert(apiMessage(res, "Could not create the event."));
            return;
        }
        var newId = idOf(res.data);
        if (codesFile.files.length > 0 && newId != "") {
            var codeForm = new FormData();
            codeForm.append("ticket", codesFile.files[0]);
            return apiRequest("POST", "/events/" + newId + "/codes", { form: codeForm }).then(function (r2) {
                if (!r2.ok) {
                    alert("Event created, but the ticket codes failed: " + apiMessage(r2, "upload error") + ". Upload them from Tickets & Codes.");
                }
                window.location.href = "events.html";
            });
        }
        window.location.href = "events.html";
    });
}

var createButtons = document.querySelectorAll(".createBtn");
for (var k = 0; k < createButtons.length; k++) {
    createButtons[k].addEventListener("click", createEvent);
}

var link = document.getElementById("eventLink");
var linkSwitch = document.getElementById("linkSwitch");
linkSwitch.addEventListener("click", function () {
    if (linkSwitch.className.indexOf("off") == -1) {
        linkSwitch.classList.add("off");
        link.readOnly = false;
        link.value = "";
        link.placeholder = "Type your own link";
    } else {
        linkSwitch.classList.remove("off");
        link.readOnly = true;
        link.value = "https://eventify.com/e/tech-creators-";
    }
});
link.readOnly = true;

document.getElementById("copyLink").addEventListener("click", function () {
    link.select();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(link.value);
    }
    alert("Link copied");
});

var shareButtons = document.querySelectorAll(".shareBtn");
for (var h = 0; h < shareButtons.length; h++) {
    shareButtons[h].addEventListener("click", function () {
        alert("Sharing by " + this.innerHTML + " is not connected yet.");
    });
}

if (editId != "") {
    loadEvents().then(function () {
        var ev = getEventById(editId);
        if (!ev) { return; }
        document.getElementById("mTitle").innerHTML = "Edit Details";
        document.getElementById("dTitle").innerHTML = "Edit Details";
        document.getElementById("mName").value = ev.name;
        document.getElementById("mLocation").value = ev.location;
        document.getElementById("mAbout").value = ev.about;
        document.getElementById("next1").innerHTML = "Done";
        document.getElementById("mCreate").innerHTML = "Done";
        document.getElementById("dCreate").innerHTML = "Done";
        document.getElementById("dEventTitle").value = ev.name;
        document.getElementById("dVenue").value = ev.location;
        document.getElementById("dDescription").value = ev.about;
    });
}
