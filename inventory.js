let inventoryCache = [];

function PushInventory() {
    console.log("Pushing Inventory");
}

function PullInventory() {
    ReadJsonData("server/inventory.json", (data) => {
        inventoryCache = data;
    });
}

function ToggleInventoryItem(barcode) {
    for(let i in inventoryCache[0]) {
        console.log(i);
    }
}