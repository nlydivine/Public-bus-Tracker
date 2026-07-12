require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const attachSocketHandlers = require('./config/socket');

const authRoutes = require('./routes/auth');
const stopRoutes = require('./routes/stops');
const routeRoutes = require('./routes/routes');
const trackingRoutes = require('./routes/tracking');
const tripPlanRoutes = require('./routes/tripPlan');
const ussdRoutes = require('./routes/ussd');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);
attachSocketHandlers(io);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/trip-plan', tripPlanRoutes);
app.use('/ussd', ussdRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`[server] Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('[server] Failed to connect to MongoDB, exiting:', err.message);
    process.exit(1);
  });
