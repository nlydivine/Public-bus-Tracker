const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ['osm', 'field_survey', 'manual', 'rfta'],
      default: 'osm',
    },
    osmId: { type: String, index: true, sparse: true },
    sector: { type: String, trim: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (c) =>
            Array.isArray(c) &&
            c.length === 2 &&
            c[0] >= -180 && c[0] <= 180 &&
            c[1] >= -90 && c[1] <= 90,
          message: 'coordinates must be [lng, lat] within valid ranges',
        },
      },
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

StopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Stop', StopSchema);
