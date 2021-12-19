class MessageSystem {

    static #messageBox = document.getElementById("message-box");
    static #messageText = document.querySelector("#message-box #message");

    static DisplayMessage = function(message) {
        this.#messageText.innerHTML = message;
        this.#messageText.classList.remove("error-msg");
        this.#messageBox.classList.remove("hidden");
    }

    static EndMessage = function() {
        this.#messageBox.classList.add("hidden");
    }

    static PushError = async function(errorMsg) {
        SoundManager.PlaySound(SoundManager.ErrorSound);

        DebugError(errorMsg);
    
        const IsShown = !this.#messageBox.classList.contains("hidden");
        const PreviousMessage = this.#messageText.innerHTML;
    
        if(this.#messageText.classList.contains("error-msg"))
            return;
    
        this.#messageText.innerHTML = errorMsg;
        this.#messageText.classList.add("error-msg");
        this.#messageBox.classList.remove("hidden");

        for(let i = 0; i <= 6; i++) {
            await sleep(500);
    
            this.#messageText.classList.toggle("error-msg");
        }
    
        this.#messageText.classList.remove("error-msg");
        this.#messageText.innerHTML = PreviousMessage;
    
        if(!IsShown)
            this.EndMessage();
    }

}