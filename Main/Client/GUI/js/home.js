function getId(name){
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

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
}