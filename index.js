const express = require('express');
const app = express();

const busRoutes = require('./routes/buses');
const routeRoutes = require('./routes/routes');
const fareRoutes = require('./routes/fares');
const gpsRoutes = require('./routes/gps');
const ussdRoutes = require('./routes/ussd');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/fares', fareRoutes);
app.use('/api/gps', gpsRoutes);
app.use('/api/ussd', ussdRoutes);


app.get('/', (req,res)=>{
    res.json({
        message:"Kigali Public Transport Tracker API is running"
    });
});


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});