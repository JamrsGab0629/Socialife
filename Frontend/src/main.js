import SPA from "./core/spa";
import checkAuth from "./core/checkAuthentication";
import checkAdmin from "./core/checkAdministration";
import isAuth from "./core/isAuthenticated";
import SignupStage from "./core/signupStage";

import PageNotFound from "./pages/404/pageNotFound";
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";

// app pages
import Home from './pages/home/home';
import Profile from './pages/profile/profile';
import Settings from './pages/settings/settings';
import Saved from './pages/saved/saved';
import Friends from './pages/friends/friends';
import Timeline from "./pages/timeline/timeline";

import lazyRoute from "./core/lazyloading";

const app = new SPA({
    root: document.getElementById('app'),
    defaultRoute: PageNotFound,
});

app.add(/^\/(?:landing)?$/i, Landing);
app.add('/login', isAuth(Login));
app.add(/^\/signup\/(?:(?<id>\d+))?$/i, isAuth(SignupStage(Signup)));

// backend-dependent routes (typo fixed: isLoggedInRequired -> isLoginRequired) check nyo nalang
app.add(/^\/app(?:\/home)?$/i, checkAuth(Home));
app.add(/^\/app\/profile(?:\/(?<userId>[^/]+))?$/i, checkAuth(Profile));
app.add('/app/settings', checkAuth(Settings));
app.add('/app/saved', checkAuth(Saved));
app.add('/app/friends', checkAuth(Friends));
app.add('/app/timeline', checkAuth(Timeline));

// admin dashboard & routes
app.add(/^\/admin(?:\/dashboard)?$/i, checkAdmin(lazyRoute(() => import('./pages/admin/dashboard/dashboard'))));
// app.add('/admin/analytics', checkAdmin(lazyRoute(() => import('./pages/admin/analytics/analytics'))));
app.add('/admin/posts', checkAdmin(lazyRoute(() => import('./pages/admin/posts/posts'))));
app.add('/admin/users', checkAdmin(lazyRoute(() => import('./pages/admin/users/users'))));
app.add('/admin/reports', checkAdmin(lazyRoute(() => import('./pages/admin/reports/reports'))));
app.add('/admin/team-roles', checkAdmin(lazyRoute(() => import('./pages/admin/team_roles/team_roles'))));
// app.add('/admin/settings', checkAdmin(lazyRoute(() => import('./pages/admin/settings/settings'))));

app.handleRouteChanges();
