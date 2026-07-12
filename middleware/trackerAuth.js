module.exports = function trackerAuth(req, res, next) {
  const provided = req.header('x-tracker-secret');
  const expected = process.env.TRACKER_INGEST_SECRET;

  if (!expected) {
    return res.status(500).json({ error: 'Server misconfigured: TRACKER_INGEST_SECRET not set' });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Invalid or missing tracker credentials' });
  }
  next();
};
