export default function Front(root) {
    root.innerHTML = `
        <div id="container">
            <header class="nav-wrap" id="navWrap"></header>
            <main id="top"></main>
            <footer class="site-footer" id="footer"></footer>
        </div>
    `;

    return {
        header : document.getElementById('navWrap'),
        main: document.getElementById('top'),
        footer : document.getElementById('footer')
    }
}