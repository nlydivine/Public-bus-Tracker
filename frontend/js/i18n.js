/**
 * Used by index.html and app.html. The Static page text is translated by
 * tagging the elements with data-i18n="section.key" and chainging the  textContent.
 */

const TRANSLATIONS = {
  en: {
    home: {
      badge: "ALU Foundations Project · BSc. Software Engineering",
      tagline: "The Kigali Public Transport Tracker",
      headline: "Bridging the information gap for Kigali commuters.",
      heroCopy: "An intuitive, mobile-friendly platform that gives riders distance-based fare estimates, clear route structures, and arrival predictions — before they even reach the stage.",
      cta: "Launch Application Dashboard",
      feature1Title: "Route lookup",
      feature1Desc: "Find the right bus or moto route to any part of the city.",
      feature2Title: "Fare estimator",
      feature2Desc: "See an estimated fare by distance before you board.",
      feature3Title: "Arrival times",
      feature3Desc: "Live predictions so waiting at the stage is one less guess.",
      teamLabel: "Project development engineering team",
      footer: "Adhering to Rwanda Law No 058/2021 relating to the Protection of Personal Data and Privacy. Supports anonymous access."
    },
    app: {
      badge: "Sample data · backend not yet connected",
      plannerLabel: "Plan a trip",
      plannerHeading: "Where are you headed?",
      plannerIntro: "Pick a starting stop and a destination to see the fare, route, and schedule.",
      originAria: "Origin stop",
      destAria: "Destination stop",
      quickLinksLabel: "Popular trips",
      quickRoute1: "🚌 Nyabugogo → Kacyiru (Route 81)",
      quickRoute2: "🚌 Downtown → Kimironko (Route 102)",
      fareLabel: "Estimated fare",
      distanceLabel: "Distance:",
      distanceUnit: "km",
      mapLabel: "Live map preview",
      mapTag: "Preview only",
      mapDefault: "Choose a trip to preview it here",
      routeLabel: "Route",
      routeDefault: "Choose a starting stop and destination",
      firstDepartureLabel: "First departure:",
      frequencyLabel: "Every:",
      invalidFare: "Pick two different stops",
      invalidRouteName: "Origin and destination must differ",
      invalidTimelineMsg: "Choose a different starting stop or destination.",
      boardingStopLabel: "Your boarding stop",
      customTripRouteName: "Custom trip (no direct route in sample data)",
      customTripMapLabel: "No sample route covers this pair yet",
      destinationLabel: "Destination"
    },
    stops: {
      nyabugogo: { name: "Nyabugogo Bus Station", desc: "Central hub terminal" },
      kimisagara: { name: "Kimisagara Hub", desc: "Local neighborhood connector" },
      muhima: { name: "Muhima Stop", desc: "Intermediary corridor point" },
      remera: { name: "Remera Terminal", desc: "Airport corridor junction" },
      kacyiru: { name: "Kacyiru District Terminal", desc: "Government sector plaza" },
      kimironko: { name: "Kimironko Hub", desc: "Main market connection point" },
      downtown: { name: "Downtown CBD", desc: "Central business district" }
    },
    routes: {
      r81: { name: "Route 81", longName: "Nyabugogo → Kacyiru", firstDeparture: "6:00 AM", frequency: "15-20 min" },
      r102: { name: "Route 102", longName: "Downtown → Kimironko", firstDeparture: "5:30 AM", frequency: "10-15 min" }
    }
  },

  rw: {
    home: {
      badge: "Umushinga wa ALU Foundations · BSc. Software Engineering",
      tagline: "Igikoresho gikurikirana ubwikorezi rusange bwa Kigali",
      headline: "Kuzuza icyuho cy'amakuru ku bagenzi bo muri Kigali.",
      heroCopy: "Urubuga rworoshye gukoreshwa kuri telefoni, rutanga ku bagenzi igiciro cyagereranyijwe hashingiwe ku ntera, inzira zisobanutse, n'amakuru y'igihe bazagera — mbere yo kugera aho bahagarara.",
      cta: "Fungura Porogaramu",
      feature1Title: "Gushaka inzira",
      feature1Desc: "Shakisha inzira ya bisi cyangwa moto ijya aho ushaka mu mujyi.",
      feature2Title: "Kubara igiciro",
      feature2Desc: "Reba igiciro cyagereranyijwe hashingiwe ku ntera mbere yo kuzamuka.",
      feature3Title: "Igihe zizagera",
      feature3Desc: "Amakuru y'igihe nyacyo kugira ngo utegereza igihe gito gusa.",
      teamLabel: "Itsinda ryakoze uyu mushinga",
      footer: "Dukurikije Itegeko ry'u Rwanda N° 058/2021 rigenga kurengera amakuru bwite. Dushyigikiye kwinjira nta kwiyandikisha bisabwa."
    },
    app: {
      badge: "Amakuru y'urugero · seriveri ntiraboneka",
      plannerLabel: "Tegura urugendo",
      plannerHeading: "Ujya he?",
      plannerIntro: "Hitamo aho utangirira n'aho ugana kugira ngo urebe igiciro, inzira, n'amasaha.",
      originAria: "Aho utangirira",
      destAria: "Aho ugana",
      quickLinksLabel: "Ingendo zikunzwe",
      quickRoute1: "🚌 Nyabugogo → Kacyiru (Inzira 81)",
      quickRoute2: "🚌 Downtown → Kimironko (Inzira 102)",
      fareLabel: "Igiciro cyagereranyijwe",
      distanceLabel: "Intera:",
      distanceUnit: "km",
      mapLabel: "Ikarita (Igerageza)",
      mapTag: "Kugerageza gusa",
      mapDefault: "Hitamo urugendo kugira ngo urubone hano",
      routeLabel: "Inzira",
      routeDefault: "Hitamo aho utangirira n'aho ugana",
      firstDepartureLabel: "Igihe cy'ubwa mbere:",
      frequencyLabel: "Buri:",
      invalidFare: "Hitamo ahantu hatandukanye",
      invalidRouteName: "Aho utangirira n'aho ugana bigomba gutandukana",
      invalidTimelineMsg: "Hitamo ahandi utangirira cyangwa ugana.",
      boardingStopLabel: "Aho uzazamukira",
      customTripRouteName: "Urugendo rwihariye (nta nzira iboneka mu makuru y'urugero)",
      customTripMapLabel: "Nta nzira y'urugero ihuza aha uvuye n'aho ugana",
      destinationLabel: "Aho ugana"
    },
    stops: {
      nyabugogo: { name: "Nyabugogo Bus Station", desc: "Ihuriro rikuru" },
      kimisagara: { name: "Kimisagara Hub", desc: "Ihuza ry'umudugudu" },
      muhima: { name: "Muhima Stop", desc: "Ahantu ho hagati mu nzira" },
      remera: { name: "Remera Terminal", desc: "Ahahurira n'inzira ijya ku kibuga cy'indege" },
      kacyiru: { name: "Kacyiru District Terminal", desc: "Ahabanza h'inzego za Leta" },
      kimironko: { name: "Kimironko Hub", desc: "Ihuriro rigana ku isoko" },
      downtown: { name: "Downtown CBD", desc: "Akarere k'ubucuruzi bukuru" }
    },
    routes: {
      r81: { name: "Inzira 81", longName: "Nyabugogo → Kacyiru", firstDeparture: "6:00", frequency: "iminota 15-20" },
      r102: { name: "Inzira 102", longName: "Downtown → Kimironko", firstDeparture: "5:30", frequency: "iminota 10-15" }
    }
  }
};

let currentLang = localStorage.getItem("transitx-lang") || "en";

function getCurrentLang() {
  return currentLang;
}

function resolveKey(lang, dottedKey) {
  return dottedKey.split(".").reduce((obj, part) => (obj ? obj[part] : undefined), TRANSLATIONS[lang]);
}

function applyStaticTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = resolveKey(lang, el.getAttribute("data-i18n"));
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const value = resolveKey(lang, el.getAttribute("data-i18n-aria"));
    if (value) el.setAttribute("aria-label", value);
  });

  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("transitx-lang", lang);
  applyStaticTranslations(lang);
  // app.js hooks into this to render dynamic content anytime  the language changes.
  if (typeof window.onLanguageChange === "function") {
    window.onLanguageChange(lang);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-option").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });
  applyStaticTranslations(currentLang);
});