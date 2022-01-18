class InventoryItem {

    constructor(barcode, name, location, sku, quantity) {
        this.barcode = barcode;
        this.name = name;
        this.sku = sku;
        this.location = location;
        this.quantity = quantity;
    }

}

class Inventory {

    static NewItemBox = document.querySelector("#new-item-container #new-item-box");
    static SkuInputField = document.querySelector("#new-item-container #new-item-box #part-sku");
    static PartNameField = document.querySelector("#new-item-container #new-item-box #part-name");
    static PartNameLabel = document.querySelector("#new-item-container #new-item-box #part-name-label");
    static PartSKULabel = document.querySelector("#new-item-container #new-item-box #part-sku-label");
    static ExitButton = document.querySelector("#new-item-container #new-item-box #close-btn");
    static SubmitButton = document.querySelector("#new-item-container #new-item-box #save-btn");

    static ShelfButtons = null;

    static inventoryPool = [];

    static isClosePartWindowDisplayed = false;
    static funcCallback = null;

    static #currentBarcode = null;

    static GetItemBySKU = function(sku) {
        for(let i in this.inventoryPool) {
            if(this.inventoryPool[i].sku === sku) {
                return this.inventoryPool[i];
            }
        }

        return null;
    }

    static GetItemByBarcode = function(barcode) {

        let returnItem = null;

        this.inventoryPool.forEach((item) => {
            if(item.barcode.toString().trim() == barcode.toString().trim()) {
                returnItem = item;
                return;
            }
        });

        return returnItem;
    }

    static SyncInventory = function() {
        if(RELEASE_MODE)
            Database.CommitInventoryData(this.inventoryPool);

        const tableBody = document.querySelector("main table tbody");

        let html = "";

        if(ContextManager.GetCurrentContext() == null || ContextManager.GetCurrentContext().user == null)
            return;
    
        let permissionLevel = ContextManager.GetCurrentContext().user.level;

        for(let i in this.inventoryPool) {
            let inventoryItem = this.inventoryPool[i];

            html += `<tr>
            <td ${permissionLevel >= 3 ? `class="item-name" onclick="Inventory.RenameItem(this);"` : ""}>${inventoryItem.name}</td>
            <td>${inventoryItem.barcode}</td>
            <td ${permissionLevel >= 3 ? `class="item-name" onclick="Inventory.RefactorSKU(this);"` : ""}>${inventoryItem.sku}</td>
            <td ${permissionLevel >= 3 ? `class="item-name" onclick="Inventory.RefactorLocation(this);"` : ""}>${inventoryItem.location}</td>
            <td>${inventoryItem.quantity} ${permissionLevel >= 3 ? `<i class="fa fa-trash delete-btn" onclick="Inventory.DeleteItem(this.parentElement.parentElement);"></i>` : ""}</td>
            </tr>`;
           
        }
    
        tableBody.innerHTML = html;
    }

    static PullInventory = function() {
        DebugPrint("Status: Pulling Inventory");

        if(RELEASE_MODE) {
            this.inventoryPool = [];

            Database.PullInventoryData((jsonData) => {
                jsonData.forEach((obj) => {
                    this.inventoryPool.push(new InventoryItem(obj["barcode"], obj["name"], obj["location"], obj["SKU"], obj["quantity"]));
                });
    
                this.SyncInventory(); 
            });
        }
    }

    static RenameItem = function(itemElement) {
        let parentElement = itemElement.parentElement;
        let itemBarcode = parentElement.children[1].innerHTML;

        if(itemBarcode == null || itemBarcode == undefined) {
            PushError("Internal Location Error!");
            return;
        }

        this.inventoryPool.forEach((item) => {
            if(item.barcode === itemBarcode) {
                let newValue = prompt("Please Enter a New Item Name");
                if(newValue == null)
                    return;
                item.name = newValue;
                return;
            }
        });

        DebugPrint("Successfully Renamed Item In Inventory Pool");
        this.SyncInventory();
    }

