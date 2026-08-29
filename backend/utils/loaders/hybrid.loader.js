/**
 * Hybrid loading helper: fusion of eager loading (with relations) and lazy loading via pagination & limits.
 */
export const hybridLoad = async (model, { page = 1, limit = 10, where = {}, include = [], order = [["createdAt", "DESC"]] } = {}) => {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const { rows, count } = await model.findAndCountAll({
        where,
        include,
        limit: parsedLimit,
        offset,
        order
    });

    return {
        data: rows,
        pagination: {
            page: parsedPage,
            limit: parsedLimit,
            totalItems: count,
            totalPages: Math.ceil(count / parsedLimit),
            hasMore: offset + rows.length < count
        }
    };
};

