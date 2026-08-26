let zState = {
    email: "",
};

export const setEmail = (email) => {
    zState.email = email;
};

export const getEmail = () => {
    return zState.email;
};