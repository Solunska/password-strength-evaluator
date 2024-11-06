const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
const alerts = document.getElementById('alerts');
const score = document.getElementById('score');
const progress = document.getElementById('progress');
const button = document.getElementById("btn");

const COMMON_WORDS = ["password", "12345", "qwerty", "admin"];
const PASSWORD_REQUIREMENTS = [
    { regex: /[a-z]/, message: 'Password should contain at least 1 lowercase letter', pointValue: 1 },
    { regex: /[A-Z]/, message: 'Password should contain at least 1 uppercase letter', pointValue: 1 },
    { regex: /[0-9]/, message: 'Password should contain at least 1 digit', pointValue: 1 },
    { regex: /[!@#$%^&*?]/, message: 'Password should contain at least 1 special character', pointValue: 2 }
];

let typingTimeout;

passwordInput.addEventListener('input', onStopTyping);
passwordInput.addEventListener('blur', checkPasswordStrength);

function onStopTyping() {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(checkPasswordStrength, 1000);
}

function checkPasswordStrength() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const passwordLowerCase = password.toLowerCase();

    const strengthMessage = document.createElement('p');

    let points = 0;
    let strength = '';

    alerts.innerHTML = '';
    score.innerHTML = '';

    function addAlert(message) {
        const newListItem = document.createElement('li');
        newListItem.textContent = message;
        alerts.appendChild(newListItem);
    }

    function updateStrengthDisplay(passStrength, width, color) {
        strength = passStrength;
        progress.style.width = width;
        progress.style.backgroundColor = color;
        strengthMessage.style.color = color;
    }

    // PASSWORD LENGTH
    if (password.length < 8) {
        addAlert('Password should be at least 8 characters');
    }
    if (password.length >= 8 && password.length <= 12) {
        points++;
    }
    if (password.length > 12) {
        points = points + 3;
    }

    // REGEX VALIDATION
    PASSWORD_REQUIREMENTS.forEach(({ regex, message, pointValue }) => {
        if (regex.test(password)) {
            points += pointValue;
        } else {
            addAlert(message);
        }
    });

    // PASSWORD UNIQUENESS
    if (password === username || password.includes(username)) {
        addAlert('Your password should be unique and should not contain your Username');
    } else {
        points++;
    }

    if (COMMON_WORDS.some(word => passwordLowerCase.includes(word))) {
        points = points - 2;
        addAlert('Password should not contain common words like "password", "12345", etc.');
    } else {
        points++;
    }

    if (points <= 4) {
        updateStrengthDisplay('Weak', '25%', '#a11d1d');
    } else if (points <= 7) {
        updateStrengthDisplay('Moderate', '50%', '#b87f17');
    } else if (points < 10) {
        updateStrengthDisplay('Strong', '75%', '#34bc34');
    } else {
        updateStrengthDisplay('Very Strong', '100%', '#006400');
    }

    if (strength === 'Strong' && password.length <= 12) {
        strengthMessage.textContent = `To make your password even stronger, make it longer!`;
    } else {
        strengthMessage.textContent = `Password Strength: ${strength}`;
    }

    score.appendChild(strengthMessage);

    button.disabled = alerts.children.length > 0;
}