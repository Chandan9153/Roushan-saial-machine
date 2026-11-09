const jwt = require('jsonwebtoken');
const User = require('../models/User');

function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return User.findById(decoded.id)
      .then((user) => {
        if (!user) return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        req.user = user;
        return next();
      })
      .catch(next);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
}

module.exports = { protect };
