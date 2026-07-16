// GPS Geolocation Integration

function getUserLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            // Display coordinates if these elements exist
            const latElement = document.getElementById("latitude");
            const lngElement = document.getElementById("longitude");

            if (latElement) latElement.textContent = latitude;
            if (lngElement) lngElement.textContent = longitude;

            // Save coordinates in local storage
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);

            // TODO: Connect this to your map or backend API
        },
        function(error) {
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
                    alert("An unknown error occurred.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Live GPS tracking
function startTracking() {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(function(position) {
        console.log(
            "Updated Location:",
            position.coords.latitude,
            position.coords.longitude
        );
    });
}

// Start GPS automatically
getUserLocation();
