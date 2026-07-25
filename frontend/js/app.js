const API = "http://localhost:3000/api";


let map;
let gpsMarker;


let routes = [];
let stops = [];
let buses = [];



document.addEventListener(
"DOMContentLoaded",
async () => {


console.log("TransitX app loaded");



// =============================
// HTML ELEMENTS
// =============================


const originSelect =
document.getElementById("originSelect");


const destSelect =
document.getElementById("destSelect");


const fareOutput =
document.getElementById("fareOutput");


const distanceOutput =
document.getElementById("distanceOutput");


const routeNameOutput =
document.getElementById("routeNameOutput");


const timelineContainer =
document.getElementById("timelineContainer");





// =============================
// CREATE MAP
// =============================


map = L.map("map")
.setView(
    [-1.9441,30.0619],
    13
);



L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{

    attribution:
    "© OpenStreetMap"

}
)
.addTo(map);






// =============================
// LOAD BACKEND DATA
// =============================


async function loadData(){


try{


// Routes

const routesResponse =
await fetch(
`${API}/routes`
);


routes =
await routesResponse.json();




// Stops

const stopsResponse =
await fetch(
`${API}/stops`
);


stops =
await stopsResponse.json();




// Buses

const busesResponse =
await fetch(
`${API}/buses`
);


buses =
await busesResponse.json();





console.log(
"LIVE ROUTES:",
routes
);


console.log(
"LIVE STOPS:",
stops
);


console.log(
"LIVE BUSES:",
buses
);



populateStops();



}
catch(error){


console.error(
"Backend loading error:",
error
);


}


}






// =============================
// POPULATE DROPDOWNS
// =============================


function populateStops(){


originSelect.innerHTML = "";

destSelect.innerHTML = "";



stops.forEach(stop=>{


let cleanName =
stop.stop_name
.replace(" Bus Park","")
.replace(" Taxi Park","")
.replace(" Centre","");



originSelect.add(
new Option(
cleanName,
cleanName
)
);



destSelect.add(
new Option(
cleanName,
cleanName
)
);



});



originSelect.value="Nyabugogo";

destSelect.value="Kacyiru";


updateDashboard();


}







// =============================
// ROUTE + FARE CALCULATION
// =============================


function updateDashboard(){



const origin =
originSelect.value;



const destination =
destSelect.value;



console.log(
"Selected:",
origin,
destination
);




const route =
routes.find(
(r)=>

r.start_point === origin
&&
r.end_point === destination

);





if(!route){


routeNameOutput.textContent =
"No route found";


fareOutput.textContent =
"0 RWF";


distanceOutput.textContent =
"0";


timelineContainer.innerHTML="";


return;

}





routeNameOutput.textContent =
route.route_name;




distanceOutput.textContent =
route.distance;





// Fare
// 50 RWF per KM

const fare =
Number(route.distance) * 50;



fareOutput.textContent =
Math.round(fare)
+
" RWF";






timelineContainer.innerHTML = `


<div class="timeline-node-item">

<h5>
${route.start_point}
</h5>

<p>
Origin
</p>


</div>



<div class="timeline-node-item">


<h5>
${route.end_point}
</h5>


<p>
Destination
</p>


</div>



`;



}





originSelect.addEventListener(
"change",
updateDashboard
);



destSelect.addEventListener(
"change",
updateDashboard
);







// =============================
// LIVE GPS TRACKING
// =============================


async function loadGPS(){



if(buses.length === 0){

return;

}



const busId =
buses[0].bus_id;




try{


const response =
await fetch(
`${API}/gps/${busId}`
);



if(!response.ok){

console.log(
"No GPS data"
);

return;

}




const gps =
await response.json();




console.log(
"LIVE GPS:",
gps
);




const latitude =
Number(
gps.latitude
);



const longitude =
Number(
gps.longitude
);






if(!gpsMarker){



gpsMarker =
L.marker(
[
latitude,
longitude
]
)
.addTo(map);



gpsMarker.bindPopup(`

<b>
Bus ${gps.bus_id}
</b>

<br>

Speed:
${gps.speed} km/h


`);




}

else{


gpsMarker.setLatLng(
[
latitude,
longitude
]
);


}






map.setView(
[
latitude,
longitude
],
15
);




}

catch(error){


console.error(
"GPS ERROR:",
error
);


}



}







// =============================
// POPULAR TRIPS
// =============================


window.selectQuickRoute =
function(
origin,
destination
){



originSelect.value =
origin;



destSelect.value =
destination;



updateDashboard();


};







// =============================
// START APP
// =============================


await loadData();



loadGPS();



setInterval(
loadGPS,
5000
);



});