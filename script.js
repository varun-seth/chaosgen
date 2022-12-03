function generateRandomString() {
    var length = document.getElementById('lengthSlider').value;
    var result = '';
    var characters = '';
    if (document.getElementById('capitals').checked) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('smallCase').checked) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('numbers').checked) characters += '0123456789';

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    document.getElementById('randomString').textContent = result;
}

document.getElementById('lengthSlider').oninput = function() {
    document.getElementById('sliderValue').textContent = this.value;
    generateRandomString();
}

// Add event listeners to checkboxes
var checkboxes = document.querySelectorAll("input[type=checkbox]");
checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', generateRandomString);
});

// Generate initial string
window.onload = generateRandomString;
