const MessageBox = document.getElementById("message-box");
const MessageText = document.querySelector("#message-box #message");

function EndMessage() {

    MessageBox.classList.add('hidden');

}

function DisplayMessage(message) {

    MessageText.innerHTML = message;
    MessageBox.classList.remove("hidden");

}