    static RefactorSKU = function(itemElement) {
        let parentElement = itemElement.parentElement;
        let itemBarcode = parentElement.children[1].innerHTML;

        if(itemBarcode == null || itemBarcode == undefined) {
            PushError("Internal Location Error!");
            return;
        }

        this.inventoryPool.forEach((item) => {
            if(item.barcode === itemBarcode) {
                let newValue = prompt("Please Enter a New Item Name");
                if(newValue == null)
                    return;
                item.sku = newValue;
                return;
            }
        });

        DebugPrint("Successfully Renamed Item In Inventory Pool");
        this.SyncInventory();
    }

    static RefactorLocation = function(element) {
        let parentElement = element.parentElement;
        let itemBarcode = parentElement.children[1].innerHTML;

        if(itemBarcode == null || itemBarcode == undefined) {
            PushError("Internal Location Error!");
            return;
        }

        this.inventoryPool.forEach((item) => {
            if(item.barcode === itemBarcode) {
                let newValue = prompt("Please Enter a New Item Name! Format: SHELF_NUMBER(1-3)-SHELF_LEVEL(1-4)");
                if(newValue == null)
                    return;

                const regex = /[1-3]-[1-4]/g;
                const match = newValue.match(regex);

                if(match == null) {
                    MessageSystem.PushError("Invalid Shelf Location. Example Location: 2-3. (2 = shelf number), (3 = shelf level)");
                    return;
                }

                item.location = newValue;
                DebugPrint("Successfully Relocated Item In Inventory Pool");
                return;
            }
        });

        this.SyncInventory();
    }

    static DeleteItem = function(element) {
        let itemBarcode = element.children[1].innerHTML;

        this.inventoryPool.forEach((item) => {
            if(item.barcode === itemBarcode) {
                let result = confirm(`Are you sure you want to remove: '${item.name}'`);
                if(!result) {
                    return;
                }

                // Remove From Inventory Pool
                let index = this.inventoryPool.indexOf(item);
                if(index > -1) {
                    this.inventoryPool.splice(index, 1);
                }
                
                DebugPrint("Successfully Removed Item In Inventory Pool");
                return;
            }
        });

        this.SyncInventory();
    }

    static ValidateNewPartInfoSubmitButton = function() {

        let isLocationSelected = false;

        this.ShelfButtons.forEach((element) => {
            if(element.classList.contains("selected")) {
                isLocationSelected = true;
                return;
            }
        });

        this.SubmitButton.disabled = !(this.PartNameField.value.trim() != "" && this.SkuInputField.value.trim() != "" && isLocationSelected);
    }

    static OnSKUFieldChange = function(currentValue) {
        if(!this.isClosePartWindowDisplayed)
            return;

        if(currentValue.trim() == "") {
            this.PartSKULabel.classList.add("invalid");
        } else {
            this.PartSKULabel.classList.remove("invalid");
        }

        // TODO: Identify as REV

        this.ValidateNewPartInfoSubmitButton();
    }

    static OnPartNameFieldChange = function(currentValue) {
        if(!this.isClosePartWindowDisplayed)
            return;

        if(currentValue.trim() == "") {
            this.PartNameLabel.classList.add("invalid");
        } else {
            this.PartNameLabel.classList.remove("invalid");
        }

        this.ValidateNewPartInfoSubmitButton();
    }

    static CloseNewPartInformationWindow = function() {

        if(!this.isClosePartWindowDisplayed)
            return;

        DebugPrint("Closing Request New Part Information Window (User Close)");
        this.NewItemBox.classList.add("hidden");
        this.isClosePartWindowDisplayed = false;

        this.funcCallback = null;
    }

