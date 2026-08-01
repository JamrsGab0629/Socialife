<<<<<<< HEAD
<<<<<<< HEAD
function getId(name){
=======
function getId(name) {
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

<<<<<<< HEAD
export async function initHome(params) {
    console.log("home init");

    const main_view = getId("main-content");

    const id = {
        message: getId("message-icon"),
        timeline: getId("timeline-icon")
    };

    const initModule = (id, filename) => {
        id.addEventListener('click', async (e) => {
            e.preventDefault();
            const module = await import(`../js/${filename}?v=${Date.now()}`);
            module.init();
        });
    };

    initModule(id.message, 'message.js');
    initModule(id.timeline, 'timeline.js');
=======
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
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
=======
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
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd
}