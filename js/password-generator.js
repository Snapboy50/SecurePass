const generatePassword = document.getElementById("generatePassword");
const generatedPassword = document.getElementById("generatedPassword");
const passwordLength = document.getElementById("passwordLength");
const copyPassword = document.getElementById("copyPassword");

const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSpecial = document.getElementById("includeSpecial");


// Password Length Display
passwordLength.addEventListener("input", function () {
    document.getElementById("lengthValue").textContent = passwordLength.value;
});


// Generate Password
generatePassword.addEventListener("click", function () {

    let characters = "";

    if (includeUppercase.checked) {
        characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (includeLowercase.checked) {
        characters += "abcdefghijklmnopqrstuvwxyz";
    }

    if (includeNumbers.checked) {
        characters += "0123456789";
    }

    if (includeSpecial.checked) {
        characters += "!@#$%^&*";
    }

    if (characters.length === 0) {
        alert("Please select at least one option.");
        return;
    }


    let password = "";

    for (let i = 0; i < passwordLength.value; i++) {

        const randomIndex =
            Math.floor(Math.random() * characters.length);

        password += characters[randomIndex];
    }

    generatedPassword.value = password;

    checkPasswordStrength(password);
});


// Password Strength Checker
function checkPasswordStrength(password) {

    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    const strengthText = document.getElementById("strengthText");
    const strengthBar = document.getElementById("strengthBar");

    if (score <= 2) {

        strengthText.textContent = "Weak Password";
        strengthBar.style.width = "40%";

    } else if (score <= 4) {

        strengthText.textContent = "Medium Password";
        strengthBar.style.width = "70%";

    } else {

        strengthText.textContent = "Strong Password";
        strengthBar.style.width = "100%";
    }
}


// Copy Password
copyPassword.addEventListener("click", function () {

    if (generatedPassword.value === "") {
        alert("Please generate a password first.");
        return;
    }

    generatedPassword.select();

    navigator.clipboard.writeText(generatedPassword.value);

    alert("Password copied!");

});