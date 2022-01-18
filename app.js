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
    
            if(ContextManager.GetCurrentContext() == null || ContextManager.GetCurrentContext() != null && ContextManager.GetCurrentContext().user.id != data) {
                console.log("Logging In");
                Inventory.PullInventory();
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
            ContextManager.SetInventoryMode(MODE_ADD);
            InputManager.FocusInput();
            return;
        } else if(data === "#MODE_REMOVE#") {
            // Set Mode To Remove
            console.log("Setting Inventory Mode To: Remove");
            ContextManager.SetInventoryMode(MODE_REMOVE);
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
        this.LogIn("45563"); // TODO: REMOVE
        InputManager.FocusInput();

        // TODO: REMOVE
        Inventory.inventoryPool.push(new InventoryItem("123", "Name", "3-3", "SKU", "1"));
        Inventory.SyncInventory();
    
        InputManager.BindInputCallback(this.HandleBarcodeData);
    
        while(true) {
    
            await sleep(1000);
    
            // Focus the input
            if(this.ShouldFocusInput())
                InputManager.FocusInput();
        }
    }
    
    static SearchByName = function() {
        let searchName = prompt("Enter SKU", "Eg. REV-00-0000");

        if(searchName != null) {

            searchName = searchName.toLowerCase().trim();

            for(let i in Inventory.inventoryPool) {
                let inventoryItem = Inventory.inventoryPool[i];
                let itemName = inventoryItem.name.toLowerCase();

                if(itemName.contains(searchName)) {
                    // Display
                }
            }

        }

        InputManager.FocusInput();
    }

}

function LoadData() {

    ReadJsonData("https://nick-fanelli.github.io/BarcodeInventorySystem/serverData/userdata.json", (jsonData) => {
        Inventory.PullInventory();
        ContextManager.SaveUserData(jsonData);
        Application.StartUpScanner();
        // Application.HandleBarcodeData("1298798374534");
    });
}

window.addEventListener("load", LoadData);