const landingPage = "event-link-landing-page.html";
const verifyPage = "verify-ticket.html";
const successPage = "verification-success-screen.html";
const invalidPage = "invalid-ticket-code.html";
const demoCode = "123456";

const splash = document.getElementById("splash");
if (splash) {
    splash.addEventListener("click", function () {
        window.location.href = landingPage;
    });
    setTimeout(function () {
        window.location.href = landingPage;
    }, 2500);
}

const detailsForm = document.getElementById("detailsForm");
if (detailsForm) {
    const select = document.getElementById("select");
    const selectButton = document.getElementById("selectButton");
    const selectValue = document.getElementById("selectValue");
    const options = document.querySelectorAll("#options li");
    let selectedType = "";

    selectButton.addEventListener("click", function () {
        select.classList.toggle("open");
    });

    options.forEach(function (option) {
        option.addEventListener("click", function () {
            selectedType = option.textContent;
            selectValue.textContent = selectedType;
            selectButton.classList.add("has-value");
            select.classList.remove("open", "error");
            options.forEach(function (item) {
                item.classList.toggle("selected", item === option);
            });
        });
    });

    document.addEventListener("click", function (event) {
        if (!select.contains(event.target)) {
            select.classList.remove("open");
        }
    });

    detailsForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!selectedType) {
            select.classList.add("error");
            return;
        }
        window.location.href = verifyPage;
    });
}

const verifyButton = document.getElementById("verifyButton");
if (verifyButton) {
    const codeInput = document.getElementById("code");

    verifyButton.addEventListener("click", function () {
        const code = codeInput.value.trim();
        if (!code) {
            codeInput.focus();
            return;
        }
        window.location.href = code === demoCode ? successPage : invalidPage;
    });

    document.getElementById("resendButton").addEventListener("click", function (event) {
        event.target.textContent = "Code sent";
    });
}
