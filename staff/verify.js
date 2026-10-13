var row = document.getElementById("otpRow");
var boxes = row.getElementsByTagName("input");
var msg = document.getElementById("otpMsg");
var seconds = 59;
var timer;

function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    if (m < 10) {
        m = "0" + m;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return m + ":" + sec;
}

function startTimer() {
    seconds = 59;
    clearInterval(timer);
    msg.className = "otp-msg";
    msg.innerHTML = "Resend in " + formatTime(seconds) + "s";
    timer = setInterval(function () {
        seconds = seconds - 1;
        if (seconds <= 0) {
            clearInterval(timer);
            msg.innerHTML = "You can now resend the code.";
        } else if (msg.className == "otp-msg") {
            msg.innerHTML = "Resend in " + formatTime(seconds) + "s";
        }
    }, 1000);
}

function getCode() {
    var code = "";
    for (var i = 0; i < boxes.length; i++) {
        code = code + boxes[i].value;
    }
    return code;
}

function clearBoxes() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].value = "";
        boxes[i].classList.remove("filled");
    }
    boxes[0].focus();
}

function checkCode() {
    var code = getCode();
    if (code.length < 6) {
        row.classList.add("error");
        msg.className = "otp-msg error";
        msg.innerHTML = "Enter the 6 digit code.";
        return;
    }
    if (code == backend.otpCode) {
        localStorage.setItem("staffEmailVerified", "yes");
        window.location.href = "login.html";
    } else {
        row.classList.add("error");
        msg.className = "otp-msg error";
        msg.innerHTML = "Incorrect code. Try again.";
        clearBoxes();
    }
}

for (var b = 0; b < boxes.length; b++) {
    boxes[b].addEventListener("input", function () {
        row.classList.remove("error");
        if (msg.className == "otp-msg error") {
            msg.className = "otp-msg";
            msg.innerHTML = "Resend in " + formatTime(seconds) + "s";
        }
        if (this.value != "") {
            this.classList.add("filled");
            var next = this.nextElementSibling;
            if (next && next.className == "dash") {
                next = next.nextElementSibling;
            }
            if (next) {
                next.focus();
            }
        } else {
            this.classList.remove("filled");
        }
        if (getCode().length == 6) {
            checkCode();
        }
    });
    boxes[b].addEventListener("keydown", function (e) {
        if (e.key == "Backspace" && this.value == "") {
            var prev = this.previousElementSibling;
            if (prev && prev.className == "dash") {
                prev = prev.previousElementSibling;
            }
            if (prev) {
                prev.focus();
            }
        }
    });
}

document.getElementById("verifyBtn").addEventListener("click", checkCode);

document.getElementById("resendBtn").addEventListener("click", function () {
    if (seconds > 0) {
        alert("Please wait until the timer ends before asking for a new code.");
        return;
    }
    alert("A new code has been sent. (Dummy backend, use " + backend.otpCode + ")");
    clearBoxes();
    row.classList.remove("error");
    startTimer();
});

document.getElementById("verifyBack").addEventListener("click", function () {
    window.location.href = "signup.html";
});

boxes[0].focus();
startTimer();
