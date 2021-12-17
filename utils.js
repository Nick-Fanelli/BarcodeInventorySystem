const ErrorSound = new Audio("sounds/error-sound.wav");

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

function PlayErrorSound() {
    ErrorSound.play();
}