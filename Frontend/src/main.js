import SPA from "./core/spa";
import checkAuth from "./core/checkAuthentication";
import isAuth from "./core/isAuthenticated";
import SignupStage from "./core/signupStage";

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
app.add('/login', isAuth(Login));
app.add(/^\/signup\/(?:(?<id>\d+))?$/i, isAuth(SignupStage(Signup)));

// backend-dependent routes (typo fixed: isLoggedInRequired -> isLoginRequired) check nyo nalang
app.add(/^\/app(?:\/home)?$/i, checkAuth(Home));
app.add('/app/profile', checkAuth(Profile));
app.add('/app/settings', checkAuth(Settings));
app.add('/app/saved', checkAuth(Saved));
app.add('/app/friends', checkAuth(Friends));
app.add('/app/timeline', checkAuth(Timeline));

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
