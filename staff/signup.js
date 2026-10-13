var choiceStep = document.getElementById("choiceStep");
var formStep = document.getElementById("formStep");

document.getElementById("googleBtn").addEventListener("click", function () {
    alert("Google sign up is not connected yet. It will call the backend later.");
});

document.getElementById("appleBtn").addEventListener("click", function () {
    alert("Apple sign up is not connected yet. It will call the backend later.");
});

document.getElementById("emailBtn").addEventListener("click", function () {
    choiceStep.classList.remove("active");
    formStep.classList.add("active");
});

document.getElementById("formBack").addEventListener("click", function () {
    formStep.classList.remove("active");
    choiceStep.classList.add("active");
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = document.getElementById("errorText");
    var first = document.getElementById("firstName").value.trim();
    var last = document.getElementById("lastName").value.trim();
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("password").value;
    var pass2 = document.getElementById("confirmPassword").value;

    if (first == "" || last == "" || email == "" || pass == "") {
        err.innerHTML = "Please fill in all the fields.";
        return;
    }
    if (email.indexOf("@") == -1) {
        err.innerHTML = "Enter a valid email address.";
        return;
    }
    if (pass.length < 6) {
        err.innerHTML = "Password must be at least 6 characters.";
        return;
    }
    if (pass != pass2) {
        err.innerHTML = "Passwords do not match.";
        return;
    }
    err.innerHTML = "";
    localStorage.setItem("staffNewFirstName", first);
    localStorage.setItem("staffNewLastName", last);
    localStorage.setItem("staffNewEmail", email);
    localStorage.setItem("staffNewPass", pass);
    window.location.href = "verify-passcode.html";
});
