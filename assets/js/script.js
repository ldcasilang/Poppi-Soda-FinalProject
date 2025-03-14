import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJxB0I30uYtizWZer6nO781X88EsT2xAU",
    authDomain: "poppi-soda.firebaseapp.com",
    projectId: "poppi-soda",
    storageBucket: "poppi-soda.firebasestorage.app",
    messagingSenderId: "1029647897918",
    appId: "1:1029647897918:web:7d183374d354b532cd086f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Ensure the script runs after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const authButton = document.getElementById("auth-button");
    const userEmailSpan = document.getElementById("user-email");
    const cartButton = document.getElementById("cart-button"); // The cart button (fa-cart-plus)

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();  // Prevent page refresh

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    localStorage.setItem("userEmail", user.email); // Store email in localStorage
                    alert("Success! Welcome back!");
                    window.location.href = "home.html"; // Redirect after login
                })
                .catch((error) => {
                    console.error("Login failed:", error);
                    alert("Error: " + error.message);
                });
        });
    }

    // Check Authentication State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userEmailSpan.textContent = user.email;  // Show the user's email
            authButton.textContent = "Logout";  // Change button to Logout
            authButton.addEventListener("click", () => {
                signOut(auth).then(() => {
                    localStorage.removeItem("userEmail");  // Remove email from localStorage
                    window.location.reload();  // Reload to update UI
                });
            });

            // Allow access to cart if user is logged in
            if (cartButton) {
                cartButton.addEventListener("click", () => {
                    window.location.href = "cart.html"; // Redirect to cart page
                });
            }
        } else {
            userEmailSpan.textContent = "Not Signed In"; // Default text
            authButton.textContent = "Login";  // Reset to Login
            authButton.href = "login.html";  // Redirect to login page

            // Prevent cart access if not logged in
            if (cartButton) {
                cartButton.addEventListener("click", () => {
                    alert("You need to log in first to access your cart.");
                    window.location.href = "login.html"; // Redirect to login page
                });
            }
        }
    });
});
