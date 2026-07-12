const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, trim: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    operator: { type: String, trim: true },
    capacity: { type: Number },

    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], default: [0, 0] },
    },
    heading: { type: Number, default: null },
    speedKmh: { type: Number, default: null },
    lastPingAt: { type: Date, default: null },

    status: {
      type: String,
      enum: ['active', 'idle', 'offline', 'maintenance'],
      default: 'offline',
    },
    occupancy: {
      type: String,
      enum: ['low', 'medium', 'high', 'full', 'unknown'],
      default: 'unknown',
    },
  },
  { timestamps: true }
);

BusSchema.index({ currentLocation: '2dsphere' });

BusSchema.methods.isStale = function (maxAgeSeconds = 60) {
  if (!this.lastPingAt) return true;
  return (Date.now() - this.lastPingAt.getTime()) / 1000 > maxAgeSeconds;
};

module.exports = mongoose.model('Bus', BusSchema);
