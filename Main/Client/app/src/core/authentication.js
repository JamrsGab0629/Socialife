export const Authentication = ( component, params ) => {
    return function() {
        console.log('debug', this, typeof component)

        const { isLoggedInRequire } = params || {}; 

        if (typeof component !== 'function') throw new Error('component must be a function');

        if (localStorage.getItem("uid") !== null && (window.location.pathname === "/login" || window.location.pathname === /\/signup\/(?:(?<id>\d+))?/i || window.location.pathname === "/landing")){
            this.redirect('/app');
            return;
        }

        if (localStorage.getItem("uid") === null && isLoggedInRequired) {
            this.redirect("/login");
            return;
        }

        return component.bind(this)();
    };
}

export default Authentication;