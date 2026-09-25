// lazyRoute.js
const lazyRoute = (importFn) => {
  return async function (...args) {
    const module = await importFn();
    const Component = module.default ?? module;

    // If Component is a function, execute it with the router context
    if (typeof Component === 'function') {
      return Component.apply(this, args);
    }
    return Component;
  };
};

export default lazyRoute;