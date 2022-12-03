function generateRandomString() {
    var length = document.getElementById('lengthSlider').value;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    document.getElementById('randomString').textContent = result;
}

document.getElementById('lengthSlider').oninput = function() {
    document.getElementById('sliderValue').textContent = this.value;
}
