const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  distance: { type: Number, required: true },
  bidirectional: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Route', RouteSchema);