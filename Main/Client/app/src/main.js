import SPA from "./core/spa";
import Home from './pages/home';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Saved from './pages/saved';
import Friends from './pages/friends';
import PageNotFound from "./pages/pageNotFound";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";

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

// app.add('/', Home);
// app.add('/home', Home);
// app.add('/profile', Profile);
// app.add('/settings', Settings);
// app.add('/saved', Saved);
// app.add('/friends', Friends);

// app.handleRouteChanges();
main.handleRouteChanges();