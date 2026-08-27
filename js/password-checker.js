// Get HTML elements
const passwordInput = document.getElementById("password");

const passwordLength = document.getElementById("passwordLength");
const clearPassword = document.getElementById("clearPassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const lengthCheck = document.getElementById("lengthCheck");
const uppercaseCheck = document.getElementById("uppercaseCheck");
const lowercaseCheck = document.getElementById("lowercaseCheck");
const numberCheck = document.getElementById("numberCheck");
const specialCheck = document.getElementById("specialCheck");

const recommendation = document.getElementById("recommendation");

const togglePassword = document.getElementById("togglePassword");


// ================================
// PASSWORD CHECKER
// ================================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    // Update password length
    passwordLength.textContent = password.length;


    // Check password requirements
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);


    // Update requirement messages
    lengthCheck.textContent =
        (hasLength ? "✅ " : "❌ ") +
        "At least 8 characters";

    uppercaseCheck.textContent =
        (hasUppercase ? "✅ " : "❌ ") +
        "Contains an uppercase letter";

    lowercaseCheck.textContent =
        (hasLowercase ? "✅ " : "❌ ") +
        "Contains a lowercase letter";

    numberCheck.textContent =
        (hasNumber ? "✅ " : "❌ ") +
        "Contains a number";

    specialCheck.textContent =
        (hasSpecial ? "✅ " : "❌ ") +
        "Contains a special character";


    // Calculate score
    let score = 0;

    if (hasLength) {
        score += 20;
    }

    if (hasUppercase) {
        score += 20;
    }

    if (hasLowercase) {
        score += 20;
    }

    if (hasNumber) {
        score += 20;
    }

    if (hasSpecial) {
        score += 20;
    }


    // Update strength bar
    strengthBar.style.width = score + "%";
    strengthBar.textContent = score + "%";


    // Display strength
    if (score === 0) {

        strengthBar.className = "progress-bar";
        strengthText.textContent = "Enter a password";

        recommendation.className = "alert alert-secondary";
        recommendation.textContent =
            "Enter a password to receive security recommendations.";

    }

    else if (score <= 40) {

        strengthBar.className = "progress-bar bg-danger";
        strengthText.textContent = "Weak Password";

        recommendation.className = "alert alert-danger";
        recommendation.textContent =
            "Your password is weak. Try making it longer and adding uppercase letters, numbers and special characters.";

    }

    else if (score < 80) {

        strengthBar.className = "progress-bar bg-warning";
        strengthText.textContent = "Medium Password";

        recommendation.className = "alert alert-warning";
        recommendation.textContent =
            "Your password is fairly good, but you can improve it by adding the missing requirements.";

    }

    else {

        strengthBar.className = "progress-bar bg-success";
        strengthText.textContent = "Strong Password";

        recommendation.className = "alert alert-success";
        recommendation.textContent =
            "Strong password! Remember to use a unique password for each account.";

    }

});


// ================================
// SHOW / HIDE PASSWORD
// ================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    }

    else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


// ================================
// CLEAR PASSWORD
// ================================

clearPassword.addEventListener("click", function () {

    // Clear password
    passwordInput.value = "";

    // Reset length
    passwordLength.textContent = "0";

    // Reset strength bar
    strengthBar.style.width = "0%";
    strengthBar.textContent = "";
    strengthBar.className = "progress-bar";

    // Reset strength text
    strengthText.textContent = "Enter a password";


    // Reset requirements
    lengthCheck.textContent =
        "❌ At least 8 characters";

    uppercaseCheck.textContent =
        "❌ Contains an uppercase letter";

    lowercaseCheck.textContent =
        "❌ Contains a lowercase letter";

    numberCheck.textContent =
        "❌ Contains a number";

    specialCheck.textContent =
        "❌ Contains a special character";


    // Reset recommendation
    recommendation.className =
        "alert alert-secondary";

    recommendation.textContent =
        "Enter a password to receive security recommendations.";

});