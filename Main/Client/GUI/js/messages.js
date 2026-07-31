function getId(name) {
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

export async function init({ signal }) {
    const abortCheck = () => {
        if (signal?.aborted) throw new Error("initMess");
    };

    let mediaQuery = null;
    let resizeHandler = null;

    try {
        const mainView = getId('main-content');
        const logo = getId('main-logo');
        const refresh = getId('refresh');
        const html = {};

        try {
            const response = async () => {
                const [convRes, msgRes] = await Promise.all([
                    fetch('./html/mess-conv.html'),
                    fetch('./html/mess-msg.html')
                ]);

                if (!convRes.ok || !msgRes.ok) throw new Error(`HTTP error!`);

                const [convDat, msgDat] = await Promise.all([
                    convRes.text(),
                    msgRes.text()
                ]);

                return { convDat, msgDat };
            };

            const data = await response();
            html.conv = data.convDat;
            html.msg = data.msgDat;
        } catch (error) {
            console.error(`Failed to load components`, error);
            return;
        }

        abortCheck();

        // helpers
        const back = (e) => {
            e.preventDefault();
            console.log("Back to convo");
            mainView.innerHTML = html.conv;
            refresh.href = "./skeleton.html";
            logo.src = "./images/Socialife-stamp.png";
        };

        const andreiMess = (e) => {
            e.preventDefault();
            console.log("View messages");
            mainView.innerHTML = html.msg;
            refresh.href = "#";
            logo.src = "./images/icon/back.png";
        };

        const mainSafeListener = (e) => {
            getId('andrei').addEventListener('click', andreiMess);
        };

        mediaQuery = window.matchMedia('(max-width: 768px)');

        resizeHandler = (e) => {
            if (signal?.aborted) {
                mediaQuery.removeEventListener('change', resizeHandler);
                return;
            }

            if (e.matches) {
                mainView.innerHTML = html.conv;

                mainView.addEventListener('click', mainSafeListener);
                logo.addEventListener('click', back);
            } else {
                refresh.href = "./skeleton.html";
                logo.src = "./images/Socialife-stamp.png";
                mainView.innerHTML = html.conv + html.msg;
                logo.removeEventListener('click', back);
                getId('andrei').removeEventListener('click', andreiMess);
                mainView.removeEventListener('click', mainSafeListener);
            }
        };

        resizeHandler(mediaQuery);

        mediaQuery.addEventListener('change', resizeHandler);

        signal?.addEventListener('abort', () => {
            if (mediaQuery && resizeHandler) {
                mediaQuery.removeEventListener('change', resizeHandler);
                console.log("Permanently unlinked message window resize listeners.");
            }
        });

        console.log("Message module successfully attached and running.");

    } catch (error) {
        if (mediaQuery && resizeHandler) {
            mediaQuery.removeEventListener('change', resizeHandler);
        }

        if (error.message === "initMess") {
            console.error('Message process aborted safely.');
        } else {
            console.error(error);
        }
    }
}