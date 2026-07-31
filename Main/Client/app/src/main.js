import SPA from "./core/spa";
// import Home from './pages/home';
// import Profile from './pages/profile';
// import Settings from './pages/settings';
// import Saved from './pages/saved';
// import Friends from './pages/friends';
// import PageNotFound from "./pages/pageNotFound";

import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";

// const app = new SPA({
//     root: document.getElementById('app'),
//     default: PageNotFound
// });

const main = new SPA({
    root: document.getElementById('app'),
    defaultRoute: Landing
});

main.add('/', Landing);
main.add('/login', Login)
main.add(/\/signup\/(?:(?<id>\d+))?/i, Signup);

// app.add(/\/app\/(?:home)?/i, Home);
// app.add('app/profile', Profile);
// app.add('app/settings', Settings);
// app.add('app/saved', Saved);
// app.add('app/friends', Friends);

// app.handleRouteChanges();
main.handleRouteChanges();