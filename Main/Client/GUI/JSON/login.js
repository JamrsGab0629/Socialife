const usernameInputId = "username-input";
const passwordInputId = "password-input";
const loginInputId = "login-button";

function getInputValue(id){
    const val = document.getElementById(id);
    return val ? val.value : "";
}

function handleLoginButton(){
    const username = getInputValue(usernameInputId);
    const password = getInputValue(passwordInputId);

    console.group("Login input")
    console.log("Username: ", username);
    console.log("Password: ", password);
    console.groupEnd();
}

window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById(loginInputId);
    if (!button) {
        console.error(`misssing element #${loginInputId}`);
        return;
    }
    button.addEventListener("click", handleLoginButton);
});