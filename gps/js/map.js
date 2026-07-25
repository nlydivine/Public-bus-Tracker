const map = L.map('map').setView([-1.9441, 30.0619], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function loadBuses(){

function loadBusLocations(){

    fetch("http://localhost:3000/api/gps")

    .then(response => response.json())

    .then(buses => {


        buses.forEach(bus => {


            L.marker([
                parseFloat(bus.latitude),
                parseFloat(bus.longitude)
            ])
            .addTo(map)
            .bindPopup(
                `
                <b>Bus ID:</b> ${bus.bus_id}<br>
                <b>Speed:</b> ${bus.speed} km/h
                `
            );


        });


    })

    .catch(error=>{
        console.log("GPS Error:", error);
    });

}


loadBusLocations();