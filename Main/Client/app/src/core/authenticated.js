export const Authenticated = ( component ) => {
    return function() {
        if (typeof component !== 'function') throw new Error('component must be a function');

        if (localStorage.getItem("uid") !== null){
            this.redirect("/app");
            return;
        }

        return component.bind(this)();
    }
}

export default Authenticated;