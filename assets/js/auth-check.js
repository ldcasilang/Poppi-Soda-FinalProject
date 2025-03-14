import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

// Hide content until authentication is verified
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";  // Redirect to login page if not logged in
    } else {
        document.body.style.display = "block"; // Show content if authenticated
    }
});

// Logout button functionality
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html"; // Redirect after logout
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});
