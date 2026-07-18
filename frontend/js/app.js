const API_URL = "http://localhost:3000/api";


document.addEventListener("DOMContentLoaded", () => {

    const originSelect = document.getElementById("originSelect");
    const destSelect = document.getElementById("destSelect");

    if (!originSelect || !destSelect) return;


    const fareOutput = document.getElementById("fareOutput");
    const distanceOutput = document.getElementById("distanceOutput");
    const routeNameOutput = document.getElementById("routeNameOutput");
    const timelineContainer = document.getElementById("timelineContainer");
    const busMarker = document.getElementById("liveBusMarker");
    const mapLabel = document.getElementById("mapPlaceholderText");


    let routes = [];
    let buses = [];


    async function loadBackendData(){

        try{

            const routesResponse = await fetch(
                `${API_URL}/routes`
            );

            routes = await routesResponse.json();


            const busesResponse = await fetch(
                `${API_URL}/buses`
            );

            buses = await busesResponse.json();


            loadStops();


        }catch(error){

            console.error(
                "Backend connection error:",
                error
            );

        }

    }



    function loadStops(){

        originSelect.innerHTML="";
        destSelect.innerHTML="";


        routes.forEach((route,index)=>{


            originSelect.add(
                new Option(
                    route.origin,
                    route.origin
                )
            );


            destSelect.add(
                new Option(
                    route.destination,
                    route.destination
                )
            );


        });


        updateDashboard();

    }




    function updateDashboard(){


        const origin =
        originSelect.value;


        const destination =
        destSelect.value;



        const route =
        routes.find(
            r =>
            r.origin === origin &&
            r.destination === destination
        );



        if(!route){

            routeNameOutput.textContent =
            "No route available";

            return;

        }



        routeNameOutput.textContent =
        `${route.route_name}: ${origin} → ${destination}`;



        distanceOutput.textContent =
        route.distance;



        const fare =
        Math.round(route.distance * 60);



        fareOutput.textContent =
        `${fare} RWF`;



        timelineContainer.innerHTML = `

        <div class="timeline-node-item node-active">

            <h5>${origin}</h5>
            <p>Starting point</p>

        </div>


        <div class="timeline-node-item">

            <h5>${destination}</h5>
            <p>Destination</p>

        </div>

        `;



        if(buses.length > 0){

            busMarker.classList.add(
                "is-visible"
            );


            mapLabel.classList.add(
                "is-hidden"
            );

        }


    }



    originSelect.addEventListener(
        "change",
        updateDashboard
    );


    destSelect.addEventListener(
        "change",
        updateDashboard
    );



    async function getGPS(){


        if(buses.length === 0)
            return;



        const busId =
        buses[0].id;



        try{

            const response =
            await fetch(
                `${API_URL}/gps/${busId}`
            );


            const gps =
            await response.json();



            console.log(
                "Live GPS:",
                gps
            );


        }catch(error){

            console.log(
                "No GPS data yet"
            );

        }


    }



    loadBackendData();


    setInterval(
        getGPS,
        5000
    );


});