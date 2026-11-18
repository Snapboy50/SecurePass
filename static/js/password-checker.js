
// Get HTML Elements
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
// RESET PASSWORD CHECKER
// ================================

function resetChecker() {

    passwordLength.textContent = "0";

    strengthBar.style.width = "0%";
    strengthBar.textContent = "";
    strengthBar.className = "progress-bar";

    strengthText.textContent = "Enter a password";

    lengthCheck.textContent = "❌ At least 8 characters";
    uppercaseCheck.textContent = "❌ Contains an uppercase letter";
    lowercaseCheck.textContent = "❌ Contains a lowercase letter";
    numberCheck.textContent = "❌ Contains a number";
    specialCheck.textContent = "❌ Contains a special character";

    recommendation.className = "alert alert-secondary";

    recommendation.textContent =
        "Enter a password to receive security recommendations.";
}


// ================================
// PASSWORD CHECKER
// ================================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    if (password.length === 0) {
        resetChecker();
        return;
    }

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

    if (hasLength) score += 20;
    if (hasUppercase) score += 20;
    if (hasLowercase) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecial) score += 20;

    // Update strength bar
    strengthBar.style.width = score + "%";
    strengthBar.textContent = score + "%";

    // Display password strength
    if (score <= 40) {

        strengthBar.className = "progress-bar bg-danger";
        strengthText.textContent = "Weak Password";

        recommendation.className = "alert alert-danger";

        recommendation.textContent =
            "Your password is weak. Try making it longer and adding uppercase letters, numbers and special characters.";

    } else if (score < 80) {

        strengthBar.className = "progress-bar bg-warning";
        strengthText.textContent = "Medium Password";

        recommendation.className = "alert alert-warning";

        recommendation.textContent =
            "Your password is fairly good, but you can improve it by adding the missing requirements.";

    } else {

        strengthBar.className = "progress-bar bg-success";
        strengthText.textContent = "Strong Password";

        recommendation.className = "alert alert-success";

        recommendation.textContent =
            "Your password meets all five basic checks. Use a unique password for every account.";
    }

});


// ================================
// SAVE PASSWORD CHECKING METADATA
// ================================

passwordInput.addEventListener("change", async function () {

    const password = passwordInput.value;

    // Do not save empty input
    if (password.length === 0) {
        return;
    }

    // Calculate criteria again for database storage
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const criteriaMet = [
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial
    ].filter(Boolean).length;

    const score = criteriaMet * 20;

    let strength;

    if (score <= 40) {
        strength = "Weak";
    } else if (score < 80) {
        strength = "Medium";
    } else {
        strength = "Strong";
    }

    // Send metadata only, never the actual password
    const result = {
        password_length: password.length,
        criteria_met: criteriaMet,
        strength: strength
    };

    try {

        const response = await fetch("/api/password-history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Could not save result:", data.message);
            return;
        }

        console.log(data.message);

    } catch (error) {

        console.error("Error connecting to SecurePass:", error);

    }

});


// ================================
// SHOW / HIDE PASSWORD
// ================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


// ================================
// CLEAR PASSWORD
// ================================

clearPassword.addEventListener("click", function () {

    passwordInput.value = "";

    passwordInput.type = "password";
    togglePassword.textContent = "Show";

    resetChecker();

});
