function StartUpScanner() {
    LoadUser("45563");
}

function LoadData() {
    ReadJsonData("/server/userdata.json", (data) => {
        SaveUserData(data);
        StartUpScanner();
    });    
}

window.addEventListener("load", LoadData);