class InventoryItem {

    constructor(barcode, name, sku) {
        this.barcode = barcode;
        this.name = name;
        this.sku = sku;
        this.quantity = 1;
    }

}

var InventoryPool = [];

function GetInventoryItemByBarcode(barcode) {
    for(let i in InventoryPool) {
        if(InventoryPool[i].barcode === barcode) {
            return InventoryPool[i];
        }
    }

    return null;
}

function SyncInventoryHTML() {
    const tableBody = document.querySelector("main table tbody");

    let html = "";

    for(let i in InventoryPool) {
        let inventoryItem = InventoryPool[i];

        html += `<tr>
        <td>TBD</td>
        <td>${inventoryItem.barcode}</td>
        <td>TBD</td>
        <td>1-3</td>
        <td>${inventoryItem.quantity}</td>
        </tr>`;
    }

    tableBody.innerHTML = html;
}

function AddItemToInventory(barcode) {

    let inventoryItem = GetInventoryItemByBarcode(barcode);

    if(inventoryItem == null) { // Item Doesn't Exist
        DebugPrint("Adding new item");

        // Play Needs Attention Sound
        SoundManager.PlaySound(SoundManager.NeedsAttentionSound);

        // Gather information about the item

        InventoryPool.push(new InventoryItem(barcode, "N/A", "N/A"));
    } else {
        SoundManager.PlaySound(SoundManager.AddItemSound);
        DebugPrint(`Incrementing: ${barcode}`);
        inventoryItem.quantity++;
    }

    SyncInventoryHTML();
}

function RemoveItemFromInventory(barcode) {

    let inventoryItem = GetInventoryItemByBarcode(barcode);

    if(inventoryItem == null) {
        MessageSystem.PushError("This item doesn't exist in the system! Maybe you meant to add it?");
    } else {
        if(inventoryItem.quantity <= 0) {
            MessageSystem.PushError("Uh Oh! You ran out of these to remove! You broke something for real!!!")
        } else {
            // Decrement the item
            SoundManager.PlaySound(SoundManager.RemoveItemSound);
            inventoryItem.quantity--;
            SyncInventoryHTML();
        }
    }

}