const Input = document.querySelector("#hidden-input #input");

let enterCallback = null;

function BindInputCallback(callback) {
    enterCallback = callback;
}

function FocusInput() {
    Input.focus();
}

function KeyPress(event) {
    if(event.code === "Enter") {
        if(enterCallback != null) {
            enterCallback(Input.value);
            Input.value = "";
        }
    }
}