    static SubmitPartInformation = function() {
        if(!this.isClosePartWindowDisplayed)
            return;

        console.log("Submitting Part Information");

        let shelfNumber, shelfLevel;

        this.ShelfButtons.forEach((element) => {
            if(element.classList.contains("selected")) {

                // Determine Shelf Level
                if(element.classList.contains("shelf-level-1"))
                    shelfLevel = 1;
                else if(element.classList.contains("shelf-level-2"))
                    shelfLevel = 2;
                else if(element.classList.contains("shelf-level-3"))
                    shelfLevel = 3;
                else
                    shelfLevel = 4;
                
                let id = element.parentElement.id;

                if(id == "shelf-1")
                    shelfNumber = 1;
                else if(id == "shelf-2")
                    shelfNumber = 2;
                else   
                    shelfNumber = 3;

                return;
            }
        });

        this.funcCallback(new InventoryItem(this.#currentBarcode, this.PartNameField.value, shelfNumber + "-" + shelfLevel, this.SkuInputField.value, 1));
        this.CloseNewPartInformationWindow();
    }

    static RequestNewPartInformation = function(barcode, funcCallback) {

        DebugPrint(`Opening Request New Part Information Window For Item With Barcode: '${barcode}'`);

        // Clear the fields
        this.SkuInputField.value = "";
        this.PartNameField.value = "";
        this.PartSKULabel.classList.add("invalid");
        this.PartNameLabel.classList.add("invalid");

        // Bind callback
        this.funcCallback = funcCallback;

        this.#currentBarcode = barcode;

        // Set the button callbacks
        this.ExitButton.addEventListener("click", () => {
            this.CloseNewPartInformationWindow();
        });

        // Make it visible
        this.NewItemBox.classList.remove("hidden");

        this.isClosePartWindowDisplayed = true;
   }

    static AddItem = function(barcode) {
        let inventoryItem = this.GetItemByBarcode(barcode);

        console.log(`Inventory Item: ${inventoryItem}`);

        if(inventoryItem == null) { // Item Doesn't Exist
            DebugPrint("Adding new item");
    
            // Play Needs Attention Sound
            SoundManager.PlaySound(SoundManager.NeedsAttentionSound);
    
            // Gather information about the item
            this.RequestNewPartInformation(barcode, function(partInfo) {

                if(partInfo == null)
                    return;

                this.inventoryPool.push(partInfo);

                this.SyncInventory();
            });
    
        } else {
            SoundManager.PlaySound(SoundManager.AddItemSound);
            DebugPrint(`Incrementing: ${barcode}`);
            inventoryItem.quantity++;
            this.SyncInventory();
        }
    }

    static RemoveItem = function(barcode) {
        let inventoryItem = this.GetItemByBarcode(barcode);

        if(inventoryItem == null) {
            MessageSystem.PushError("This item doesn't exist in the system! Maybe you meant to add it?");
        } else {
            if(inventoryItem.quantity <= 0) {
                MessageSystem.PushError("Uh Oh! You ran out of these to remove! You broke something for real!!!")
            } else {
                // Decrement the item
                SoundManager.PlaySound(SoundManager.RemoveItemSound);
                inventoryItem.quantity--;
                this.SyncInventory();
            }
        }
    
    }

    static BindShelfCallbacks = function() {
        this.ShelfButtons = document.querySelectorAll("#location-selection div.shelf-level");

        this.ShelfButtons.forEach(element => {
            element.addEventListener("click", (event) => {
                let button = event.target;
                let isSelected = button.classList.contains("selected");

                this.ShelfButtons.forEach((element) => {
                    element.classList.remove("selected");
                });

                if(!isSelected)
                    button.classList.add("selected");
                else
                    button.classList.remove("selected");

                this.ValidateNewPartInfoSubmitButton();
            });
        });
    }
}

Inventory.BindShelfCallbacks();

InputManager.EscapeKeyCallbacks.push(function() {
    Inventory.CloseNewPartInformationWindow();
});

// Bind the Request New Part Fields callback
Inventory.SkuInputField.addEventListener('input', function() {
    Inventory.OnSKUFieldChange(Inventory.SkuInputField.value);
});

Inventory.PartNameField.addEventListener('input', function() {
    Inventory.OnPartNameFieldChange(Inventory.PartNameField.value);
});

Inventory.SubmitButton.addEventListener("click", function() { Inventory.SubmitPartInformation(); });