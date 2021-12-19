function LogIn(user) {
    DebugPrint(`Logging in user: ${user}`);
    MessageSystem.EndMessage();
    ContextManager.LoadUser(user);
}

function LogOut() {
    DebugPrint("Logging out user");
    ContextManager.UnloadUser();
    MessageSystem.DisplayMessage("Please Scan Your ID To Log In");
}

function HandleBarcodeData(data) {

    if(data === "")
        return;

    DebugPrint(`Recieved Data: '${data}'`);

    // Check for valid user
    const user = ContextManager.LookupUserByID(data);
    
    if(user != null) {

        if(ContextManager.GetCurrentContext() == null) {
            console.log("Logging In");
            LogIn(data);
        } else if(ContextManager.GetCurrentContext() != null && ContextManager.GetCurrentContext().user.id != data) {
            console.log("Logging In!");
            LogIn(data);
        } else {
            LogOut();
        }

        InputManager.FocusInput();

        return;

    }

    // Make sure someone's signed in
    if(ContextManager.GetCurrentContext() == null) {
        MessageSystem.PushError("You Must Sign In Before Updating The Inventory System!");
        InputManager.FocusInput();
        return;
    }

    // Make sure the signed in user is allowed to modify the inventory
    if(ContextManager.GetCurrentContext().user.level <= 1) {
        // TODO: Push Error
        MessageSystem.PushError("You do not have permission to update the inventory system!");
        InputManager.FocusInput();
        return;
    }

    // Check for add or remove special barcode
    if(data === "#MODE_ADD#") {
        // Set Mode To Add
        DebugPrint("Setting Inventory Mode To: Add");
        SetInventoryMode(MODE_ADD);
        InputManager.FocusInput();
        return;
    } else if(data === "#MODE_REMOVE#") {
        // Set Mode To Remove
        console.log("Setting Inventory Mode To: Remove");
        SetInventoryMode(MODE_REMOVE);
        InputManager.FocusInput();
        return;
    }

    if(ContextManager.GetCurrentMode() == MODE_ADD) {
        Inventory.AddItem(data);
    } else {
        Inventory.RemoveItem(data);
    }

    InputManager.FocusInput(); // Alway refocus the input
} 


async function StartUpScanner() {
    LogOut();
    LogIn("45563");
    InputManager.FocusInput();

    InputManager.BindInputCallback(HandleBarcodeData);

    while(true) {

        await sleep(1000);

        // Focus the input
        InputManager.FocusInput();

    }
}

function LoadData() {
    ReadJsonData("server/userdata.json", (data) => {
        ContextManager.SaveUserData(data);
        StartUpScanner();
    });    
}

window.addEventListener("load", LoadData);