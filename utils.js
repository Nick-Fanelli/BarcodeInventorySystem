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
