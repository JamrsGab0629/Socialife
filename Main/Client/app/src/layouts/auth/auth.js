import style from "./auth.module.css"

export default function Auth(root) {
    root.innerHTML = `
        <div id="auth_shell" class="${style['auth-shell']}">
            <aside id="auth_brand" class="${style['auth-brand']}"></aside>
            <main id="auth_panel" class="${style['auth-panel']}"></aside>
        </div>
    `;

    return {
        aside : document.getElementById('auth_brand'),
        main : document.getElementById('auth_panel')
    };
}