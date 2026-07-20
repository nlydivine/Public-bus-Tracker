
// Create map
const map = L.map('map').setView(
    [-1.9441, 30.0619],
    13
);


// Add map tiles
L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'OpenStreetMap'
}
).addTo(map);



let busMarker;


// Get GPS data from backend

async function loadBusLocation(){

    const response = await fetch(
        "http://localhost:3000/api/gps/1"
    );

    const data = await response.json();


    const bus = data[0];


    const latitude = bus.latitude;
    const longitude = bus.longitude;


    if(busMarker){

        busMarker.setLatLng([
            latitude,
            longitude
        ]);

    }else{

        busMarker = L.marker([
            latitude,
            longitude
        ])
        .addTo(map)
        .bindPopup(
            "Bus ID: "+bus.bus_id+
            "<br>Speed: "+bus.speed+" km/h"
        );

    }


    map.setView([
        latitude,
        longitude
    ]);

}


// load every 5 seconds

loadBusLocation();

setInterval(
    loadBusLocation,
    5000
);