export const Authentication = ( component, params ) => {
    return function() {
        // console.log('debug', this, typeof component)

        const { isLoggedInRequired } = params || {}; 

        if (typeof component !== 'function') throw new Error('component must be a function');

        if (localStorage.getItem("uid") === null && isLoggedInRequired) {
            this.redirect("/login");
            return;
        }

        return component.bind(this)();
    };
}

export default Authentication;