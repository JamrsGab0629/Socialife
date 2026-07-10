function getId(name) {
    const val = document.getElementById(name)
    if (!val) throw new Error(`element id #${name} not found`);
    return val;
}

async function nav_factory(main_view, html, nav, signal) {
    switch (nav) {
        case "profile": {
            main_view.innerHTML = html.profile;
            if (signal.aborted) return;

            const profile_module = await import(`./profile.js`);
            if (signal.aborted) return;

            profile_module.initProfile({signal});
            break;
        }
        case "home": {
            main_view.innerHTML = html.home;
            if (signal.aborted) return;

            const home_module = await import(`./home.js`);
            if (signal.aborted) return;

            home_module.initHome({signal});
            break;
        }
        case 'saved': {
            main_view.innerHTML = html.saved;

            break;
        }
        case "friends": {
            main_view.innerHTML = html.friends;

            break;
        }
        case "settings": {
            main_view.innerHTML = html.settings;

            if (signal.aborted) return;

            const settings_module = await import(`./settings.js`);
            if (signal.aborted) return;

            settings_module.initSettings({signal});

            break;
        }
        default: {
            console.error(`nav name not valid ${nav}`);
        }
    }
}

async function fetchHtml() {
    const html = {}

    try {
        const response = (async () => {
            const [profileRes, feedRes, suggestRes, savedRes, friendsRes, settingsRes] = await Promise.all([
                fetch("./html/profile.html"),
                fetch('./html/home-feed.html'),
                fetch('./html/home-suggest.html'),
                fetch('./html/saved.html'),
                fetch('./html/friends.html'),
                fetch('./html/settings.html'),
            ]);

            if (!profileRes.ok || !feedRes.ok || !suggestRes.ok || !savedRes.ok || !friendsRes.ok || !settingsRes.ok) throw new Error(`response failed: \n> profile code ${profileRes.status} \n> feed code ${feedRes.status} \n> suggest code ${suggestRes.status} \n> saved code ${savedRes.status} \n> friends code ${friendsRes.status} \n> settings code ${settingsRes.status}`);

            const [profileDat, feedDat, suggestDat, savedDat, friendsDat, settingsDat] = await Promise.all([
                profileRes.text(),
                feedRes.text(),
                suggestRes.text(),
                savedRes.text(),
                friendsRes.text(),
                settingsRes.text(),
            ]);

            return { profileDat, feedDat, suggestDat, savedDat, friendsDat, settingsDat};
        });

        const data = await response();

        html.profile = data.profileDat;
        html.home = data.feedDat + data.suggestDat;
        html.suggest = data.suggestDat;
        html.saved = data.savedDat;
        html.friends = data.friendsDat;
        html.settings = data.settingsDat;
    } catch (error) {
        console.error(`Failed to load`, error);
        return;
    }

    return html;
}

window.addEventListener("DOMContentLoaded", async () => {
    let currentNavAbortController = null;

    const main_view = getId('main-content');
    const html = await fetchHtml();

    if (!html) {
        main_view.innerHTML = "<p style='color:red ; font-weight:bold;'>Content cannot load</p>";
        return;
    }

    currentNavAbortController = new AbortController();
    nav_factory(main_view, html, 'home', currentNavAbortController.signal);

    const triggers = document.querySelectorAll('#profile-nav, .nav-item , .mobile-nav-item');

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('trigger activated');
            let action = trigger.getAttribute('nav-action');

            if (!action) return;

            console.log(`Resolved target route action: ${action}`);

            if (!action) {
                console.warn("Click dropped because no valid action route was found.");
                return;
            }

            if (currentNavAbortController) {
                currentNavAbortController.abort();
                console.log("Aborted previous initialization.");
            }

            currentNavAbortController = new AbortController();

            try {
                await nav_factory(main_view, html, action, currentNavAbortController.signal);
                console.log(`Successfully navigated to: ${action}`);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Navigation routing error encountered:", err);
                }
            }
        });
    });

    //will add clean up later...
});