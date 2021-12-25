class InventoryItem {

    constructor(barcode, name, sku) {
        this.barcode = barcode;
        this.name = name;
        this.sku = sku;
        this.location = "1-1";
        this.quantity = 1;
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

    static DescriptionPartName = document.querySelector("#new-item-container #new-item-box #part-description #part-name-text");
    static DescriptionBarcode = document.querySelector("#new-item-container #new-item-box #part-description #barcode-text");
    static DescriptionSKU = document.querySelector("#new-item-container #new-item-box #part-description #sku-text");
    static DescriptionTextDescription = document.querySelector("#new-item-container #new-item-box #part-description #description-text");
   
    static inventoryPool = [];

    static isClosePartWindowDisplayed = false;
    static funcCallback = null;

    static GetItemBySKU = function(sku) {
        for(let i in this.inventoryPool) {
            if(this.inventoryPool[i].sku === sku) {
                return this.inventoryPool[i];
            }
        }

        return null;
    }

    static GetItemByBarcode = function(barcode) {
        for(let i in this.inventoryPool) {
            if(this.inventoryPool[i].barcode === barcode) {
                return this.inventoryPool[i];
            }
        }

        return null;
    }

    static SyncInventory = function() {
        // TODO: Push Inventory Pool
        if(RELEASE_MODE)
            Database.CommitInventoryData(this.inventoryPool);

        const tableBody = document.querySelector("main table tbody");

        let html = "";
    
        for(let i in this.inventoryPool) {
            let inventoryItem = this.inventoryPool[i];
    
            html += `<tr>
            <td>${inventoryItem.name}</td>
            <td>${inventoryItem.barcode}</td>
            <td>${inventoryItem.sku}</td>
            <td>${inventoryItem.location}</td>
            <td>${inventoryItem.quantity}</td>
            </tr>`;
        }
    
        tableBody.innerHTML = html;
    }

    static PullInventory = function() {
        if(RELEASE_MODE) {

            let inventoryData = Database.PullInventoryData();

            // TODO: Set the inventory data to the data pool

        }
    }

    static ValidateNewPartInfoSubmitButton = function() {
        this.SubmitButton.disabled = !(this.PartNameField.value.trim() != "" && this.SkuInputField.value.trim() != "");
    }

    static OnSKUFieldChange = function(currentValue) {
        if(!this.isClosePartWindowDisplayed)
            return;

        if(currentValue.trim() == "") {
            this.PartSKULabel.classList.add("invalid");
        } else {
            this.PartSKULabel.classList.remove("invalid");
        }

        this.DescriptionSKU.innerHTML = currentValue;

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

        this.DescriptionPartName.innerHTML = currentValue;

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

        this.funcCallback(new InventoryItem(this.DescriptionBarcode.innerHTML, this.PartNameField.value, this.SkuInputField.value));
        this.CloseNewPartInformationWindow();
    }

    static RequestNewPartInformation = function(barcode, funcCallback) {

        DebugPrint(`Opening Request New Part Information Window For Item With Barcode: '${barcode}'`);

        // Clear the fields
        this.SkuInputField.value = "";
        this.PartNameField.value = "";
        this.PartSKULabel.classList.add("invalid");
        this.PartNameLabel.classList.add("invalid");

        // Set the barcode field
        this.DescriptionBarcode.innerHTML = barcode;

        // Clear the description fields
        this.DescriptionPartName.innerHTML = "";
        this.DescriptionSKU.innerHTML = "";
        this.DescriptionTextDescription.innerHTML = "";

        // Bind callback
        this.funcCallback = funcCallback;

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
}

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