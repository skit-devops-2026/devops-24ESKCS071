/**
 * Centralized API Error Handling Middleware.
 * Standardizes API error responses and prevents sensitive stack traces
 * or internal implementation leaks in production environments.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Server-side diagnostic logging
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Handle malformed JSON request bodies
  if (err.name === 'SyntaxError' && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body.'
    });
  }

  // Handle Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.length > 0 ? messages.join(' ') : err.message
    });
  }

  // Handle invalid Mongoose ObjectId casting
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field '${err.path}'.`
    });
  }

  // Handle duplicate key errors (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`
    });
  }

  // Standard generic error response
  return res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal server error occurred.' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

/**
 * 404 Not Found Middleware for unhandled API routes.
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.method} ${req.originalUrl}' not found.`
  });
};
