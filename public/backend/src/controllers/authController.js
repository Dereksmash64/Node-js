const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
// Keep a local config as a safeguard; primary config should be in src/index.js
dotenv.config();

// Helper to ensure JWT secret exists before signing tokens
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // do not throw here — controllers will return a 500 with friendly message
    console.warn('JWT_SECRET not defined in environment. Token generation will fail.');
  }
  return secret;
}

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Faltan datos' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed });
    await user.save();

  const payload = { id: user._id };
  const secret = getJwtSecret();
  if (!secret) return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
  const token = jwt.sign(payload, secret, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Faltan datos' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

  const payload = { id: user._id };
  const secret = getJwtSecret();
  if (!secret) return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
  const token = jwt.sign(payload, secret, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
