// Constant Elements
const UserNameElement = document.getElementById("user-name");
const Main = document.querySelector("main");

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
}

function ContextUpdateCallback() {

    ClearLogInData();
        
    // Log In User
    if(CurrentContext == null)
        return;

    Main.classList.remove("hidden");

    if(CurrentContext.user.level >= 3) {
        let level3Items = document.querySelectorAll("main .level-3");

        for(let i in level3Items) {
            if(level3Items[i].classList != undefined)
                level3Items[i].classList.remove("hidden");
        }

        UpdateUserList();
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