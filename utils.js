function DebugPrint(message) {
    console.log(message);
}

function DebugError(errorMsg) {
    console.error(errorMsg);
}

function ReadJsonData(filepath, functionPtr) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open('GET', filepath, true);
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == "200") {
            functionPtr(JSON.parse(request.responseText));
        }
    };

    request.send(null);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SoundManager {

    static ErrorSound = new Audio("https://nick-fanelli.github.io/BarcodeInventorySystem/sounds/error-sound.wav");
    static NeedsAttentionSound = new Audio("https://nick-fanelli.github.io/BarcodeInventorySystem/sounds/needs-attention-beep.mp3");
    static AddItemSound = new Audio("https://nick-fanelli.github.io/BarcodeInventorySystem/sounds/add-item-beep.mp3");
    static RemoveItemSound = new Audio("https://nick-fanelli.github.io/BarcodeInventorySystem/sounds/remove-item-beep.mp3");

    static PlaySound = function(sound) {
        sound.currentTime = 0;
        sound.play(); 
    }

}