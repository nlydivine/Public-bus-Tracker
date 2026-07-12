const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema(
  {
    routeName: { type: String, required: true, trim: true },
    routeNumber: { type: String, trim: true },
    operator: { type: String, trim: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    stops: [
      {
        stop: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
        sequence: { type: Number, required: true },
        avgSecondsFromPrevStop: { type: Number, default: 0 },
      },
    ],
    polyline: { type: String },
    fareRwf: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', RouteSchema);
