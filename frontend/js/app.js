/**
 * ==========================================================
 * Kigali Public Transport Tracker - Frontend
 * Production Version
 * ==========================================================
 */

// Render production uses same domain
// Local development fallback
const API =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "/api";


const SHOW_POPULAR_TRIPS = false;


// RURA tariff
const KIGALI_TARIFF_PER_KM = 59.28;
const MINIMUM_FARE = 300;



let stops = [];
let routes = [];
let fares = [];
let gpsLocations = [];


let transitMap = null;
let stopMarkers = [];
let busMarkers = {};
let selectedTripLine = null;
let selectedTripMarkers = [];
let gpsInterval = null;



// ===============================
// API REQUEST
// ===============================

async function fetchJSON(url){

    try{

        const response = await fetch(url);


        if(!response.ok){

            throw new Error(
                `${url} returned ${response.status}`
            );

        }


        return await response.json();


    }catch(error){

        console.error(
            "API ERROR:",
            error
        );

        throw error;

    }

}




// ===============================
// LOAD BACKEND DATA
// ===============================

async function loadData(){


    const [
        stopsData,
        routesData,
        faresData,
        gpsData

    ] = await Promise.all([


        fetchJSON(`${API}/stops`),

        fetchJSON(`${API}/routes`),

        fetchJSON(`${API}/fares`),

        fetchJSON(`${API}/gps`)
            .catch(()=>[])

    ]);



    stops =
        Array.isArray(stopsData)
        ? stopsData
        : [];


    routes =
        Array.isArray(routesData)
        ? routesData
        : [];


    fares =
        Array.isArray(faresData)
        ? faresData
        : [];


    gpsLocations =
        Array.isArray(gpsData)
        ? gpsData
        : [];



    console.log(
        "Loaded:",
        {
            stops:stops.length,
            routes:routes.length,
            buses:gpsLocations.length
        }
    );

}




// ===============================
// START APPLICATION
// ===============================


document.addEventListener(
"DOMContentLoaded",
async()=>{


try{


await loadData();



const originSelect =
document.getElementById(
"originSelect"
);


const destSelect =
document.getElementById(
"destSelect"
);



if(!originSelect || !destSelect){

    console.log(
        "Trip selectors missing"
    );

    return;

}




stops.forEach((stop,index)=>{


const origin =
new Option(
stop.stop_name,
stop.stop_id
);



const destination =
new Option(
stop.stop_name,
stop.stop_id
);



originSelect.add(origin);

destSelect.add(destination);



if(index===0)
origin.selected=true;


if(index===1)
destination.selected=true;



});




if(!SHOW_POPULAR_TRIPS){

const section =
document.querySelector(
".quick-links-section"
);


if(section)
section.style.display="none";


}



initializeMap();



setTimeout(()=>{


renderStopMarkers();

renderBusMarkers();

updateDashboard();



gpsInterval =
setInterval(
updateLiveGPS,
5000
);



originSelect.addEventListener(
"change",
updateDashboard
);



destSelect.addEventListener(
"change",
updateDashboard
);



},500);



}



catch(error){


console.error(
"Frontend loading error:",
error
);



const fare =
document.getElementById(
"fareOutput"
);


const distance =
document.getElementById(
"distanceOutput"
);



const route =
document.getElementById(
"routeNameOutput"
);



if(fare)
fare.textContent =
"Backend unavailable";



if(distance)
distance.textContent =
"0 km";



if(route)
route.textContent =
"API connection failed";


}



});





// ===============================
// MAP
// ===============================


function initializeMap(){


const mapElement =
document.getElementById(
"transitMap"
);



if(!mapElement || typeof L==="undefined")
return;



transitMap =
L.map(
"transitMap"
)
.setView(
[-1.9441,30.0619],
12
);



L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

maxZoom:19,

attribution:
"&copy; OpenStreetMap"

}

).addTo(
transitMap
);



}





