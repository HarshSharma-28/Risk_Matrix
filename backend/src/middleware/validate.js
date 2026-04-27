// Zod Validation middleware execution wrapper
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    next(err); // Passes to global errorHandler which formats Zod errors
  }
};

module.exports = { validate };
