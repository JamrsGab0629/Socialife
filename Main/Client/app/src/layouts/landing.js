export default function Landing(root) {
    root.innerHTML = `
        <div id="container">
            <header id="header"></header>
            <main id="main-content"></main>
            <footer id="footer"></footer>
        </div>
    `;

    return {
        header : document.getElementById('header'),
        main : document.getElementById('main-content'),
        footer : document.getElementById('footer')
    }
}