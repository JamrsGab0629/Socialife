import style from './front.module.css';

export default function Front(root) {
    root.innerHTML = `
        <div id="container">
            <header class="${style['nav-wrap']}" id="navWrap"></header>
            <main id="top"></main>
            <footer class="${style['site-footer']}" id="footer"></footer>
        </div>
    `;

    return {
        header : document.getElementById('navWrap'),
        main: document.getElementById('top'),
        footer : document.getElementById('footer')
    }
}