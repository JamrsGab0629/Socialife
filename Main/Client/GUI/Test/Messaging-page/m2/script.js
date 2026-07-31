function getId(name){
    const val = document.getElementById(name);
    if(!val) throw new Error(`id #{name}`);
    return val;
}

window.addEventListener("DOMContentLoaded", async () => {
    const mainView = getId('main-content');

    const html = {}

    try {
        const response = (async () => {
            const [chatRes, convRes] = await Promise.all([
                fetch('./chat-panel.html'),
                fetch('./conv-list.html')
            ]);

            if(!chatRes.ok || !convRes.ok) throw new Error(`HTTP error! chat status: ${chatRes.status} | conv status: ${convRes.status}`);

            const [chatData, convData] = await Promise.all([
                chatRes.text(),
                convRes.text()
            ]);

            return {chatData, convData};
        });

        const data = await response();

        html.chat = data.chatData;
        html.conv = data.convData;
    } catch (error) {
        console.error(`Failed to load`, error);
        return;
    }

    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const resize = (e) => {
        if (e.matches) {
            mainView.innerHTML = html.conv; // It's mobile

            const view = () => {
                event.preventDefault();
                console.log("View messages");
                mainView.innerHTML = html.chat;
            }

            getId("andrei").addEventListener('click', view);
        }
        else mainView.innerHTML = html.conv + html.chat; // It's desktop
    }

    resize(mediaQuery);

    mediaQuery.addEventListener('change', resize);
});