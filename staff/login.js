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

    if (email == backend.staff.email && pass == backend.staff.password) {
        userName = backend.staff.firstName;
    }
    if (email == localStorage.getItem("staffNewEmail") && pass == localStorage.getItem("staffNewPass")) {
        userName = localStorage.getItem("staffNewFirstName");
    }

    if (userName == "") {
        err.innerHTML = "Wrong email or password. Try " + backend.staff.email + " / " + backend.staff.password;
        return;
    }
    localStorage.setItem("staffLoggedIn", "yes");
    localStorage.setItem("staffName", userName);
    window.location.href = "dashboard.html";
});
