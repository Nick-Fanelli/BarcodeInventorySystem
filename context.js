// Constant
const MODE_ADD = "MODE_ADD";
const MODE_REMOVE = "MODE_REMOVE";

// Constant Elements
const UserNameElement = document.getElementById("user-name");
const Main = document.querySelector("main");
const Header = document.querySelector("header");
const InventoryModeStatusH2 = document.querySelector("header #inventory-mode-status");

var CurrentMode = MODE_REMOVE;

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

let CurrentContext = null;
let UserPool = [];

function SetInventoryMode(mode) {
    if(mode !== MODE_ADD && mode !== MODE_REMOVE) {
        console.log(`Can not set the inventory mode to '${mode}'!`);
        return;
    }

    CurrentMode = mode;

    // Update Inventory
    if(CurrentMode == MODE_ADD) {
        Header.classList.remove("mode-remove");
        Header.classList.add("mode-add");
        InventoryModeStatusH2.innerHTML = "ADD MODE";
    } else {
        Header.classList.remove("mode-add");
        Header.classList.add("mode-remove");
        InventoryModeStatusH2.innerHTML = "REMOVE MODE";
    }
}

function LookupUserByID(id) {
    for(let i in UserPool) {
        let user = UserPool[i];
        
        if(user.id === id) {
            return user;
        }
    }

    return null;
}

function SaveUserData(userData) {

    for(let user in userData) {
        let userID = userData[user][0];
        let userLevel = userData[user][1];

        // Test Code
        // console.log(`User -> '${user}', ${userID}, ${userLevel}`);

        UserPool.push(new User(user, userID, userLevel));
    }

}

function UpdateUserList() {

    const UserList = document.querySelector("main #user-list ul");

    UserList.innerHTML = "<li id='header'>User List</li>";

    for(let i in UserPool) {
        let user = UserPool[i];

        UserList.innerHTML += `<li class="${(user.level == 3) ? 'l3' : (user.level == 2) ? 'l2' : ''}">${user.name}</li>`;
    }

}

function ClearLogInData() {
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

function OnLogin() {
    Main.classList.remove("hidden");

    if(CurrentContext.user.level >= 3) {
        let level3Items = document.querySelectorAll("main .level-3");

        for(let i in level3Items) {
            if(level3Items[i].classList != undefined)
                level3Items[i].classList.remove("hidden");
        }

        UpdateUserList();
    }

    // Set the inventory mode
    // TODO: Set to mode remove
    SetInventoryMode(MODE_REMOVE);
}

function ContextUpdateCallback() {
    ClearLogInData();

    if(CurrentContext != null) {
        OnLogin();
    }
}

function SetContext(context) {
    if(context == null) {
        CurrentContext = null;
        UserNameElement.innerHTML = "";

        ContextUpdateCallback();

        return;
    }

    CurrentContext = context;

    // Update user
    UserNameElement.innerHTML = context.user.name;

    DebugPrint(`Setting Context To User Name: ${context.user.name}`);

    ContextUpdateCallback();
}

function LoadUser(id) {
    const user = LookupUserByID(id);

    if(user == null) {
        console.error(`Unknown User: ${id}`);
    } else {
        DebugPrint(`Found user ${id}`);
    }

    SetContext(new Context(user));
}

function UnloadUser() {
    SetContext(null);
}