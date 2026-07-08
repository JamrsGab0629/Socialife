function getId(name){
    const val = document.getElementById(name);
    if(!val) throw new Error(`id #{name}`);
    return val;
}

export async function initMess() {
    console.log("Mess init")
    
    const mainView = getId('main-content');

    const html = {}

    try {
        const response = (async () => {
            const [convRes, msgRes] = await Promise.all([
                fetch('./html/mess-conv.html'),
                fetch('./html/mess-msg.html')
            ]);

            if(!convRes.ok || !msgRes.ok) throw new Error(`HTTP error! chat status: ${convRes.status} | conv status: ${msgRes.status}`);

            const [convDat, msgDat] = await Promise.all([
                convRes.text(),
                msgRes.text()
            ]);

            return {convDat, msgDat};
        });

        const data = await response();

        html.conv = data.convDat;
        html.msg = data.msgDat;
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
                mainView.innerHTML = html.msg;
            }

            getId("andrei").addEventListener('click', view);
        }
        else mainView.innerHTML = html.conv + html.msg; // It's desktop
    }

    resize(mediaQuery);

    mediaQuery.addEventListener('change', resize);
}