let zState = {
    email: ""
};

export const setEmail = (email) => {
    signupState.email = email;
};

export const getEmail = () => {
    return signupState.email;
};