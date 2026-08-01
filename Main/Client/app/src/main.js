import SPA from "./core/spa";
import Authentication from "./core/authentication";

import PageNotFound from "./pages/404/pageNotFound";
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
// import Profile from './pages/profile/profile';
// import Settings from './pages/settings';
import Saved from './pages/saved/saved';
import Friends from './pages/friends/friends';
// import Home from './pages/home/home';

// const app = new SPA({
//     root: document.getElementById('app'),
//     default: PageNotFound
// });

const app = new SPA({
    root: document.getElementById('app'),
    defaultRoute: PageNotFound,
});

app.add('/', Authentication(Landing));
app.add('/login', Authentication(Login));
app.add(/\/signup\/(?:(?<id>\d+))?/i, Authentication(Signup));
// app.add('/app', AuthCheck(Home));
// app.add("/app/home", Home);
// app.add('/app/profile', Profile);
// app.add('/app/settings', Settings);
app.add('/app/saved', Authentication(Saved, { isLoggedInRequired: true }));
app.add('/app/friends', Authentication(Friends,  { isLoggedInRequired: true }));

app.handleRouteChanges();