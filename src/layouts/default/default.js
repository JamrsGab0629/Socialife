import style from './default.module.css'

export default function Layout(root) {
    root.innerHTML = `
            <div id="container">
                <navigation id="navigation" class="${style['navigation']}"></navigation>
                <main id="main_content" class="${style['main-content']}"></main>
                <footer id="footer" class="${style['footer']}"></footer>
            </div>
      `;

    return {
        navigation: document.getElementById("navigation"),
        main: document.getElementById("main_content"),
        footer: document.getElementById("footer"),
    };
}
