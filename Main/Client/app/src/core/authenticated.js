export const Authenticated = ( component ) => {
    return function( ...args ) {
        if (typeof component !== 'function') throw new Error('component must be a function');

        // console.log('debug.authenticated', args);

        if (localStorage.getItem("uid") !== null){
            this.redirect("/app");
            return;
        }

        return component.bind(this)(args[0]);
    }
}

export default Authenticated;