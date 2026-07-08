function getId(name){
    const val = document.getElementById(name)
    if (!val) throw new Error(`element id #${name} not found`);
    return val;
}

async function view_main(main_view, html, nav){
   switch(nav) {
        case "home": {
            main_view.innerHTML = html.feed + html.suggest;

            const home_module = await import(`../js/home.js?v=${Date.now()}`);
            home_module.initHome();
            break;
        }
        case "friends": {
            main_view.innerHTML = html.friends;

            break;
        }
        default : {
            console.error(`nav name not valid ${nav}`);
        }
    }
}

// async function navFactory(main_view, html, nav){
//     switch(nav) {
//         case "home" : {
//             return 
//         }
//         default : {
//             console.error(`nav name not valid ${nav}`);
//         }
//     }
// }

async function fetchHtml() {
    const html = {}

    try {
        const response = (async () => {
            const [feedRes, suggestRes, freindsRes] = await Promise.all([
                fetch('./html/home-feed.html'),
                fetch('./html/home-suggest.html'),
                fetch('./html/friends.html')
            ]);

            if(!feedRes.ok || !suggestRes.ok || !freindsRes.ok) throw new Error(`response failed: feed code ${feedRes.status} , suggest code ${suggestRes.status}, friends code ${freindsRes.status}`);

            const [feedDat, suggestDat, friendsDat] = await Promise.all([
                feedRes.text(),
                suggestRes.text(),
                freindsRes.text()
            ]);

            return {feedDat, suggestDat, friendsDat};
        });

        const data = await response();

        html.feed = data.feedDat;
        html.suggest = data.suggestDat;
        html.friends = data.friendsDat;
    } catch (error) {
        console.error(`Failed to load`, error);
        return;
    }

    return html;
}

window.addEventListener("DOMContentLoaded", async () => {
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
        main_view.innerHTML = "<p style='color:red ; font-weight:bold;'>Content cannot load</p>";
        return;
    }

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
    navListener(nav_id.friends, 'friends');

    // mobile-nav
    navListener(mobile_nav_id.home, 'home');
    navListener(mobile_nav_id.friends, 'friends');
});