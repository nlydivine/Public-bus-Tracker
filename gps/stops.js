// Kigali Bus Stops — for use with Leaflet (L.marker)
// Coordinate accuracy varies by entry:
//  - Landmarks (bus parks, hospitals, stadiums, markets, the airport) are
//    reasonably accurate best-effort estimates.
//  - Cell/neighborhood-level entries are rough positions offset within their
//    parent sector so they don't stack on one pin — treat these as
//    approximate, not survey-grade. Verify anything critical via Google Maps.

const busStops = [

  // =========================================================
  // NYARUGENGE DISTRICT
  // =========================================================

  // Muhima sector
  { name: "Nyabugogo Bus Park", lat: -1.9366, lng: 30.0605 },
  { name: "Nyabugogo Taxi Park", lat: -1.9370, lng: 30.0615 },
  { name: "Gakinjiro Market", lat: -1.9380, lng: 30.0590 },
  { name: "Muhima Health Center", lat: -1.9450, lng: 30.0500 },
  { name: "Kiyovu", lat: -1.9460, lng: 30.0580 },
  { name: "Sainte-Famille Church", lat: -1.9470, lng: 30.0600 },

  // Kigali sector (CBD + cells)
  { name: "Kigali City Tower (CBD)", lat: -1.9441, lng: 30.0619 },
  { name: "Kigali City Market", lat: -1.9445, lng: 30.0625 },
  { name: "Hotel des Mille Collines", lat: -1.9455, lng: 30.0610 },
  { name: "Union Trade Center (UTC)", lat: -1.9448, lng: 30.0630 },
  { name: "Kankuba", lat: -1.9430, lng: 30.0600 },
  { name: "Kavumu", lat: -1.9500, lng: 30.0560 },
  { name: "Ntungama", lat: -1.9520, lng: 30.0540 },
  { name: "Runzenze", lat: -1.9480, lng: 30.0520 },
  { name: "Nyarurenzi", lat: -1.9550, lng: 30.0500 },
  { name: "Mataba", lat: -1.9580, lng: 30.0480 },
  { name: "Nyarufunzo", lat: -1.9600, lng: 30.0460 },

  // Nyarugenge sector
  { name: "Nyarugenge Market", lat: -1.9480, lng: 30.0580 },
  { name: "Rugenge", lat: -1.9490, lng: 30.0570 },

  // Nyamirambo sector (cells: Cyivugiza, Gasharu, Mumena, Rugarama)
  { name: "Nyamirambo Stadium", lat: -1.9750, lng: 30.0380 },
  { name: "Biryogo (Mumena)", lat: -1.9740, lng: 30.0390 },
  { name: "Kabusunzu (Gasharu)", lat: -1.9770, lng: 30.0360 },
  { name: "Onatracom Masjid Al Fat'h Mosque (Cyivugiza)", lat: -1.9780, lng: 30.0400 },
  { name: "Rugarama (Nyamirambo)", lat: -1.9800, lng: 30.0350 },

  // Kimisagara sector (cells: Kamuhoza, Katabaro, Kimisagara)
  { name: "Kimisagara Market", lat: -1.9450, lng: 30.0350 },
  { name: "Kimisagara Stadium", lat: -1.9460, lng: 30.0340 },
  { name: "Kamuhoza Primary School", lat: -1.9430, lng: 30.0320 },
  { name: "Katabaro", lat: -1.9470, lng: 30.0300 },

  // Kanyinya sector
  { name: "Kanyinya Centre", lat: -1.9200, lng: 30.0350 },
  { name: "Nyakabungo", lat: -1.9150, lng: 30.0300 },

  // Gitega sector
  { name: "Gitega Centre", lat: -1.9550, lng: 30.0480 },
  { name: "Rwampara", lat: -1.9560, lng: 30.0460 },

  // Nyakabanda sector (cells: Munanira I/II, Nyakabanda I/II)
  { name: "Nyakabanda Market", lat: -1.9700, lng: 30.0350 },
  { name: "Kigali Pelé Stadium", lat: -1.9660, lng: 30.0400 },
  { name: "Munanira I", lat: -1.9720, lng: 30.0330 },
  { name: "Munanira II", lat: -1.9740, lng: 30.0310 },

  // Rwezamenyo sector (cells: Rwezamenyo I/II, Kabuguru I/II)
  { name: "Rwezamenyo I", lat: -1.9680, lng: 30.0420 },
  { name: "Rwezamenyo II", lat: -1.9690, lng: 30.0430 },
  { name: "Kabuguru I", lat: -1.9670, lng: 30.0410 },
  { name: "Kabuguru II", lat: -1.9660, lng: 30.0400 },

  // Mageragere sector
  { name: "Mageragere Centre", lat: -1.9900, lng: 30.0100 },
  { name: "Nyakinama", lat: -1.9950, lng: 30.0080 },
  { name: "Mount Kigali Forest area", lat: -1.9850, lng: 30.0050 },

  // =========================================================
  // GASABO DISTRICT
  // =========================================================

  // Kacyiru sector (cells: Kamatamu, Kamutwa, Kibaza)
  { name: "Kacyiru Centre", lat: -1.9500, lng: 30.0900 },
  { name: "Ministries Roundabout", lat: -1.9490, lng: 30.0890 },
  { name: "Kacyiru Hospital (CHUK Annex)", lat: -1.9510, lng: 30.0910 },
  { name: "King Faisal Hospital", lat: -1.9520, lng: 30.0870 },
  { name: "Inema Arts Center", lat: -1.9480, lng: 30.0920 },

  // Kimihurura sector (cells: Kamukina, Kimihurura, Rugando)
  { name: "Kimihurura Centre", lat: -1.9560, lng: 30.0930 },
  { name: "Kigali Convention Centre", lat: -1.9540, lng: 30.0920 },
  { name: "Anti-Corruption Monument", lat: -1.9545, lng: 30.0925 },
  { name: "Chamber of Deputies", lat: -1.9570, lng: 30.0940 },
  { name: "Nyarutarama Road area", lat: -1.9500, lng: 30.0950 },

  // Remera sector (cells: Rukiri I/II, Nyabisindu, Nyarutarama)
  { name: "Remera Bus Stop", lat: -1.9441, lng: 30.1044 },
  { name: "Amahoro Stadium", lat: -1.9460, lng: 30.1080 },
  { name: "BK Arena", lat: -1.9480, lng: 30.1060 },
  { name: "Giporoso", lat: -1.9420, lng: 30.1020 },
  { name: "Nyabisindu", lat: -1.9400, lng: 30.1000 },
  { name: "Nyarutarama", lat: -1.9350, lng: 30.0980 },
  { name: "Gishushu", lat: -1.9330, lng: 30.0960 },
  { name: "Kangondo", lat: -1.9310, lng: 30.0940 },

  // Kimironko sector (cells: Bibare, Kibagabaga, Nyagatovu)
  { name: "Kimironko Bus Stop", lat: -1.9497, lng: 30.1297 },
  { name: "Kimironko Market", lat: -1.9500, lng: 30.1290 },
  { name: "Kibagabaga Hospital", lat: -1.9450, lng: 30.1250 },
  { name: "Zindiro road area", lat: -1.9420, lng: 30.1220 },
  { name: "Nyagatovu", lat: -1.9550, lng: 30.1320 },

  // Gisozi sector (cells: Musezero, Ruhango)
  { name: "Kigali Genocide Memorial", lat: -1.9346, lng: 30.0606 },
  { name: "Gisozi Centre", lat: -1.9340, lng: 30.0620 },
  { name: "Gakinjiro (Gisozi side)", lat: -1.9300, lng: 30.0640 },

  // Kinyinya sector (cells include: Kagugu, Gasharu)
  { name: "Kagugu", lat: -1.9250, lng: 30.1000 },
  { name: "Gacuriro", lat: -1.9280, lng: 30.1050 },
  { name: "Kinyinya Centre", lat: -1.9270, lng: 30.1030 },
  { name: "Green City project site", lat: -1.9200, lng: 30.1080 },

  // Nduba sector
  { name: "Nduba Landfill area", lat: -1.8900, lng: 30.1100 },
  { name: "Nduba Centre", lat: -1.8880, lng: 30.1080 },

  // Jabana sector
  { name: "Jabana Centre", lat: -1.8950, lng: 30.0450 },
  { name: "Jabana Power Plant area", lat: -1.8970, lng: 30.0430 },

  // Jali sector
  { name: "Jali Centre", lat: -1.8700, lng: 30.0500 },
  { name: "Mont Jali area", lat: -1.8650, lng: 30.0520 },

  // Bumbogo sector
  { name: "Bumbogo Centre", lat: -1.9180, lng: 30.1080 },
  { name: "Kigali Innovation City", lat: -1.9150, lng: 30.1100 },
  { name: "IT Park (Bumbogo)", lat: -1.9160, lng: 30.1090 },

  // Gikomero sector
  { name: "Gikomero Centre", lat: -1.8800, lng: 30.1900 },

  // Ndera sector
  { name: "Ndera Centre", lat: -1.9300, lng: 30.1650 },
  { name: "Masoro", lat: -1.9250, lng: 30.1700 },

  // Rutunga sector
  { name: "Rutunga Centre", lat: -1.8600, lng: 30.0850 },

  // Rusororo sector
  { name: "Rusororo Centre", lat: -1.9450, lng: 30.1850 },
  { name: "Zindiro", lat: -1.9400, lng: 30.1800 },
  { name: "Nyarurama", lat: -1.9500, lng: 30.1900 },

  // Gatsata sector
  { name: "Gatsata Centre", lat: -1.9100, lng: 30.0550 },
  { name: "Batsinda", lat: -1.9050, lng: 30.0500 },

  // =========================================================
  // KICUKIRO DISTRICT
  // =========================================================

  // Kicukiro sector
  { name: "Kicukiro Centre", lat: -1.9837, lng: 30.1012 },
  { name: "Kicukiro Bus Park", lat: -1.9840, lng: 30.1020 },
  { name: "Sonatubes", lat: -1.9820, lng: 30.1000 },

  // Kanombe sector — distinct real places
  { name: "Kanombe Trading Centre", lat: -1.9720, lng: 30.1400 },
  { name: "Kigali International Airport", lat: -1.9686, lng: 30.1395 },
  { name: "Camp Kanombe (military)", lat: -1.9750, lng: 30.1450 },
  { name: "Kabeza", lat: -1.9720, lng: 30.1150 },
  { name: "Busanza", lat: -1.9850, lng: 30.1600 },

  // Gikondo sector
  { name: "Gikondo Centre", lat: -1.9740, lng: 30.0730 },
  { name: "Gikondo Industrial Park", lat: -1.9760, lng: 30.0710 },
  { name: "Sonatube Roundabout", lat: -1.9730, lng: 30.0750 },

  // Nyarugunga sector
  { name: "Rwandex", lat: -1.9700, lng: 30.0850 },
  { name: "Nyarugunga Centre", lat: -1.9720, lng: 30.0870 },
  { name: "Nyanza Genocide Memorial", lat: -1.9910, lng: 30.1150 },

  // Kagarama sector
  { name: "Kagarama Centre", lat: -1.9900, lng: 30.0950 },

  // Kigarama sector
  { name: "Kigarama Centre", lat: -1.9950, lng: 30.0700 },

  // Niboye sector
  { name: "Niboye Centre", lat: -1.9950, lng: 30.0900 },

  // Gatenga sector
  { name: "Gatenga Centre", lat: -2.0000, lng: 30.0850 },

  // Masaka sector
  { name: "Masaka Centre", lat: -1.9980, lng: 30.1550 },
  { name: "Rebero", lat: -1.9950, lng: 30.1080 },
  { name: "Rebero Genocide Memorial", lat: -1.9960, lng: 30.1090 },

  // Gahanga sector
  { name: "Gahanga Centre", lat: -2.0400, lng: 30.1100 },
  { name: "Gahanga Stadium", lat: -2.0430, lng: 30.1130 },

  // =========================================================
  // JUST OUTSIDE THE CITY
  // =========================================================
  { name: "Kabuga Trading Centre", lat: -1.9550, lng: 30.2100 },
];

// Display all bus stops
busStops.forEach(stop => {
    L.marker([stop.lat, stop.lng])
        .addTo(map)
        .bindPopup(stop.name);
});
module.exports = busStops;