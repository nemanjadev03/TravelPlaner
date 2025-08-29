const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validation/userValidation');
const User = require('../models/User');
const Activity = require('../models/Activity');
const router = express.Router();

router.post('/register', async (req,res)=>{
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(value.password, 10);
    const user = await User.create({ name: value.name, email: value.email, password: hashed });
    await Activity.create({ user: user._id, action: 'register', meta: { email: user.email } });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'super_secret_change_me', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/login', async (req,res)=>{
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(value.password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    await Activity.create({ user: user._id, action: 'login' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'super_secret_change_me', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;