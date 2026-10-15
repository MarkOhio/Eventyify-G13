document.getElementById("forgotLink").addEventListener("click", function (e) {
    e.preventDefault();
    runPasswordReset(document.getElementById("loginEmail").value.trim());
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail").value.trim();
    var pass = document.getElementById("loginPassword").value;
    var err = document.getElementById("errorText");
    if (email == "" || pass == "") {
        err.innerHTML = "Enter your email and password.";
        return;
    }
    err.innerHTML = "Signing in...";
    apiLogin(email, pass, "organizer").then(function (r) {
        if (!r.ok) {
            err.innerHTML = r.message;
            return;
        }
        window.location.href = "dashboard.html";
    });
});
