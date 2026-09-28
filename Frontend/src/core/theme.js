const DEFAULT_THEME = "LIGHT";

const get = () => {
    try {
        return localStorage?.getItem("THEME") || null;
    } catch {
        return null;
    }
};

const set = (theme) => {
    try {
        localStorage?.setItem("THEME", theme);
    } catch (e) {
        console.warn("Unable to save theme to localStorage", e);
    }
};

export const getSelectedTheme = () => {
    return get() ?? DEFAULT_THEME;
};

export const initTheme = () => {
    const theme = getSelectedTheme();

    if (!get()) {
        set(DEFAULT_THEME);
    }

    if (theme === "LIGHT") {
        console.log("THEME TO LIGHT")
        // block of code to change the root value
    } else if (theme === "DARK") {
        console.log("THEME TO DARK")
        // block of code to change the root value
    }
};

export const toggleTheme = () => {
    const currentTheme = getSelectedTheme();
    const nextTheme = currentTheme === "LIGHT" ? "DARK" : "LIGHT";

    set(nextTheme);
    initTheme();
};