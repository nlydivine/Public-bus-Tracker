const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(req, res) {
  const { fullName, email, phone, password } = req.body;
  if (!fullName || !password || (!email && !phone)) {
    return res.status(400).json({ error: 'fullName, password, and email or phone are required' });
  }
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) return res.status(409).json({ error: 'Account already exists' });

  const user = await User.create({ fullName, email, phone, password });
  res.status(201).json({ token: signToken(user), user: { id: user._id, fullName, role: user.role } });
}

async function login(req, res) {
  const { email, phone, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { phone }] }).select('+password');
  if (!user || !user.password || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: signToken(user), user: { id: user._id, fullName: user.fullName, role: user.role } });
}

module.exports = { register, login };
