var userName = localStorage.getItem("organizerName");
if (userName == null) {
    userName = backend.organizer.firstName;
}

document.getElementById("mGreeting").innerHTML = "Good Day, " + userName + " &#128075;";
document.getElementById("dGreeting").innerHTML = "Good Day, " + userName + " &#128075;";

var totalEvents = backend.events.length;
var pending = backend.totalAttendance - backend.checkedInTotal;

document.getElementById("mTotalEvents").innerHTML = totalEvents;
document.getElementById("mTotalAttendance").innerHTML = backend.totalAttendance.toLocaleString();
document.getElementById("dTotalEvents").innerHTML = totalEvents;
document.getElementById("dTotalAttendance").innerHTML = backend.totalAttendance.toLocaleString();
document.getElementById("dTotalTickets").innerHTML = backend.totalTickets.toLocaleString();
document.getElementById("dPending").innerHTML = pending.toLocaleString();

var mobileList = "";
var deskList = "";
for (var i = 0; i < backend.events.length; i++) {
    mobileList += heroCardHtml(backend.events[i]);
    if (i < 3) {
        deskList += eventRowHtml(backend.events[i]);
    }
}
document.getElementById("mEvents").innerHTML = mobileList;
document.getElementById("dEvents").innerHTML = deskList;

var rate = Math.round(backend.checkedInTotal / backend.totalAttendance * 100);
document.getElementById("dRate").innerHTML = rate + "%";
document.getElementById("dRateCount").innerHTML = backend.checkedInTotal.toLocaleString() + "/" + backend.totalAttendance.toLocaleString();
document.getElementById("dDonut").style.background = "conic-gradient(#5B4BDB 0 " + rate + "%, #DDD9F7 " + rate + "% 100%)";
