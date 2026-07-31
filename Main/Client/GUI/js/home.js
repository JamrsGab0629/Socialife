function getId(name) {
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

export async function initHome({ signal }) {
    let currentActionAbortController = null;

    const abortCheck = () => {
        if (signal?.aborted) throw new Error("initHome");
    }

    try {
        abortCheck();
        const main_view = getId("main-content");
        const triggers = document.querySelectorAll('.icon-btn');

        triggers.forEach((trigger) => {
            trigger.addEventListener('click', async (e) => {
                const action = trigger.getAttribute('action-button');
                e.preventDefault();

                try {
                    const module = await import(`../js/${action}.js`);

                    if(signal.aborted) return;

                    module.init({signal});
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error("Navigation routing error encountered:", error);
                    } else {
                        console.log(error.message);
                    }
                }
            });
        });

        abortCheck();

        console.log("Home fully rendered");
    } catch (error) {
        if (error.message === "initHome") {
            console.error("Home Aborted mid-session");
        } else {
            console.error(error);
        }
    }
}