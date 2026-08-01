import SPA from "./core/spa";
import Authentication from "./core/authentication";
import Authenticated from "./core/authenticated";

import PageNotFound from "./pages/404/pageNotFound";
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";

import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import Settings from './pages/settings/settings';
import Saved from './pages/saved/saved';
import Friends from './pages/friends/friends';
import Timeline from "./pages/timeline/timeline";

// const app = new SPA({
//     root: document.getElementById('app'),
//     default: PageNotFound
// });

const app = new SPA({
    root: document.getElementById('app'),
    defaultRoute: PageNotFound,
});

app.add('/', Authenticated(Landing));
app.add('/login', Authenticated(Login));
app.add(/^\/signup\/(?:(?<id>\d+))?$/i, Authenticated(Signup));
app.add(/^\/app(?:\/home)?$/i, Authentication(Home, { isLoggedInRequired: true }));
app.add('/app/profile', Profile);
app.add('/app/settings', Settings);
app.add('/app/saved', Authentication(Saved, { isLoggedInRequired: true }));
app.add('/app/friends', Authentication(Friends,  { isLoggedInRequired: true }));
app.add('/app/timeline', Authentication(Timeline,  { isLoggedInRequired: true }));

app.handleRouteChanges();
