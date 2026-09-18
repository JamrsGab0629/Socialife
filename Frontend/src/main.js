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

const app = new SPA({
    root: document.getElementById('app'),
    defaultRoute: PageNotFound,
});

app.add('/', Landing);
app.add('/login', Authenticated(Login));
app.add(/^\/signup\/(?:(?<id>\d+))?$/i, Authenticated(Authentication(Signup, { isLoginRequired: false, isSignup: true })));

// backend-dependent routes (typo fixed: isLoggedInRequired -> isLoginRequired) check nyo nalang
app.add(/^\/app(?:\/home)?$/i, Authentication(Home, { isLoginRequired: true }));
app.add('/app/profile', Authentication(Profile, { isLoginRequired: true }));
app.add('/app/settings', Authentication(Settings, { isLoginRequired: true }));
app.add('/app/saved', Authentication(Saved, { isLoginRequired: true }));
app.add('/app/friends', Authentication(Friends, { isLoginRequired: true }));
app.add('/app/timeline', Authentication(Timeline, { isLoginRequired: true }));

// --- FRONTEND-ONLY DEV MODE ---
// If your backend is offline and you just want to see/work on the UI,
// comment out the block above and uncomment the lines below instead.
// This skips the auth/backend check entirely for these routes.
//
/*app.add(/^\/app(?:\/home)?$/i, Home);
app.add('/app/profile', Profile);
app.add('/app/settings', Settings);
app.add('/app/saved', Saved);
app.add('/app/friends', Friends);
app.add('/app/timeline', Timeline); */

app.handleRouteChanges();
