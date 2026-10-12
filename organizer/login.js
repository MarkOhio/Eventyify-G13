document.getElementById("forgotLink").addEventListener("click", function (e) {
    e.preventDefault();
    alert("Password reset is not connected yet.");
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail").value.trim();
    var pass = document.getElementById("loginPassword").value;
    var err = document.getElementById("errorText");
    var userName = "";

    if (email == backend.organizer.email && pass == backend.organizer.password) {
        userName = backend.organizer.firstName;
    }
    if (email == localStorage.getItem("newEmail") && pass == localStorage.getItem("newPass")) {
        userName = localStorage.getItem("newFirstName");
    }

    if (userName == "") {
        err.innerHTML = "Wrong email or password. Try " + backend.organizer.email + " / " + backend.organizer.password;
        return;
    }
    localStorage.setItem("organizerLoggedIn", "yes");
    localStorage.setItem("organizerName", userName);
    window.location.href = "dashboard.html";
});
