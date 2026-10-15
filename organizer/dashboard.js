var userName = apiUser().firstName;

document.getElementById("mGreeting").innerHTML = "Good Day, " + userName + " &#128075;";
document.getElementById("dGreeting").innerHTML = "Good Day, " + userName + " &#128075;";

loadEvents().then(function (events) {
    var totalEvents = events.length;
    var totalTickets = 0;
    var checkedIn = 0;
    for (var k = 0; k < events.length; k++) {
        totalTickets += events[k].totalTickets;
        checkedIn += events[k].checkedIn;
    }
    var pending = totalTickets - checkedIn;

    document.getElementById("mTotalEvents").innerHTML = totalEvents;
    document.getElementById("mTotalAttendance").innerHTML = totalTickets.toLocaleString();
    document.getElementById("dTotalEvents").innerHTML = totalEvents;
    document.getElementById("dTotalAttendance").innerHTML = totalTickets.toLocaleString();
    document.getElementById("dTotalTickets").innerHTML = totalTickets.toLocaleString();
    document.getElementById("dPending").innerHTML = pending.toLocaleString();

    var mobileList = "";
    var deskList = "";
    for (var i = 0; i < events.length; i++) {
        mobileList += heroCardHtml(events[i]);
        if (i < 3) {
            deskList += eventRowHtml(events[i]);
        }
    }
    if (events.length == 0) {
        mobileList = '<p class="sub">No events yet. Create your first event.</p>';
        deskList = mobileList;
    }
    document.getElementById("mEvents").innerHTML = mobileList;
    document.getElementById("dEvents").innerHTML = deskList;

    var rate = 0;
    if (totalTickets > 0) {
        rate = Math.round(checkedIn / totalTickets * 100);
    }
    document.getElementById("dRate").innerHTML = rate + "%";
    document.getElementById("dRateCount").innerHTML = checkedIn.toLocaleString() + "/" + totalTickets.toLocaleString();
    document.getElementById("dDonut").style.background = "conic-gradient(#5B4BDB 0 " + rate + "%, #DDD9F7 " + rate + "% 100%)";
});
