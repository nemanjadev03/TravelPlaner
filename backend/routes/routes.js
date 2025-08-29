const express = require('express');
const RouteModel = require('../models/Route');
const City = require('../models/City');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const routeSchema = require('../validation/routeValidation');

const router = express.Router();

router.post('/', auth, async (req,res)=>{
  try {
    const { error, value } = routeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    if (value.from === value.to) return res.status(400).json({ message: 'from and to must differ' });
    const [a,b] = await Promise.all([City.findById(value.from), City.findById(value.to)]);
    if (!a || !b) return res.status(400).json({ message: 'Cities not found' });
    const exists = await RouteModel.findOne({ from: value.from, to: value.to });
    if (exists) return res.status(400).json({ message: 'Route already exists' });
    const route = await RouteModel.create({ ...value, createdBy: req.user._id });
    await Activity.create({ user: req.user._id, action: 'create_route', meta: { routeId: route._id } });
    res.status(201).json(route);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/', auth, async (req,res)=>{
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const total = await RouteModel.countDocuments();
    const items = await RouteModel.find().populate('from to', 'name location').sort(sort).skip((page-1)*limit).limit(parseInt(limit));
    res.json({ data: items, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', auth, async (req,res)=>{
  try {
    const item = await RouteModel.findById(req.params.id).populate('from to', 'name location');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', auth, async (req,res)=>{
  try {
    const route = await RouteModel.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Not found' });
    if (String(route.createdBy) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    const { error, value } = routeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    Object.assign(route, value); await route.save();
    await Activity.create({ user: req.user._id, action: 'update_route', meta: { routeId: route._id } });
    res.json(route);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', auth, async (req,res)=>{
  try {
    const route = await RouteModel.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Not found' });
    if (String(route.createdBy) !== String(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    await route.deleteOne();
    await Activity.create({ user: req.user._id, action: 'delete_route', meta: { routeId: route._id } });
    res.json({ message: 'Route removed' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;