 
export const eagerLoad = async (model, { where = {}, include = [], attributes, order } = {}) => {
    return await model.findAll({
        where,
        include,
        ...(attributes && { attributes }),
        ...(order && { order })
    });
};

export const eagerLoadOne = async (model, { where = {}, include = [], attributes } = {}) => {
    return await model.findOne({
        where,
        include,
        ...(attributes && { attributes })
    });
};
