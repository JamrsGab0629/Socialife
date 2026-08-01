<<<<<<< HEAD
<<<<<<< HEAD
function getId(name){
=======
function getId(name) {
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
    const val = document.getElementById(name)
    if (!val) throw new Error(`element id #${name} not found`);
    return val;
}

<<<<<<< HEAD
async function view_main(main_view, html, nav){
   switch(nav) {
        case "home": {
            main_view.innerHTML = html.feed + html.suggest;

            const home_module = await import(`../js/home.js?v=${Date.now()}`);
            home_module.initHome();
            break;
        }
        case 'saved' : {
=======
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
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
            main_view.innerHTML = html.saved;

            break;
        }
        case "friends": {
            main_view.innerHTML = html.friends;

            break;
        }
<<<<<<< HEAD
        default : {
=======
        case "settings": {
            main_view.innerHTML = html.settings;

            if (signal.aborted) return;

            const settings_module = await import(`./settings.js`);
            if (signal.aborted) return;

            settings_module.initSettings({signal});

            break;
        }
        default: {
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
            console.error(`nav name not valid ${nav}`);
        }
    }
}

async function fetchHtml() {
    const html = {}

    try {
        const response = (async () => {
<<<<<<< HEAD
            const [feedRes, suggestRes, savedRes, freindsRes] = await Promise.all([
                fetch('./html/home-feed.html'),
                fetch('./html/home-suggest.html'),
                fetch('./html/saved.html'),
                fetch('./html/friends.html')
            ]);

            if(!feedRes.ok || !suggestRes.ok || !savedRes.ok || !freindsRes.ok) throw new Error(`response failed: \n> feed code ${feedRes.status} \n> suggest code ${suggestRes.status} \n> saved code ${savedRes.status} \n> friends code ${freindsRes.status}`);

            const [feedDat, suggestDat, savedDat, friendsDat] = await Promise.all([
                feedRes.text(),
                suggestRes.text(),
                savedRes.text(),
                freindsRes.text()
            ]);

            return {feedDat, suggestDat, savedDat, friendsDat};
=======
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
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
        });

        const data = await response();

<<<<<<< HEAD
        html.feed = data.feedDat;
        html.suggest = data.suggestDat;
        html.saved = data.savedDat;
        html.friends = data.friendsDat;
=======
        html.profile = data.profileDat;
        html.home = data.feedDat + data.suggestDat;
        html.suggest = data.suggestDat;
        html.saved = data.savedDat;
        html.friends = data.friendsDat;
        html.settings = data.settingsDat;
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
    } catch (error) {
        console.error(`Failed to load`, error);
        return;
    }

    return html;
}

window.addEventListener("DOMContentLoaded", async () => {
<<<<<<< HEAD
    const main_view = getId('main-content');

    const nav_id = {
        home: getId("home-nav"),
        saved: getId("saved-nav"),
        settings: getId("settings-nav"),
        friends: getId("friends-nav"),
        logout: getId("logout-nav")
    }

    const mobile_nav_id = {
        home: getId("mobile-home-nav"),
        saved: getId("mobile-saved-nav"),
        settings: getId("mobile-settings-nav"),
        friends: getId("mobile-friends-nav"),
        logout: getId("mobile-logout-nav")
    }

    const html = await fetchHtml();

    if(!html) {
=======
    let currentNavAbortController = null;

    const main_view = getId('main-content');
    const html = await fetchHtml();

    if (!html) {
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
        main_view.innerHTML = "<p style='color:red ; font-weight:bold;'>Content cannot load</p>";
        return;
    }

<<<<<<< HEAD
    // initialize mone when opening
    view_main(main_view, html, 'home');

    // safe listener
    const navListener = (id, view_name) => {
        id.addEventListener('click', (e) => {
            e.preventDefault();
            view_main(main_view, html, view_name);
        });
    };

    // side-nav
    navListener(nav_id.home, 'home');
    navListener(nav_id.saved, 'saved');
    navListener(nav_id.friends, 'friends');

    // mobile-nav
    navListener(mobile_nav_id.home, 'home');
    navListener(mobile_nav_id.saved, 'saved');
    navListener(mobile_nav_id.friends, 'friends');
=======
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
>>>>>>> 57227457ae4e865c056d75c1e124a403ec61e1fb
=======
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
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd
});