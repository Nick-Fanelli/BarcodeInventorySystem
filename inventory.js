class InventoryItem {

    constructor(barcode, name, sku) {
        this.barcode = barcode;
        this.name = name;
        this.sku = sku;
        this.quantity = 1;
    }

}

var InventoryPool = [];

class Inventory {

    static NewItemBox = document.querySelector("#new-item-container #new-item-box");
    static SkuInputField = document.querySelector("#new-item-container #new-item-box #part-sku");
    static PartNameField = document.querySelector("#new-item-container #new-item-box #part-name");
    static ExitButton = document.querySelector("#new-item-container #new-item-box #close-btn");
   
    static inventoryPool = [];

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

        const tableBody = document.querySelector("main table tbody");

        let html = "";
    
        for(let i in this.inventoryPool) {
            let inventoryItem = this.inventoryPool[i];
    
            html += `<tr>
            <td>N/A</td>
            <td>${inventoryItem.barcode}</td>
            <td>N/A</td>
            <td>1-3</td>
            <td>${inventoryItem.quantity}</td>
            </tr>`;
        }
    
        tableBody.innerHTML = html;
    }

    static RequestNewPartInformation = async function() {

        DebugPrint("Opening Request New Part Information Window");

        // Clear the fields
        this.SkuInputField.value = "";
        this.PartNameField.value = "";

        // Set the button callbacks
        this.ExitButton.addEventListener("click", () => {
            DebugPrint("Closing Request New Part Information Window (User Close)");
            this.NewItemBox.classList.add("hidden");
        });

        // Make it visible
        this.NewItemBox.classList.remove("hidden");
    }

    static AddItem = function(barcode) {
        let inventoryItem = this.GetItemByBarcode(barcode);

        if(inventoryItem == null) { // Item Doesn't Exist
            DebugPrint("Adding new item");
    
            // Play Needs Attention Sound
            SoundManager.PlaySound(SoundManager.NeedsAttentionSound);
    
            // Gather information about the item
            let partInfo = this.RequestNewPartInformation();
    
            this.inventoryPool.push(new InventoryItem(barcode, "N/A", "N/A"));
        } else {
            SoundManager.PlaySound(SoundManager.AddItemSound);
            DebugPrint(`Incrementing: ${barcode}`);
            inventoryItem.quantity++;
        }
    
        this.SyncInventory();
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