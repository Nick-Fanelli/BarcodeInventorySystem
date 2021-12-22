class InputManager {

    static EscapeKeyCallbacks = [];

    static #inputElement = document.querySelector("#hidden-input #input");
    static #enterCallback = null;

    static BindInputCallback = function(callback) {
        this.#enterCallback = callback;
    }

    static FocusInput = function() {
        this.#inputElement.focus();
    }

    static KeyPress = function(event) {
        if(event.code === "Enter") {
            if(this.#enterCallback != null) {
                this.#enterCallback(this.#inputElement.value);
                this.#inputElement.value = "";
            }
        }
    }
}

document.addEventListener("keydown", function(key) {
    if(key.key == "Escape") {
        for(let i in InputManager.EscapeKeyCallbacks) {
            InputManager.EscapeKeyCallbacks[i]();
        }
    }
});