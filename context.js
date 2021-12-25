// Constant
const MODE_ADD = "MODE_ADD";
const MODE_REMOVE = "MODE_REMOVE";

// Constant Elements
const UserNameElement = document.getElementById("user-name");
const Main = document.querySelector("main");
const Header = document.querySelector("header");
const InventoryModeStatusH2 = document.querySelector("header #inventory-mode-status");

class User {

    constructor(name, id, level) {
        this.name = name;
        this.id = id;
        this.level = level;
    }

}

class Context {

    constructor(user) {
        this.user = user;
    }

}

class ContextManager {

    static currentContext = null;
    static userPool = [];

    static #currentMode = MODE_REMOVE;

    static SetInventoryMode = function(mode) {
        if(mode !== MODE_ADD && mode !== MODE_REMOVE) {
            console.log(`Can not set the inventory mode to '${mode}'!`);
            return;
        }
    
        this.#currentMode = mode;
    
        // Update Inventory
        if(this.#currentMode == MODE_ADD) {
            Header.classList.remove("mode-remove");
            Header.classList.add("mode-add");
            InventoryModeStatusH2.innerHTML = "ADD MODE";
        } else {
            Header.classList.remove("mode-add");
            Header.classList.add("mode-remove");
            InventoryModeStatusH2.innerHTML = "REMOVE MODE";
        }
    }

    static GetCurrentMode = function() { return this.#currentMode; }
    static GetCurrentContext = function() { return this.currentContext; }

    static ToggleInventoryMode = function() {
        this.SetInventoryMode(this.GetCurrentMode() == MODE_ADD ? MODE_REMOVE : MODE_ADD);
    }

    static LookupUserByID(id) {
        for(let i in this.userPool) {
            let user = this.userPool[i];
            
            if(user.id === id) {
                return user;
            }
        }
    
        return null;
    }

    static SaveUserData = function(userData) {
        for(let user in userData) {
            let userID = userData[user][0];
            let userLevel = userData[user][1];
    
            // Test Code
            // console.log(`User -> '${user}', ${userID}, ${userLevel}`);
    
            this.userPool.push(new User(user, userID, userLevel));
        }
    
    }

    static UpdateUserList = function() {
        const UserList = document.querySelector("main #user-list ul");

        UserList.innerHTML = "<li id='header'>User List</li>";
    
        for(let i in this.userPool) {
            let user = this.userPool[i];
    
            UserList.innerHTML += `<li class="${(user.level == 3) ? 'l3' : (user.level == 2) ? 'l2' : ''}">${user.name}</li>`;
        }
    }

    static ClearLogInData = function() {
        Main.classList.add("hidden");

        // Hide All Level 2 and 3
        let levelItems = document.querySelectorAll("main .level-3,.level-2");
    
        for(let i in levelItems) {
            if(levelItems[i].classList != undefined) {
                levelItems[i].classList.add("hidden");
            }
        }
    
        // Clear the inventory mode
        Header.classList.remove("mode-add");
        Header.classList.remove("mode-remove");
        InventoryModeStatusH2.innerHTML = "";
    }

    static OnLogin = function() {
        Main.classList.remove("hidden");

        if(this.currentContext.user.level >= 3) {
            let level3Items = document.querySelectorAll("main .level-3");
    
            for(let i in level3Items) {
                if(level3Items[i].classList != undefined)
                    level3Items[i].classList.remove("hidden");
            }
    
            this.UpdateUserList();
        }
    
        // Set the inventory mode 
        this.SetInventoryMode(MODE_ADD); // TODO: Set to remove mode

        Inventory.SyncInventory();
    }

    static ContextUpdateCallback = function() {
        this.ClearLogInData();

        if(this.currentContext != null) {
            this.OnLogin();
        }
    }
    
    static SetContext = function(context) {
        if(context == null) {
            this.currentContext = null;
            UserNameElement.innerHTML = "";
    
            this.ContextUpdateCallback();
    
            return;
        }
    
        this.currentContext = context;
    
        // Update user
        UserNameElement.innerHTML = context.user.name;
    
        DebugPrint(`Setting Context To User Name: ${context.user.name}`);
    
        this.ContextUpdateCallback();
    }

    static LoadUser = function(id) {
        const user = this.LookupUserByID(id);

        if(user == null) {
            console.error(`Unknown User: ${id}`);
        } else {
            DebugPrint(`Found user ${id}`);
        }
    
        this.SetContext(new Context(user));
    }
 
    static UnloadUser = function() {
        this.SetContext(null);
    }
    
}