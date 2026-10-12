var cards = "";
for (var i = 0; i < backend.events.length; i++) {
    cards += heroCardHtml(backend.events[i]);
}
document.getElementById("mEventList").innerHTML = cards;
document.getElementById("dEventList").innerHTML = cards;
