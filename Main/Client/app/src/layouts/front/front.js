<<<<<<< HEAD:Main/Client/app/src/layouts/front/front.js
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
=======
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
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd:Main/Client/app/src/layouts/front.js
}