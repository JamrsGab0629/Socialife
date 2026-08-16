export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return password && password.length >= 8;
}