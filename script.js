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
  

function generatePasswords() {
    let length = document.getElementById('lengthInput').value;
    let count = document.getElementById('count').value;
    let characters = '';
    let passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';

    if (document.getElementById('capitals').checked) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('smallCase').checked) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('numbers').checked) characters += '0123456789';
    if (document.getElementById('unreserved').checked) characters += '_-~.';
    if (document.getElementById('specialChars').checked) characters += '~!@#$%^&*()+=,./?;:[]';
    if (document.getElementById('confusing').checked) characters +=     '\\\'\"\`{} <>|';
    characters = removeDuplicates(characters);

    if (characters.length === 0) {
        passwordList.innerHTML = '<li>Please select at least one character type.</li>';
        return;
    }

    for (let i = 0; i < count; i++) {
        let password = generateRandomString(length, characters);
    
        // Create elements
        let listItem = document.createElement('li');
        let codeElement = document.createElement('code');
        let verbatimElement = document.createElement('verbatim');
        let buttonElement = document.createElement('button');
    
        // Set content and attributes
        verbatimElement.textContent = password;
        buttonElement.textContent = 'Copy';
        buttonElement.addEventListener('click', function(){
            copyToClipboard(password, this);
        });
    
        // Append elements to the DOM
        codeElement.appendChild(verbatimElement);
        listItem.appendChild(codeElement);
        listItem.appendChild(buttonElement);
        passwordList.appendChild(listItem);
    }

    saveSettings();
}

function flashButton(button, newText, originalText) {
    button.textContent = newText;

    setTimeout(function() {
        button.textContent = originalText;
        button.style.backgroundColor = "";
        button.style.color = "";
    }, 1000); // Revert back after 1 second
}


function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Copied length: " + text.length);
            flashButton(button,  'Copied!', 'Copy');
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
        });
}




function saveSettings() {
    localStorage.setItem('settings', JSON.stringify({
        length: document.getElementById('lengthInput').value,
        count: document.getElementById('count').value,
        capitals: document.getElementById('capitals').checked,
        smallCase: document.getElementById('smallCase').checked,
        numbers: document.getElementById('numbers').checked,
        unreserved: document.getElementById('unreserved').checked,
        specialChars: document.getElementById('specialChars').checked,
        confusing: document.getElementById('confusing').checked
    }));
}

function loadSettings() {
    let settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        let lengthSlider = document.getElementById('lengthInput');
        lengthSlider.value = settings.length;
        document.getElementById('count').value = settings.count;
        document.getElementById('capitals').checked = settings.capitals;
        document.getElementById('smallCase').checked = settings.smallCase;
        document.getElementById('numbers').checked = settings.numbers;
        document.getElementById('unreserved').checked = settings.unreserved;
        document.getElementById('specialChars').checked = settings.specialChars;
        document.getElementById('confusing').checked = settings.confusing;
    }
}

document.getElementById('lengthInput').oninput = function() {
    saveSettings();
    generatePasswords();
};

document.getElementById('count').oninput = function() {
    document.getElementById('count').textContent = this.value;
    saveSettings();
    generatePasswords();
};

document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
    checkbox.onchange = function() {
        saveSettings();
        generatePasswords();
    };
});

// Load settings and initial password generation
window.onload = function() {
    loadSettings();
    generatePasswords();
};
