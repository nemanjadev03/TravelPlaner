const express = require('express');
const auth = require('../middleware/auth');
const permit = require('../middleware/role');
const User = require('../models/User');
const Activity = require('../models/Activity');

const router = express.Router();

router.get('/users', auth, permit('admin'), async (req,res)=>{
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/activities', auth, permit('admin'), async (req,res)=>{
  const { page=1, limit=50 } = req.query;
  const total = await Activity.countDocuments();
  const items = await Activity.find().populate('user', 'name email').sort('-createdAt').skip((page-1)*limit).limit(parseInt(limit));
  res.json({ data: items, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
});

module.exports = router;