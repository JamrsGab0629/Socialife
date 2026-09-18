const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.body = parsed.body;
    req.params = parsed.params;
    req.query = parsed.query;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

export default validate;