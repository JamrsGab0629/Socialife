export default function Auth(root) {
    root.innerHTML = `
        <div id="container">
            <aside id="auth-brand"></aside>
            <main id="auth-panel"></aside>
        </div>
    `;

    return {
        aside : document.getElementById('auth-brand'),
        main : document.getElementById('auth-panel')
    };
}