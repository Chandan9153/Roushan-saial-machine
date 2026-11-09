const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function register(req, res, next) {
  try {
    const { name, email, phone, password, address } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    // Role is never accepted from the client: every self-registration is a customer.
    const user = await User.create({ name, email, phone, password, address });
    return res.status(201).json({ success: true, data: { user, token: signToken(user) } });
  } catch (err) { return next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    user.password = undefined;
    return res.json({ success: true, data: { user, token: signToken(user) } });
  } catch (err) { return next(err); }
}

async function me(req, res) {
  return res.json({ success: true, data: req.user });
}

module.exports = { register, login, me };
