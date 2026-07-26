export default function Front(root) {
    root.innerHTML = `
        <div id="container">
            <header id="header"></header>
            <main id="main"></main>
            <footer id="footer"></footer>
        </div>
    `;

    return {
        header : document.getElementById('header'),
        main: document.getElementById('main'),
        footer : document.getElementById('footer')
    }
}