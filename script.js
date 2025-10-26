// Get DOM elements
const resultEl = document.querySelector('.result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

// Character sets
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Generate event listener
generateEl.addEventListener('click', () => {
    // '+' converts the input value to a number
    const length = +lengthEl.value; 
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(
        hasLower,
        hasUpper,
        hasNumber,
        hasSymbol,
        length
    );
});

// 🛠️ FIX: Corrected Clipboard Functionality 🛠️
clipboardEl.addEventListener('click', () => {
    const password = resultEl.innerText;

    if (!password) {
        // Stop if there is no password to copy
        return; 
    }

    // 1. Use the modern, asynchronous Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password)
            .then(() => {
                alert('Password copied to clipboard! ✅');
            })
            .catch(err => {
                // If modern API fails (e.g., security restrictions), use fallback
                copyFallback(password);
            });
    } else {
        // 2. Use the old, synchronous execCommand fallback
        copyFallback(password);
    }
});

/**
 * Fallback function for copying text using the old document.execCommand method.
 * It temporarily creates and uses a hidden textarea.
 * @param {string} password - The text to copy.
 */
function copyFallback(password) {
    const textarea = document.createElement('textarea');
    textarea.value = password;

    // Critical fix: Make the textarea selectable but invisible to the user
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px'; 
    textarea.style.top = '0'; 
    
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('Password copied to clipboard (fallback)! ✅');
        } else {
            alert('Failed to copy password.');
        }
    } catch (err) {
        console.error('Copy failed:', err);
        alert('Failed to copy password.');
    } finally {
        // Clean up: remove the temporary textarea
        textarea.remove();
    }
}
// -----------------------------------------------------------------------

/**
 * Main function to generate the password
 * @returns {string} The generated password
 */
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    
    // Filter out unchecked types
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
        item => Object.values(item)[0]
    );

    const typesCount = typesArr.length;

    // Check if no options are selected
    if (typesCount === 0) {
        return '';
    }

    // Loop for the password length
    for (let i = 0; i < length; i += typesCount) {
        // Cycle through checked types to ensure at least one of each is included early
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    // Trim to the exact length and shuffle for security
    const finalPassword = generatedPassword.slice(0, length);
    
    return shuffleString(finalPassword);
}

/**
 * Shuffles the characters of a string using the Fisher-Yates algorithm.
 * @param {string} str - The string to shuffle
 * @returns {string} The shuffled string
 */
function shuffleString(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr.join('');
}

// Generator Functions - one for each character type

function getRandomLower() {
    // 97-122 = a-z
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97); 
}

function getRandomUpper() {
    // 65-90 = A-Z
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    // 48-57 = 0-9
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48); 
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}





