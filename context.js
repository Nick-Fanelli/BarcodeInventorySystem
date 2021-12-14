// Constant Elements
const UserNameElement = document.getElementById("user-name");

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

function SetContext(context) {
    CurrentContext = context;

    // Update user
    UserNameElement.innerHTML = context.user.name;
}

function LoadUser(id) {
    const user = LookupUserByID(id);

    if(user == null) {
        console.error(`Unknown User: ${id}`);
    }

    SetContext(new Context(user));
}