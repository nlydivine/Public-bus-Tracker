const express = require('express');
const app = express();

const busRoutes = require('./routes/buses');
const routeRoutes = require('./routes/routes');
const fareRoutes = require('./routes/fares');

app.use(express.json());

app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/fares', fareRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Kigali Public Transport Tracker API is running' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

