var cards = document.querySelectorAll(".setting-card");
for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
        alert(this.getAttribute("data-msg"));
    });
}

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("staffLoggedIn");
    window.location.href = "login.html";
});
