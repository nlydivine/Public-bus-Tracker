// GPS Geolocation Integration with Leaflet

function getUserLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            // Save location
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);

            // Move the map to the user's location
            map.setView([latitude, longitude], 16);

            // Add a marker
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("You are here")
                .openPopup();
        },

        function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("Location permission denied.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("Location request timed out.");
                    break;
                default:
                    alert("Unknown error.");
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function startTracking() {
    navigator.geolocation.watchPosition(function (position) {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        map.setView([latitude, longitude]);

    });
}

getUserLocation();
