const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  meta: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);