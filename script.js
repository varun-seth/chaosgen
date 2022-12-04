function generateRandomString(length, characters) {
    var result = '';
    var charactersLength = characters.length;
    var maxValidRange = Math.floor(0xFFFFFFFF / charactersLength) * charactersLength;
    var randomArray = new Uint32Array(1); // Single-element array for random values

    for (var i = 0; i < length; i++) {
        var randomValue;
        do {
            window.crypto.getRandomValues(randomArray);
            randomValue = randomArray[0];
        } while (randomValue >= maxValidRange);

        result += characters.charAt(randomValue % charactersLength);
    }
    return result;
}


function generatePasswords() {
    var length = document.getElementById('lengthSlider').value;
    var count = document.getElementById('count').value;
    var characters = '';
    var passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';

    if (document.getElementById('capitals').checked) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('smallCase').checked) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('numbers').checked) characters += '0123456789';

    if (characters.length === 0) {
        passwordList.innerHTML = '<li>Please select at least one character type.</li>';
        return;
    }

    for (var i = 0; i < count; i++) {
        var password = generateRandomString(length, characters);
        passwordList.innerHTML += '<li>' + password + '</li>';
    }

    saveSettings();
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify({
        length: document.getElementById('lengthSlider').value,
        count: document.getElementById('count').value,
        capitals: document.getElementById('capitals').checked,
        smallCase: document.getElementById('smallCase').checked,
        numbers: document.getElementById('numbers').checked
    }));
}

function loadSettings() {
    var settings = JSON.parse(localStorage.getItem('settings'));
    if (settings) {
        document.getElementById('lengthSlider').value = settings.length;
        document.getElementById('count').value = settings.count;
        document.getElementById('capitals').checked = settings.capitals;
        document.getElementById('smallCase').checked = settings.smallCase;
        document.getElementById('numbers').checked = settings.numbers;
    }
}

document.getElementById('lengthSlider').oninput = function() {
    document.getElementById('sliderValue').textContent = this.value;
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
