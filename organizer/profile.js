var profileUser = {};
try { profileUser = JSON.parse(localStorage.getItem("authUser") || "{}"); } catch (error) {}
var profileEmail = profileUser.email || localStorage.getItem("authEmail") || "";
var profileName = [profileUser.firstName, profileUser.lastName].filter(Boolean).join(" ").trim() || profileUser.name || localStorage.getItem("organizerName") || localStorage.getItem("authName") || localStorage.getItem("eventifyName_" + profileEmail.toLowerCase()) || (profileEmail ? profileEmail.split("@")[0] : "Organizer");
var profileId = profileUser.id || profileUser._id || localStorage.getItem("authUserId") || profileEmail.toLowerCase();
var phoneKey = "eventifyPhone_" + (profileId || "organizer");

document.getElementById("profileName").textContent = profileName;
document.getElementById("profileEmail").textContent = profileEmail;
document.getElementById("profileInitials").textContent = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join("") || "O";
document.getElementById("phoneNumber").value = localStorage.getItem(phoneKey) || "";

document.getElementById("savePhone").addEventListener("click", function () {
    var phone = document.getElementById("phoneNumber").value.trim();
    if (phone) localStorage.setItem(phoneKey, phone);
    else localStorage.removeItem(phoneKey);
    document.getElementById("profileMessage").textContent = phone ? "Phone number saved in this browser." : "Phone number cleared.";
});

document.getElementById("profileLogout").addEventListener("click", async function () {
    var token = localStorage.getItem("authToken");
    try {
        if (token) await apiRequest("/auth/logout", { method: "POST", token: token, body: {} });
    } catch (error) {}
    clearAuthSession();
    window.location.href = "login.html";
});
