const nameInputId = "name-input";
const usernameInputId = "username-input";
const emailInputId = "email-input";
const passwordInputId = "password-input";
const confirmPasswordInputId = "confirm-password-input";
const signupInputId = "signup-button";

function getInputValue(id){
    const val = document.getElementById(id);
    return val ? val.value : "";
}

function handleSignupButton(){
    const name = getInputValue(nameInputId);
    const username = getInputValue(usernameInputId);
    const email = getInputValue(emailInputId);
    const password = getInputValue(passwordInputId);
    const confirmPassword = getInputValue(confirmPasswordInputId);

    console.group("Signup input")
    console.log("Name: ", name);
    console.log("Username: ", username);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Confirm Password: ", confirmPassword);
    console.groupEnd();
}

window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById(signupInputId);
    if (!button) {
        console.error(`misssing element #${signupInputId}`);
        return;
    }
    button.addEventListener("click", handleSignupButton);
});