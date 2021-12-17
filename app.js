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

    } else {
        // Log it to inventory

        if(CurrentContext == null) {
            PushError("You Must Sign In Before Updating The Inventory System!");
            return;
        }

        if(CurrentContext.user.id <= 1) {
            // TODO: Push Error
            console.log("You do not have permission to update the inventory system!");
            return;
        }

        const main = document.querySelector("main");
        main.innerHTML += `<h2>${data}</h2>`;

        // ToggleInventoryItem(data);
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
    PullInventory();

    ReadJsonData("server/userdata.json", (data) => {
        SaveUserData(data);
        StartUpScanner();
    });    
}

window.addEventListener("load", LoadData);