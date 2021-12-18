const ErrorSound = new Audio("sounds/error-sound.wav");
const NeedsAttentionSound = new Audio("sounds/needs-attention-beep.mp3");
const AddItemSound = new Audio("sounds/add-item-beep.mp3");
const RemoveItemSound = new Audio("sounds/remove-item-beep.mp3");

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

function PlaySound(sound) { 
    sound.currentTime = 0;
    sound.play(); 
}