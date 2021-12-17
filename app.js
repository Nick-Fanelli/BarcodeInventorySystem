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

        // Make sure someone's signed in
        if(CurrentContext == null) {
            PushError("You Must Sign In Before Updating The Inventory System!");
            return;
        }

        // Make sure the signed in user is allowed to modify the inventory
        if(CurrentContext.user.level <= 1) {
            // TODO: Push Error
            console.log("You do not have permission to update the inventory system!");
            return;
        }

        const tableBody = document.querySelector("main table tbody");
        tableBody.innerHTML += `<tr>
            <td>${data}</td>
            <td>${data}</td>
            <td>${data}</td>
            <td>1-3</td>
            <td>1</td>
        </tr>`;

        // ToggleInventoryItem(data);
    }

    FocusInput(); // Alway refocus the input
} 


async function StartUpScanner() {
    LogOut();
    // LogIn("45563");
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