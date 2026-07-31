export default function Layout(root) {
    root.innerHTML = `
          <div id="container">
                <navigation id="navigation"></navigation>
                <main id="main-content"></main>
                <footer id="footer"></footer>
          </div>
      `;

    return {
        navigation: document.getElementById("navigation"),
        main: document.getElementById("main-content"),
        footer: document.getElementById("footer"),
    };
}
