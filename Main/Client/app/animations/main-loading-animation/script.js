const Socialife = (() => {

    const loader = document.getElementById("loader");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    let animationId = null;
    let timeoutId = null;
    let percent = 0;

    function animate() {
        if (percent >= 95) return;

        percent++;

        progressFill.style.width = percent + "%";
        progressText.textContent = `Loading... ${percent}%`;

        timeoutId = setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 25);
    }

    function show() {

        cancelAnimationFrame(animationId);
        clearTimeout(timeoutId);

        percent = 0;

        loader.style.display = "flex";
        loader.classList.remove("fade-out");

        progressFill.style.width = "0%";
        progressText.textContent = "Loading... 0%";

        animate();
    }

    function hide() {

        cancelAnimationFrame(animationId);
        clearTimeout(timeoutId);

        percent = 100;

        progressFill.style.width = "100%";
        progressText.textContent = "Loading... 100%";

        setTimeout(() => {
            loader.classList.add("fade-out");

            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }, 200);
    }

    return {
        loader: {
            show,
            hide
        }
    };

})();