class Database {

    // Load the inventory data
    static CommitInventoryData = function(data) {
        console.log("Backend Call: Committing Inventory Data");
        google.script.run.withSuccessHandler(function() {
            console.log("Successfully Updated Inventory!");
        }).BACKENDCommitInventoryData(data);
    }

    // Pull the inventory data
    static PullInventoryData = function(callback) {
        console.log("Backend Call: Pulling Inventory Data");

        google.script.run.withSuccessHandler(function(result) {
            callback(result);
        }).BACKENDPullInventoryData();
    }

}