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

        FocusInput();

        return;

    }

    // Make sure someone's signed in
    if(CurrentContext == null) {
        PushError("You Must Sign In Before Updating The Inventory System!");
        FocusInput();
        return;
    }

    // Make sure the signed in user is allowed to modify the inventory
    if(CurrentContext.user.level <= 1) {
        // TODO: Push Error
        PushError("You do not have permission to update the inventory system!");
        FocusInput();
        return;
    }

    // Check for add or remove special barcode
    if(data === "#MODE_ADD#") {
        // Set Mode To Add
        DebugPrint("Setting Inventory Mode To: Add");
        SetInventoryMode(MODE_ADD);
        FocusInput();
        return;
    } else if(data === "#MODE_REMOVE#") {
        // Set Mode To Remove
        console.log("Setting Inventory Mode To: Remove");
        SetInventoryMode(MODE_REMOVE);
        FocusInput();
        return;
    }

    if(CurrentMode == MODE_ADD) {
        AddItemToInventory(data);
    } else {
        RemoveItemFromInventory(data);
    }

    FocusInput(); // Alway refocus the input
} 


async function StartUpScanner() {
    LogOut();
    LogIn("45563");
    FocusInput();

    BindInputCallback(HandleBarcodeData);

    while(true) {

        await sleep(1000);

        // Focus the input
        FocusInput();

    }
}

function LoadData() {
    ReadJsonData("server/userdata.json", (data) => {
        SaveUserData(data);
        StartUpScanner();
    });    
}

window.addEventListener("load", LoadData);