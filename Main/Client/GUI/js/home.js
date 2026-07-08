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

    id.message.addEventListener('click', async () => {
        const message_module = await import(`../js/message.js?v=${Date.now()}`);
        message_module.initMess();
    });
}