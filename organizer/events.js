loadEvents().then(function (events) {
    var cards = "";
    for (var i = 0; i < events.length; i++) {
        cards += heroCardHtml(events[i]);
    }
    if (events.length == 0) {
        cards = '<p class="sub">No events yet.</p>';
    }
    document.getElementById("mEventList").innerHTML = cards;
    document.getElementById("dEventList").innerHTML = cards;
});
