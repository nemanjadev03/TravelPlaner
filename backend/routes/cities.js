const express = require('express');
const City = require('../models/City');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const citySchema = require('../validation/cityValidation');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { error, value } = citySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const exists = await City.findOne({ name: value.name });
    if (exists) return res.status(400).json({ message: 'City already exists' });
    const city = await City.create({ ...value, createdBy: req.user._id });
    await Activity.create({ user: req.user._id, action: 'create_city', meta: { cityId: city._id } });
    res.status(201).json(city);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = 'name', q } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const total = await City.countDocuments(filter);
    const items = await City.find(filter).sort(sort).skip((page-1)*limit).limit(parseInt(limit));
    res.json({ data: items, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', auth, async (req,res)=>{
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'Not found' });
    res.json(city);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req,res)=>{
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'Not found' });
    if (String(city.createdBy) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    const { error, value } = citySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    Object.assign(city, value); await city.save();
    await Activity.create({ user: req.user._id, action: 'update_city', meta: { cityId: city._id } });
    res.json(city);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req,res)=>{
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: 'Not found' });
    if (String(city.createdBy) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    await city.deleteOne();
    await Activity.create({ user: req.user._id, action: 'delete_city', meta: { cityId: city._id } });
    res.json({ message: 'City removed' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;