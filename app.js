function LogIn(user) {
    DebugPrint(`Logging in user: ${user}`);
    EndMessage();
    LoadUser(user);
}

function LogOut() {
    DebugPrint("Logging out user");
    UnloadUser();
    DisplayMessage("Please Scan Your ID To Log In");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function HandleBarcodeData(data) {

    if(data === "")
        return;

    DebugPrint(`Recieved Data: '${data}'`);

    // Check for valid user
    const user = LookupUserByID(data);
    
    if(user != null) {

        if(CurrentContext == null) {
            console.log("Logging In");
            LogIn(data);
        } else if(CurrentContext != null && CurrentContext.user.id != data) {
            console.log("Logging In!");
            LogIn(data);
        } else {
            LogOut();
        }

    } else {
        // Log it to inventory
        ToggleInventoryItem(data);
    }

    FocusInput(); // Alway refocus the input
} 


async function StartUpScanner() {
    LogOut();
    FocusInput();

    BindInputCallback(HandleBarcodeData);

    while(true) {

        await sleep(1000);

        // Focus the input
        FocusInput();

    }
}

function LoadData() {
    PullInventory();

    ReadJsonData("/server/userdata.json", (data) => {
        SaveUserData(data);
        StartUpScanner();
    });    
}

window.addEventListener("load", LoadData);