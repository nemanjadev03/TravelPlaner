const express = require('express');
const auth = require('../middleware/auth');
const City = require('../models/City');
const RouteModel = require('../models/Route');
const Activity = require('../models/Activity');
const dijkstra = require('../utils/dijkstra');

const router = express.Router();

router.get('/export', auth, async (req,res)=>{
  try {
    const cities = await City.find().lean();
    const routes = await RouteModel.find().lean();
    const nodes = cities.map(c => ({ id: c._id.toString(), name: c.name, location: c.location }));
    const edges = routes.map(r => ({ id: r._id.toString(), from: r.from.toString(), to: r.to.toString(), distance: r.distance, bidirectional: r.bidirectional }));
    res.json({ nodes, edges });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/shortest', auth, async (req,res)=>{
  try {
    const { fromId, toId } = req.body;
    if (!fromId || !toId) return res.status(400).json({ message: 'fromId and toId are required' });
    const cities = await City.find().lean();
    const routes = await RouteModel.find().lean();

    const idToName = Object.fromEntries(cities.map(c => [c._id.toString(), c.name]));

    const adj = {}; cities.forEach(c => adj[c._id.toString()] = []);
    routes.forEach(r => {
      adj[r.from.toString()].push({ node: r.to.toString(), weight: r.distance });
      if (r.bidirectional) adj[r.to.toString()].push({ node: r.from.toString(), weight: r.distance });
    });

    const result = dijkstra(adj, fromId, toId);
    const pathNames = (result.path || []).map(id => idToName[id] || id);
    await Activity.create({ user: req.user._id, action: 'compute_shortest', meta: { fromId, toId, distance: result.distance, pathNames } });
    res.json({ distance: result.distance, pathIds: result.path, pathNames });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;