// Kigali Bus Stops — for use with Leaflet (L.marker)
// Coordinates are best-effort approximations for well-known stops/landmarks.
// IMPORTANT: verify/refine these against Google Maps (drop-a-pin) or actual
// GPS readings before relying on them for real navigation.

const busStops = [
  // Nyarugenge District
  { name: "Nyabugogo Bus Park", lat: -1.9366, lng: 30.0605 },
  { name: "Kigali City Tower (CBD)", lat: -1.9441, lng: 30.0619 },
  { name: "Nyarugenge Market", lat: -1.9480, lng: 30.0580 },
  { name: "Nyamirambo Stadium", lat: -1.9750, lng: 30.0380 },
  { name: "Kimisagara Market", lat: -1.9450, lng: 30.0350 },
  { name: "Nyakabanda Market", lat: -1.9700, lng: 30.0350 },
  { name: "Muhima Health Center", lat: -1.9450, lng: 30.0500 },
  { name: "Kigali Pelé Stadium", lat: -1.9660, lng: 30.0400 },

  // Gasabo District
  { name: "Kacyiru Centre", lat: -1.9500, lng: 30.0900 },
  { name: "Kimihurura Centre", lat: -1.9560, lng: 30.0930 },
  { name: "Kigali Convention Centre", lat: -1.9540, lng: 30.0920 },
  { name: "Remera Bus Stop", lat: -1.9441, lng: 30.1044 },
  { name: "Amahoro Stadium", lat: -1.9460, lng: 30.1080 },
  { name: "BK Arena", lat: -1.9480, lng: 30.1060 },
  { name: "Kimironko Bus Stop", lat: -1.9497, lng: 30.1297 },
  { name: "Kimironko Market", lat: -1.9500, lng: 30.1290 },
  { name: "Kigali Genocide Memorial (Gisozi)", lat: -1.9346, lng: 30.0606 },
  { name: "Kinyinya Centre", lat: -1.9280, lng: 30.1050 },
  { name: "Kigali Innovation City (Bumbogo)", lat: -1.9180, lng: 30.1080 },

  // Kicukiro District
  { name: "Kicukiro Centre", lat: -1.9837, lng: 30.1012 },
  { name: "Kanombe Bus Stop", lat: -1.9754, lng: 30.1712 },
  { name: "Kigali International Airport", lat: -1.9686, lng: 30.1395 },
  { name: "Gikondo Centre", lat: -1.9740, lng: 30.0730 },
  { name: "Rwandex (Nyarugunga)", lat: -1.9700, lng: 30.0850 },
  { name: "Masaka Centre", lat: -1.9980, lng: 30.1550 },
  { name: "Rebero", lat: -1.9950, lng: 30.1080 },
  { name: "Gahanga Stadium", lat: -2.0430, lng: 30.1130 },

  // Just outside the city
  { name: "Kabuga Trading Centre", lat: -1.9550, lng: 30.2100 },
];

// Display all bus stops
busStops.forEach(stop => {
    L.marker([stop.lat, stop.lng])
        .addTo(map)
        .bindPopup(stop.name);
});
