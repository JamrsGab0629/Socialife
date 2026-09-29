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

    document.documentElement.setAttribute("data-theme", theme.toLowerCase());
};

export const toggleTheme = () => {
    const currentTheme = getSelectedTheme();
    const nextTheme = currentTheme === "LIGHT" ? "DARK" : "LIGHT";

    set(nextTheme);
    initTheme();
};