// Central error handler. Never leak stack traces or internals in production.
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== 'production') console.error(err);
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'A record with that value already exists' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id format' });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Uploaded file is too large' });
  }
  const status = err.statusCode || 500;
  return res.status(status).json({ success: false, message: err.message || 'Server error' });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