// ===============================
// STOPS
// ===============================


function renderStopMarkers(){


if(!transitMap)
return;



stopMarkers.forEach(
marker=>marker.remove()
);


stopMarkers=[];



stops
.filter(hasValidCoordinates)
.forEach(stop=>{


const marker =
L.circleMarker(

[
Number(stop.latitude),
Number(stop.longitude)
],

{

radius:6,

color:"#080c86",

fillOpacity:0.9

}

)

.addTo(transitMap)

.bindPopup(

`
<strong>
${stop.stop_name}
</strong>
`

);



stopMarkers.push(marker);



});



}





// ===============================
// GPS BUS MARKERS
// ===============================


function renderBusMarkers(){


if(!transitMap)
return;



gpsLocations.forEach(location=>{


if(!hasValidCoordinates(location))
return;



const position=[

Number(location.latitude),

Number(location.longitude)

];



if(busMarkers[location.bus_id]){


busMarkers[location.bus_id]
.setLatLng(position);



}

else{


const marker =
L.marker(

position,

{

icon:
L.divIcon({

html:"🚌",

className:
"bus-map-icon",

iconSize:[28,28]

})

}

)

.addTo(transitMap);



busMarkers[location.bus_id]=marker;



}



});



}





// ===============================
// DASHBOARD
// ===============================


function updateDashboard(){


const origin =
document.getElementById(
"originSelect"
);


const destination =
document.getElementById(
"destSelect"
);



if(!origin || !destination)
return;



const start =
stops.find(
s =>
String(s.stop_id)
===
String(origin.value)
);



const end =
stops.find(
s =>
String(s.stop_id)
===
String(destination.value)
);



if(!start || !end)
return;




const distance =
calculateDistanceKm(

Number(start.latitude),

Number(start.longitude),

Number(end.latitude),

Number(end.longitude)

);



const fare =
calculateFare(distance);



const fareOutput =
document.getElementById(
"fareOutput"
);


const distanceOutput =
document.getElementById(
"distanceOutput"
);


const routeOutput =
document.getElementById(
"routeNameOutput"
);



if(fareOutput)
fareOutput.textContent =
`${fare} RWF`;



if(distanceOutput)
distanceOutput.textContent =
`${distance.toFixed(2)} km`;



const route =
findMatchingRoute(
start,
end
);



if(routeOutput)

routeOutput.textContent =
route
?
route.route_name
:
"Estimated direct trip";



}





// ===============================
// GPS REFRESH
// ===============================


async function updateLiveGPS(){


try{


gpsLocations =
await fetchJSON(
`${API}/gps`
);



renderBusMarkers();



}

catch(error){

console.log(
"GPS update failed"
);

}



}





// ===============================
// HELPERS
// ===============================


function calculateDistanceKm(
lat1,
lon1,
lat2,
lon2
){


const R=6371;


const dLat =
toRadians(lat2-lat1);


const dLon =
toRadians(lon2-lon1);



const a =
Math.sin(dLat/2)**2 +

Math.cos(toRadians(lat1)) *

Math.cos(toRadians(lat2)) *

Math.sin(dLon/2)**2;



return R *
2 *
Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
);



}




function calculateFare(distance){


return Math.max(

MINIMUM_FARE,

Math.round(
distance*KIGALI_TARIFF_PER_KM
)

);


}





function findMatchingRoute(
origin,
destination
){


return routes.find(route=>{


const name =
String(
route.route_name || ""
)
.toLowerCase();



return (

name.includes(
origin.stop_name
.toLowerCase()
.split(" ")[0]
)

&&

name.includes(
destination.stop_name
.toLowerCase()
.split(" ")[0]
)

);



});


}




function hasValidCoordinates(item){


return item &&

!isNaN(
Number(item.latitude)
)

&&

!isNaN(
Number(item.longitude)
);



}




function toRadians(value){

return value *
Math.PI /
180;

}