function generateRandomString(length, characters) {
    let result = '';
    let charactersLength = characters.length;
    let maxValidRange = Math.floor(0xFFFFFFFF / charactersLength) * charactersLength;
    let randomArray = new Uint32Array(1); // Single-element array for random values

    for (let i = 0; i < length; i++) {
        let randomValue;
        do {
            window.crypto.getRandomValues(randomArray);
            randomValue = randomArray[0];
        } while (randomValue >= maxValidRange);

        result += characters.charAt(randomValue % charactersLength);
    }
    return result;
}

function removeDuplicates(inputString) {
    let result = '';
    let charSet = {};

    for (let i = 0; i < inputString.length; i++) {
        let char = inputString[i];
        if (!charSet[char]) {
            result += char;
            charSet[char] = true;
        }
    }
    return result;
}


function getEntropy(length, characters) {
    if (length == 0 || characters.length == 0) {
        return 0;
    }
    return length * Math.log2(characters.length);
}


function generatePasswords() {
    let length = parseInt(document.getElementById('length').value);
    let count = document.getElementById('count').value;
    let characters = '';
    let passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';

    if (document.getElementById('capitals').checked) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('smallCase').checked) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('numbers').checked) characters += '0123456789';
    if (document.getElementById('unreserved').checked) characters += '_-~.';
    if (document.getElementById('specialChars').checked) characters += '~!@#$%^&*()_-=+,./?;:[]';
    if (document.getElementById('confusing').checked) characters += '\\\'\"\`{} <>|';
    characters = removeDuplicates(characters);

    let shannon = getEntropy(length, characters);
    document.getElementById('entropy').innerHTML = shannon.toFixed(1);
    let shannonScaled = shannon / 122;
    document.getElementById('entropyScaled').innerHTML = shannonScaled.toFixed(3);

    if (characters.length === 0) {
        passwordList.innerHTML = '<li>Please select at least one character type.</li>';
        return;
    }

    for (let i = 0; i < count; i++) {
        let password = generateRandomString(length, characters);

        // Create elements
        let listItem = document.createElement('li');
        let codeElement = document.createElement('code');
        let buttonElement = document.createElement('button');

        // Set content and attributes
        codeElement.textContent = password;

        buttonElement.textContent = 'Copy';
        buttonElement.addEventListener('click', function () {
            copyToClipboard(password, this);
        });

        // Append elements to the DOM
        listItem.appendChild(codeElement);
        listItem.appendChild(buttonElement);
        passwordList.appendChild(listItem);
    }

    saveSettings();
}

function flashButton(button, newText, originalText) {
    button.textContent = newText;

    setTimeout(function () {
        button.textContent = originalText;
    }, 1000); // Revert back after 1 second
}

function shareURL(button) {
    let settings = getSettings();
    let params = settingsToParams(settings);

    let url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    copyToClipboard(url, button, "URL Copied!", "Share URL");
    updateURL(settings);
}

function copyToClipboard(text, button, buttonTextTransit = 'Copied!', buttonText = 'Copy') {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Copied length: " + text.length);
            flashButton(button, buttonTextTransit, buttonText);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
}

function hasParamsURL() {
    const params = new URLSearchParams(window.location.search);
    return params.size !== 0;
}

function settingsToParams(settings) {
    const params = new URLSearchParams();

    for (let key in settings) {
        params.set(key, settings[key]);
    }
    return params
}

function updateURL(settings) {
    params = settingsToParams(settings);
    history.pushState({}, '', '?' + params.toString());
}


function saveLocal(settings) {
    // localStorage.setItem('settings', JSON.stringify(settings));
}
function getSettings() {
    const settings = {
        length: document.getElementById('length').value,
        count: document.getElementById('count').value,
        capitals: document.getElementById('capitals').checked,
        smallCase: document.getElementById('smallCase').checked,
        numbers: document.getElementById('numbers').checked,
        unreserved: document.getElementById('unreserved').checked,
        specialChars: document.getElementById('specialChars').checked,
        confusing: document.getElementById('confusing').checked
    };
    return settings;
}
function saveSettings() {
    const settings = getSettings();
    if (hasParamsURL()) {
        // if some params are in the URL then continue using URL
        updateURL(settings);
    }
    else {
        // if the URL is clean then use local storage.
        saveLocal(settings);
    }
}

function loadSettings() {
    const params = new URLSearchParams(window.location.search);
    let settings = JSON.parse(localStorage.getItem('settings') || "{}");
    if (params.size !== 0) {
        for (let key of params.keys()) {

            let value = params.get(key);
            // For boolean values (checkboxes), convert string to boolean
            if (value === 'true') {
                settings[key] = true;
            } else if (value === 'false') {
                settings[key] = false;
            } else {
                settings[key] = value;
            }

        }
    }
    for (let key in settings) {
        let form = document.getElementById(key);
        if (form.type == 'checkbox') {
            form.checked = settings[key];
        }
        else {
            form.value = settings[key];
        }
    }
}

document.getElementById('length').oninput = function () {
    saveSettings();
    generatePasswords();
};

document.getElementById('count').oninput = function () {
    document.getElementById('count').textContent = this.value;
    saveSettings();
    generatePasswords();
};

document.querySelectorAll('input[type=checkbox]').forEach(function (checkbox) {
    checkbox.onchange = function () {
        saveSettings();
        generatePasswords();
    };
});

// Load settings and initial password generation
window.onload = function () {
    loadSettings();
    generatePasswords();
};
