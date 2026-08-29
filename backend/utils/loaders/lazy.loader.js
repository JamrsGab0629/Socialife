/**
 * Lazy loading helper: loads base records or fetches associated relations on-demand.
 */
export const lazyLoad = async (model, id, attributes) => {
    return await model.findByPk(id, {
        ...(attributes && { attributes })
    });
};

export const lazyLoadRelation = async (instance, associationMethod, options = {}) => {
    if (!instance || typeof instance[associationMethod] !== "function") {
        throw new Error(`Instance or association method '${associationMethod}' not found.`);
    }
    return await instance[associationMethod](options);
};

