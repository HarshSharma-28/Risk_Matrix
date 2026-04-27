const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VAL_INVALID_INPUT',
        message: 'Input validation failed',
        fields: (err.errors || err.issues || []).map(e => ({ field: e.path.join('.'), message: e.message }))
      }
    });
  }

  // Supabase / Database errors (Postgres error codes usually start with 23 for constraints)
  if (err.code && err.code.toString().startsWith('23')) {
    return res.status(409).json({
      success: false,
      error: { code: 'DB_CONSTRAINT', message: 'Data conflict or constraint violation' }
    });
  }

  // Default fallback
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = { errorHandler };
