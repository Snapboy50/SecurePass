
// Get HTML Elements
const generatePassword = document.getElementById("generatePassword");
const generatedPassword = document.getElementById("generatedPassword");
const passwordLength = document.getElementById("passwordLength");
const copyPassword = document.getElementById("copyPassword");

const includeUppercase = document.getElementById("includeUppercase");
const includeLowercase = document.getElementById("includeLowercase");
const includeNumbers = document.getElementById("includeNumbers");
const includeSpecial = document.getElementById("includeSpecial");


// Secure Random Number Generator
function secureRandomInt(max) {

    const range = 0x100000000;
    const limit = range - (range % max);

    const randomArray = new Uint32Array(1);

    let randomNumber;

    do {
        crypto.getRandomValues(randomArray);
        randomNumber = randomArray[0];

    } while (randomNumber >= limit);

    return randomNumber % max;
}


// Password Length Display
passwordLength.addEventListener("input", function () {

    document.getElementById("lengthValue").textContent =
        passwordLength.value;

});


// Generate Password
generatePassword.addEventListener("click", function () {

    const characterSets = [];

    if (includeUppercase.checked) {
        characterSets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if (includeLowercase.checked) {
        characterSets.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (includeNumbers.checked) {
        characterSets.push("0123456789");
    }

    if (includeSpecial.checked) {
        characterSets.push("!@#$%^&*");
    }


    // Check character selection
    if (characterSets.length === 0) {

        alert("Please select at least one option.");
        return;

    }


    const length = Number(passwordLength.value);

    // Ensure password can contain every selected category
    if (length < characterSets.length) {

        alert(
            "Password length must be at least " +
            characterSets.length +
            " to include all selected character types."
        );

        return;

    }


    let characters = "";

    characterSets.forEach(function (set) {
        characters += set;
    });


    let passwordCharacters = [];


    // Add at least one character from every selected category
    characterSets.forEach(function (set) {

        const randomIndex = secureRandomInt(set.length);

        passwordCharacters.push(set[randomIndex]);

    });


    // Fill the remaining password positions
    while (passwordCharacters.length < length) {

        const randomIndex = secureRandomInt(characters.length);

        passwordCharacters.push(characters[randomIndex]);

    }


    // Securely shuffle the password characters
    for (let i = passwordCharacters.length - 1; i > 0; i--) {

        const randomIndex = secureRandomInt(i + 1);

        [
            passwordCharacters[i],
            passwordCharacters[randomIndex]
        ] = [
            passwordCharacters[randomIndex],
            passwordCharacters[i]
        ];

    }


    // Display generated password
    const password = passwordCharacters.join("");

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

    // Avoid errors if the strength display is not on this page
    if (!strengthText || !strengthBar) {
        return;
    }


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
copyPassword.addEventListener("click", async function () {

    if (generatedPassword.value === "") {

        alert("Please generate a password first.");
        return;

    }

    try {

        await navigator.clipboard.writeText(generatedPassword.value);

        alert("Password copied successfully!");

    } catch (error) {

        alert(
            "Unable to copy the password. " +
            "Please copy it manually."
        );

    }

});
