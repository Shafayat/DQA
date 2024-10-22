const mongoose = require('mongoose');

const CycleSchema = new mongoose.Schema({
  region: { type: String, required: true, unique: true },  // unique per region
  currentCycle: { type: Number, default: 0 },
  cycleDuration: { type: Number, default: 7 }, // days
  lastCycleUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cycle', CycleSchema);
