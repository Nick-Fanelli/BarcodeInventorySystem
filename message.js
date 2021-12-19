const MessageBox = document.getElementById("message-box");
const MessageText = document.querySelector("#message-box #message");

function EndMessage() {

    MessageBox.classList.add('hidden');

}

function DisplayMessage(message) {

    MessageText.innerHTML = message;
    MessageText.classList.remove("error-msg");
    MessageBox.classList.remove("hidden");

}

async function PushError(errorMsg) {
    SoundManager.PlaySound(SoundManager.ErrorSound);

    DebugError(errorMsg);

    const IsShown = !MessageBox.classList.contains("hidden");
    const PreviousMessage = MessageText.innerHTML;

    if(MessageText.classList.contains("error-msg"))
        return;

    MessageText.innerHTML = errorMsg;
    MessageText.classList.add("error-msg");
    MessageBox.classList.remove("hidden");

    for(let i = 0; i <= 6; i++) {
        await sleep(500);

        MessageText.classList.toggle("error-msg");
    }

    MessageText.classList.remove("error-msg");
    MessageText.innerHTML = PreviousMessage;

    if(!IsShown)
        MessageBox.classList.add("hidden");
}