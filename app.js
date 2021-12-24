class Application {

    static LogIn = function(user) {
        DebugPrint(`Logging in user: ${user}`);
        MessageSystem.EndMessage();
        ContextManager.LoadUser(user);
    }

    static LogOut = function() {
        DebugPrint("Logging out user");
        ContextManager.UnloadUser();
        MessageSystem.DisplayMessage("Please Scan Your ID To Log In");
    }

    static HandleBarcodeData = function(data) {

        if(data === "")
            return;
    
        DebugPrint(`Received Data: '${data}'`);
    
        // Check for valid user
        const user = ContextManager.LookupUserByID(data);
        
        if(user != null) {
    
            if(ContextManager.GetCurrentContext() == null) {
                console.log("Logging In");
                Application.LogIn(data);
            } else if(ContextManager.GetCurrentContext() != null && ContextManager.GetCurrentContext().user.id != data) {
                console.log("Logging In!");
                Application.LogIn(data);
            } else {
                Application.LogOut();
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

    static ShouldFocusInput = function() {
        return Inventory.NewItemBox.classList.contains("hidden");
    }

    static StartUpScanner = async function() {
        this.LogOut();
        this.LogIn("45563");
        InputManager.FocusInput();
    
        InputManager.BindInputCallback(this.HandleBarcodeData);
    
        while(true) {
    
            await sleep(1000);
    
            // Focus the input
            if(this.ShouldFocusInput())
                InputManager.FocusInput();
        }
    }
    
    static SearchBySKU = function() {
        let sku = prompt("Enter SKU", "Eg. REV-00-0000");

        if(sku != null) {

            let item = Inventory.GetItemBySKU(sku);

            if(item == null) {
                MessageSystem.PushError(`Could not find item with SKU of: '${sku}'`);
            } else {
                // TODO: Scroll to the item
                console.log("Found Item!");
            }

        }

        InputManager.FocusInput();
    }

}

function LoadData() {

    ReadJsonData("https://nick-fanelli.github.io/BarcodeInventorySystem/serverData/userdata.json", (jsonData) => {
        ContextManager.SaveUserData(jsonData);
        Application.StartUpScanner();
        Application.HandleBarcodeData("1298798374534");
    });
}

window.addEventListener("load", LoadData);