async function loadReports() {
    var total = 0;
    var checked = 0;
    var eventReports = [];
    try {
        var events = await fetchApiEvents();
        for (var i = 0; i < events.length; i++) {
            var eventTotal = 0;
            var eventChecked = 0;
            try {
                var result = await apiRequest("/scans/events/" + encodeURIComponent(events[i].id) + "/attendance");
                var data = result.data || result;
                eventTotal = Number(data.totalTickets || 0);
                eventChecked = Number(data.checkedIn || 0);
                total += eventTotal;
                checked += eventChecked;
            } catch (error) {}
            eventReports.push({ name: events[i].name, total: eventTotal, checked: eventChecked, rate: eventTotal ? Math.round(eventChecked / eventTotal * 100) : 0 });
        }
    } catch (error) {
        document.getElementById("mBars").textContent = error.message;
        document.getElementById("dEventBars").textContent = error.message;
        return;
    }

    var noShow = Math.max(total - checked, 0);
    var rate = total ? Math.round(checked / total * 100) : 0;
    var dateText = new Date().toLocaleDateString();
    document.getElementById("mDate").textContent = dateText;
    document.getElementById("dRange").textContent = dateText;
    document.getElementById("mTotal").textContent = total.toLocaleString();
    document.getElementById("mChecked").textContent = checked.toLocaleString() + " (" + rate + "%)";
    document.getElementById("rTotal").textContent = total.toLocaleString();
    document.getElementById("rChecked").textContent = checked.toLocaleString();
    document.getElementById("rNoShow").textContent = noShow.toLocaleString();
    document.getElementById("rRate").textContent = rate + "%";

    var biggest = 1;
    eventReports.forEach(function (event) { if (event.rate > biggest) biggest = event.rate; });
    var bars = "";
    eventReports.forEach(function (event) {
        var width = Math.round(event.rate / biggest * 100);
        bars += '<div class="bar-row"><span>' + escapeReportText(event.name) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + width + '%"></div></div><span class="num">' + event.rate + '%</span></div>';
    });
    document.getElementById("mBars").innerHTML = bars || '<p class="muted">No event attendance data available.</p>';
    document.getElementById("dEventBars").innerHTML = bars || '<p class="muted">No event attendance data available.</p>';

    document.querySelectorAll(".exportBtn").forEach(function (button) {
        button.onclick = function () {
            var csv = "Event,Total Tickets,Checked In,No Show,Attendance Rate\\n";
            eventReports.forEach(function (event) {
                csv += '"' + event.name.replace(/"/g, '""') + '",' + event.total + ',' + event.checked + ',' + Math.max(event.total - event.checked, 0) + ',' + event.rate + "%\\n";
            });
            downloadCsv("attendees-report.csv", csv);
        };
    });
}
function escapeReportText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
}
loadReports();
