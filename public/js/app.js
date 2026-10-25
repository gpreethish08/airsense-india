/**
 * AirSense India - Web Application Client Logic
 * Author: Preethish (College Project)
 * Real-time CPCB & IQAir AQI monitoring, Major Air Pollutants, Air Quality Calendar & CPCB Calculator
 * Covers ALL 28 Indian States & 8 Union Territories
 */

// CPCB Breakpoints: [B_lo, B_hi, I_lo, I_hi]
const CPCB_BREAKPOINTS = {
  pm25: [
    [0.0, 30.0, 0, 50],
    [30.1, 60.0, 51, 100],
    [60.1, 90.0, 101, 200],
    [90.1, 120.0, 201, 300],
    [120.1, 250.0, 301, 400],
    [250.1, 500.0, 401, 500]
  ],
  pm10: [
    [0.0, 50.0, 0, 50],
    [50.1, 100.0, 51, 100],
    [100.1, 250.0, 101, 200],
    [250.1, 350.0, 201, 300],
    [350.1, 430.0, 301, 400],
    [430.1, 500.0, 401, 500]
  ],
  no2: [
    [0.0, 40.0, 0, 50],
    [40.1, 80.0, 51, 100],
    [80.1, 180.0, 101, 200],
    [180.1, 280.0, 201, 300],
    [280.1, 400.0, 301, 400],
    [400.1, 500.0, 401, 500]
  ],
  so2: [
    [0.0, 40.0, 0, 50],
    [40.1, 80.0, 51, 100],
    [80.1, 380.0, 101, 200],
    [380.1, 800.0, 201, 300],
    [800.1, 1600.0, 301, 400],
    [1600.1, 2000.0, 401, 500]
  ],
  co: [
    [0.0, 1.0, 0, 50],
    [1.01, 2.0, 51, 100],
    [2.01, 10.0, 101, 200],
    [10.01, 17.0, 201, 300],
    [17.01, 34.0, 301, 400],
    [34.01, 50.0, 401, 500]
  ],
  o3: [
    [0.0, 50.0, 0, 50],
    [50.1, 100.0, 51, 100],
    [100.1, 168.0, 101, 200],
    [168.1, 208.0, 201, 300],
    [208.1, 748.0, 301, 400],
    [748.1, 1000.0, 401, 500]
  ],
  nh3: [
    [0.0, 200.0, 0, 50],
    [200.1, 400.0, 51, 100],
    [400.1, 800.0, 101, 200],
    [800.1, 1200.0, 201, 300],
    [1200.1, 1800.0, 301, 400],
    [1800.1, 2000.0, 401, 500]
  ]
};

// All 28 Indian States & 8 Union Territories Comprehensive Telemetry Dataset
const INDIAN_CITIES_LIST = [
  // National Capital Region
  { id: "delhi", name: "Delhi NCR", state: "Delhi (NCT)", lat: 28.6139, lon: 77.2090, aqi: 166, cat: "Unhealthy", pm25: 78, pm10: 159, co: 2661, so2: 5, no2: 3, o3: 4, rank: 74, temp: 34.0, humidity: 17, wind: 10.4, station: "Anand Vihar CAAQMS Station, Delhi" },
  
  // 28 Indian States
  { id: "amaravati", name: "Amaravati", state: "Andhra Pradesh", lat: 16.5417, lon: 80.5158, aqi: 72, cat: "Moderate", pm25: 46, pm10: 74, co: 800, so2: 13, no2: 24, o3: 22, rank: 138, temp: 30.5, humidity: 72, wind: 12.0, station: "Secretariat CAAQMS, Amaravati" },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, aqi: 72, cat: "Moderate", pm25: 44, pm10: 72, co: 900, so2: 17, no2: 29, o3: 21, rank: 138, temp: 29.8, humidity: 76, wind: 15.2, station: "Gajuwaka CAAQMS, Visakhapatnam" },
  { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lon: 93.6053, aqi: 35, cat: "Good", pm25: 22, pm10: 38, co: 400, so2: 5, no2: 12, o3: 15, rank: 210, temp: 21.0, humidity: 68, wind: 5.2, station: "Ganga Lake CAAQMS, Itanagar" },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, aqi: 115, cat: "Poor", pm25: 88, pm10: 142, co: 1200, so2: 11, no2: 31, o3: 25, rank: 101, temp: 24.8, humidity: 72, wind: 6.4, station: "Railway Colony CAAQMS, Guwahati" },
  { id: "patna", name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, aqi: 195, cat: "Unhealthy", pm25: 185, pm10: 295, co: 2900, so2: 26, no2: 69, o3: 45, rank: 62, temp: 25.0, humidity: 68, wind: 4.9, station: "Samarpal CAAQMS Station, Patna" },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, aqi: 140, cat: "Poor", pm25: 92, pm10: 158, co: 1700, so2: 26, no2: 44, o3: 33, rank: 90, temp: 28.2, humidity: 54, wind: 8.3, station: "AIIMS CAAQMS, Raipur" },
  { id: "panaji", name: "Panaji", state: "Goa", lat: 15.4909, lon: 73.8278, aqi: 42, cat: "Good", pm25: 28, pm10: 48, co: 600, so2: 8, no2: 16, o3: 20, rank: 195, temp: 31.0, humidity: 80, wind: 15.0, station: "Kadamba Bus Stand CAAQMS, Panaji" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, aqi: 142, cat: "Poor", pm25: 94, pm10: 164, co: 1600, so2: 24, no2: 49, o3: 39, rank: 89, temp: 31.0, humidity: 44, wind: 8.1, station: "Maninagar CAAQMS Station, Ahmedabad" },
  { id: "surat", name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, aqi: 125, cat: "Poor", pm25: 78, pm10: 132, co: 1400, so2: 21, no2: 42, o3: 31, rank: 94, temp: 30.5, humidity: 66, wind: 11.5, station: "SVNIT CAAQMS, Surat" },
  { id: "gurugram", name: "Gurugram", state: "Haryana", lat: 28.4595, lon: 77.0266, aqi: 182, cat: "Unhealthy", pm25: 164, pm10: 260, co: 2700, so2: 20, no2: 68, o3: 42, rank: 70, temp: 24.8, humidity: 60, wind: 6.5, station: "Vikas Sadan CAAQMS, Gurugram" },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, aqi: 38, cat: "Good", pm25: 26, pm10: 42, co: 500, so2: 6, no2: 15, o3: 19, rank: 205, temp: 16.5, humidity: 48, wind: 7.8, station: "The Ridge CAAQMS Station, Shimla" },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, aqi: 128, cat: "Poor", pm25: 84, pm10: 136, co: 1400, so2: 17, no2: 38, o3: 28, rank: 93, temp: 26.0, humidity: 56, wind: 8.0, station: "Doranda CAAQMS Station, Ranchi" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, aqi: 62, cat: "Moderate", pm25: 38, pm10: 62, co: 800, so2: 8, no2: 26, o3: 22, rank: 145, temp: 23.0, humidity: 55, wind: 11.2, station: "Hebbal CAAQMS Station, Bengaluru" },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366, aqi: 44, cat: "Good", pm25: 30, pm10: 50, co: 600, so2: 7, no2: 18, o3: 17, rank: 190, temp: 29.5, humidity: 84, wind: 14.2, station: "Plammoodu CAAQMS, Thiruvananthapuram" },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, aqi: 45, cat: "Good", pm25: 32, pm10: 52, co: 600, so2: 7, no2: 19, o3: 18, rank: 185, temp: 29.0, humidity: 82, wind: 13.8, station: "Vyttila CAAQMS Station, Kochi" },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, aqi: 92, cat: "Moderate", pm25: 66, pm10: 115, co: 1100, so2: 13, no2: 34, o3: 27, rank: 120, temp: 27.2, humidity: 49, wind: 9.0, station: "Paryavaran Parisar, Bhopal" },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, aqi: 98, cat: "Moderate", pm25: 72, pm10: 124, co: 1300, so2: 15, no2: 37, o3: 29, rank: 116, temp: 27.6, humidity: 47, wind: 9.8, station: "Chhoti Gwaltoli CAAQMS, Indore" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, aqi: 118, cat: "Poor", pm25: 68, pm10: 118, co: 1200, so2: 15, no2: 44, o3: 28, rank: 98, temp: 30.2, humidity: 78, wind: 14.5, station: "BKC Bandra CAAQMS Station, Mumbai" },
  { id: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, aqi: 88, cat: "Moderate", pm25: 54, pm10: 88, co: 1000, so2: 14, no2: 32, o3: 26, rank: 124, temp: 26.2, humidity: 58, wind: 10.3, station: "Shivajinagar CAAQMS, Pune" },
  { id: "imphal", name: "Imphal", state: "Manipur", lat: 24.8170, lon: 93.9368, aqi: 48, cat: "Good", pm25: 36, pm10: 58, co: 700, so2: 7, no2: 17, o3: 21, rank: 182, temp: 23.5, humidity: 70, wind: 5.8, station: "DM College CAAQMS, Imphal" },
  { id: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.5788, lon: 91.8933, aqi: 36, cat: "Good", pm25: 24, pm10: 40, co: 500, so2: 5, no2: 14, o3: 16, rank: 208, temp: 18.0, humidity: 76, wind: 6.2, station: "Laban CAAQMS Station, Shillong" },
  { id: "aizawl", name: "Aizawl", state: "Mizoram", lat: 23.7271, lon: 92.7176, aqi: 30, cat: "Good", pm25: 19, pm10: 34, co: 400, so2: 4, no2: 10, o3: 14, rank: 220, temp: 22.0, humidity: 65, wind: 4.8, station: "Chanmari CAAQMS Station, Aizawl" },
  { id: "kohima", name: "Kohima", state: "Nagaland", lat: 25.6751, lon: 94.1086, aqi: 40, cat: "Good", pm25: 28, pm10: 46, co: 600, so2: 6, no2: 16, o3: 18, rank: 202, temp: 20.0, humidity: 72, wind: 5.4, station: "PR Hill CAAQMS Station, Kohima" },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245, aqi: 82, cat: "Moderate", pm25: 62, pm10: 104, co: 1100, so2: 16, no2: 32, o3: 26, rank: 128, temp: 29.4, humidity: 68, wind: 10.5, station: "Patia CAAQMS Station, Bhubaneswar" },
  { id: "amritsar", name: "Amritsar", state: "Punjab", lat: 31.6340, lon: 74.8723, aqi: 158, cat: "Poor", pm25: 118, pm10: 188, co: 1900, so2: 18, no2: 46, o3: 34, rank: 80, temp: 22.8, humidity: 55, wind: 7.4, station: "Golden Temple CAAQMS, Amritsar" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, aqi: 148, cat: "Poor", pm25: 112, pm10: 210, co: 1800, so2: 19, no2: 51, o3: 38, rank: 85, temp: 28.0, humidity: 38, wind: 7.2, station: "Adarsh Nagar CAAQMS, Jaipur" },
  { id: "gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lon: 88.6065, aqi: 32, cat: "Good", pm25: 21, pm10: 35, co: 400, so2: 5, no2: 11, o3: 15, rank: 215, temp: 17.2, humidity: 75, wind: 5.0, station: "MG Marg CAAQMS, Gangtok" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, aqi: 76, cat: "Moderate", pm25: 48, pm10: 76, co: 900, so2: 12, no2: 28, o3: 24, rank: 132, temp: 31.4, humidity: 74, wind: 16.0, station: "Velachery CAAQMS Station, Chennai" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, aqi: 98, cat: "Moderate", pm25: 58, pm10: 98, co: 1100, so2: 11, no2: 38, o3: 32, rank: 115, temp: 28.5, humidity: 52, wind: 9.4, station: "Sanathnagar CAAQMS, Hyderabad" },
  { id: "agartala", name: "Agartala", state: "Tripura", lat: 23.8315, lon: 91.2868, aqi: 75, cat: "Moderate", pm25: 56, pm10: 94, co: 1000, so2: 10, no2: 26, o3: 22, rank: 135, temp: 26.4, humidity: 74, wind: 6.8, station: "Kunjaban CAAQMS Station, Agartala" },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, aqi: 184, cat: "Unhealthy", pm25: 178, pm10: 284, co: 2600, so2: 21, no2: 66, o3: 44, rank: 68, temp: 23.8, humidity: 65, wind: 5.4, station: "Talkatora CAAQMS Station, Lucknow" },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, aqi: 178, cat: "Unhealthy", pm25: 162, pm10: 268, co: 2500, so2: 20, no2: 63, o3: 41, rank: 71, temp: 24.1, humidity: 64, wind: 5.8, station: "Nehru Nagar CAAQMS, Kanpur" },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, aqi: 164, cat: "Unhealthy", pm25: 145, pm10: 235, co: 2100, so2: 18, no2: 55, o3: 37, rank: 76, temp: 25.6, humidity: 63, wind: 6.1, station: "BHU CAAQMS Station, Varanasi" },
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, aqi: 86, cat: "Moderate", pm25: 68, pm10: 112, co: 1200, so2: 12, no2: 31, o3: 27, rank: 126, temp: 21.5, humidity: 52, wind: 6.9, station: "Clock Tower CAAQMS, Dehradun" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, aqi: 155, cat: "Poor", pm25: 128, pm10: 195, co: 1900, so2: 22, no2: 58, o3: 36, rank: 82, temp: 27.8, humidity: 70, wind: 7.5, station: "Victoria Memorial CAAQMS, Kolkata" },

  // 8 Union Territories
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh (UT)", lat: 30.7333, lon: 76.7794, aqi: 110, cat: "Poor", pm25: 82, pm10: 138, co: 1300, so2: 12, no2: 36, o3: 30, rank: 104, temp: 22.4, humidity: 58, wind: 8.7, station: "Sector 22 CAAQMS, Chandigarh" },
  { id: "srinagar", name: "Srinagar", state: "Jammu & Kashmir (UT)", lat: 34.0837, lon: 74.7973, aqi: 58, cat: "Moderate", pm25: 42, pm10: 68, co: 900, so2: 8, no2: 22, o3: 20, rank: 150, temp: 15.8, humidity: 58, wind: 6.0, station: "Dal Lake CAAQMS, Srinagar" },
  { id: "leh", name: "Leh Ladakh", state: "Ladakh (UT)", lat: 34.1526, lon: 77.5771, aqi: 25, cat: "Good", pm25: 16, pm10: 28, co: 300, so2: 4, no2: 9, o3: 24, rank: 230, temp: 8.5, humidity: 28, wind: 9.4, station: "Main Bazaar CAAQMS, Leh" },
  { id: "puducherry", name: "Puducherry", state: "Puducherry (UT)", lat: 11.9416, lon: 79.8083, aqi: 52, cat: "Moderate", pm25: 38, pm10: 60, co: 700, so2: 9, no2: 21, o3: 20, rank: 155, temp: 30.8, humidity: 78, wind: 14.8, station: "Promenade Beach CAAQMS, Puducherry" },
  { id: "portblair", name: "Port Blair", state: "Andaman & Nicobar Islands (UT)", lat: 11.6234, lon: 92.7265, aqi: 28, cat: "Good", pm25: 18, pm10: 32, co: 400, so2: 4, no2: 8, o3: 16, rank: 225, temp: 29.8, humidity: 85, wind: 16.5, station: "Aberdeen Jetty CAAQMS, Port Blair" },
  { id: "daman", name: "Daman & Diu", state: "Dadra & Nagar Haveli and Daman & Diu (UT)", lat: 20.3974, lon: 72.8328, aqi: 68, cat: "Moderate", pm25: 48, pm10: 78, co: 900, so2: 11, no2: 25, o3: 22, rank: 142, temp: 30.2, humidity: 74, wind: 12.6, station: "Moti Daman CAAQMS, Daman" },
  { id: "kavaratti", name: "Kavaratti", state: "Lakshadweep (UT)", lat: 10.5667, lon: 72.6417, aqi: 22, cat: "Good", pm25: 15, pm10: 26, co: 300, so2: 3, no2: 7, o3: 15, rank: 240, temp: 29.4, humidity: 82, wind: 15.4, station: "Lagoon CAAQMS, Kavaratti" }
];

// App State
// App State
let currentCityId = "delhi";
let currentYear = 2026;
let currentStandard = "us";
let calendarMonths = [8, 9, 10];
let mainLeafletMap = null;
let miniLeafletMap = null;
let aqiTileOverlayLayer = null;
let miniAqiTileOverlayLayer = null;
let mapMarkers = [];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initApiKeys();
  initEventListeners();
  initMaps();
  renderAllStatesChips();
  window.loadCity(currentCityId);
});

// Setup Stored API Keys
function initApiKeys() {
  const iqairKey = localStorage.getItem("airsense_iqair_key") || "";
  const owKey = localStorage.getItem("airsense_openweather_key") || "";
  const mapKey = localStorage.getItem("airsense_map_key") || "demo";
  const googleKey = localStorage.getItem("airsense_google_maps_key") || "AIzaSyDemoKeyMapsIndiaAirQuality2026";
  const overlayEnabled = localStorage.getItem("airsense_aqi_overlay_enabled") !== "false";
  
  const elIqair = document.getElementById("inputIqairKey");
  const elOw = document.getElementById("inputOpenweatherKey");
  const elMap = document.getElementById("inputMapKey");
  const elGoogle = document.getElementById("inputGoogleMapsKey");
  const elSwitch = document.getElementById("toggleAqiTileOverlay");

  if (elIqair) elIqair.value = iqairKey;
  if (elOw) elOw.value = owKey;
  if (elMap) elMap.value = mapKey;
  if (elGoogle) elGoogle.value = googleKey;
  if (elSwitch) elSwitch.checked = overlayEnabled;
}

// Event Listeners
function initEventListeners() {
  // City Selectors (Navbar & Hero)
  const navCity = document.getElementById("navCitySelector");
  if (navCity) {
    navCity.addEventListener("change", (e) => {
      window.loadCity(e.target.value);
    });
  }

  const heroCity = document.getElementById("heroStateSelector");
  if (heroCity) {
    heroCity.addEventListener("change", (e) => {
      window.loadCity(e.target.value);
    });
  }

  // Calendar Controls
  const calYearSelect = document.getElementById("calYearSelect");
  if (calYearSelect) {
    calYearSelect.addEventListener("change", (e) => {
      currentYear = parseInt(e.target.value);
      const label = document.getElementById("calYearLabel");
      if (label) label.textContent = currentYear;
      renderCalendar(currentCityId, currentYear, calendarMonths);
    });
  }

  const calStandardSelect = document.getElementById("calStandardSelect");
  if (calStandardSelect) {
    calStandardSelect.addEventListener("change", (e) => {
      currentStandard = e.target.value;
      const unitLabel = document.getElementById("heroAqiUnitLabel");
      if (unitLabel) unitLabel.textContent = currentStandard === "us" ? "AQI (US)" : "AQI (CPCB)";
      renderCalendar(currentCityId, currentYear, calendarMonths);
    });
  }

  // Calculator Buttons
  const btnCompute = document.getElementById("btnComputeAQI");
  if (btnCompute) {
    btnCompute.addEventListener("click", computeAqi);
  }
}

// Dynamic Mascot Image & Badge (1-50 no mask, 50-100 covers mouth/nose, >100 wears mask)
function updateMascot(aqi) {
  const container = document.getElementById("heroMascotContainer");
  const imgEl = document.getElementById("mascotBoyImg");
  const badgeEl = document.getElementById("mascotBoyBadge");

  let imgSrc = "images/boy_masked.png";
  let badgeHtml = '<i class="fa-solid fa-head-side-mask me-1"></i> AQI > 100: Face Mask Mandatory!';
  let badgeClass = "badge bg-danger text-white rounded-pill px-3 py-1 small fw-bold mt-2 mascot-badge";

  if (aqi <= 50) {
    // 1 to 50: No mask, cheerful smiling face, fresh air
    imgSrc = "images/boy_no_mask.png";
    badgeHtml = '<i class="fa-solid fa-face-smile me-1"></i> AQI 1-50: Fresh Air (No Mask)';
    badgeClass = "badge bg-success text-white rounded-pill px-3 py-1 small fw-bold mt-2 mascot-badge";
  } else if (aqi <= 100) {
    // 50 to 100: Covers nose and mouth with hand & cloth
    imgSrc = "images/boy_cover_mouth.png";
    badgeHtml = '<i class="fa-solid fa-hand me-1"></i> AQI 50-100: Covering Nose &amp; Mouth';
    badgeClass = "badge bg-warning text-dark rounded-pill px-3 py-1 small fw-bold mt-2 mascot-badge";
  }

  if (imgEl && badgeEl) {
    imgEl.src = imgSrc;
    badgeEl.className = badgeClass;
    badgeEl.innerHTML = badgeHtml;
  } else if (container) {
    container.innerHTML = `
      <img id="mascotBoyImg" src="${imgSrc}" alt="AirSense Boy Mascot" class="mascot-boy-img" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='./images/boy_masked.png';}">
      <div id="mascotBoyBadge" class="${badgeClass}">${badgeHtml}</div>
    `;
  }

  // Update Calculator Mascot if present
  const calcContainer = document.getElementById("calcMascotContainer");
  if (calcContainer) {
    calcContainer.innerHTML = `
      <div class="d-flex flex-column align-items-center">
        <img src="${imgSrc}" alt="Mascot" style="height: 105px; object-fit: contain;">
        <span class="${badgeClass} mt-1">${badgeHtml}</span>
      </div>
    `;
  }
}

// Robust Multi-tier City/State Lookup
function findCity(query) {
  if (!query) return INDIAN_CITIES_LIST[0];
  const q = String(query).toLowerCase().trim();
  
  // 1. Exact ID match
  let match = INDIAN_CITIES_LIST.find(c => c.id.toLowerCase() === q);
  if (match) return match;
  
  // 2. Exact Name or State match
  match = INDIAN_CITIES_LIST.find(c => c.name.toLowerCase() === q || c.state.toLowerCase() === q);
  if (match) return match;
  
  // 3. Substring match
  match = INDIAN_CITIES_LIST.find(c => 
    c.id.toLowerCase().includes(q) || 
    q.includes(c.id.toLowerCase()) ||
    c.name.toLowerCase().includes(q) || 
    q.includes(c.name.toLowerCase()) ||
    c.state.toLowerCase().includes(q) ||
    q.includes(c.state.toLowerCase())
  );
  if (match) return match;

  // 4. State alias map for all 28 states & 8 UTs
  const stateMap = {
    "goa": "panaji", "karnataka": "bengaluru", "maharashtra": "mumbai",
    "tamil": "chennai", "telangana": "hyderabad", "bengal": "kolkata",
    "andhra": "amaravati", "arunachal": "itanagar", "assam": "guwahati",
    "bihar": "patna", "chhattisgarh": "raipur", "gujarat": "ahmedabad",
    "haryana": "gurugram", "himachal": "shimla", "jharkhand": "ranchi",
    "kerala": "thiruvananthapuram", "madhya": "bhopal", "manipur": "imphal",
    "meghalaya": "shillong", "mizoram": "aizawl", "nagaland": "kohima",
    "odisha": "bhubaneswar", "punjab": "amritsar", "rajasthan": "jaipur",
    "sikkim": "gangtok", "tripura": "agartala", "uttar": "lucknow",
    "uttarakhand": "dehradun", "andaman": "portblair", "chandigarh": "chandigarh",
    "dadra": "daman", "daman": "daman", "delhi": "delhi", "jammu": "srinagar",
    "kashmir": "srinagar", "ladakh": "leh", "lakshadweep": "kavaratti",
    "puducherry": "puducherry", "pondicherry": "puducherry"
  };
  for (const [st, targetId] of Object.entries(stateMap)) {
    if (q.includes(st)) {
      return INDIAN_CITIES_LIST.find(c => c.id === targetId) || INDIAN_CITIES_LIST[0];
    }
  }
  
  return INDIAN_CITIES_LIST[0];
}

// Global Load City Telemetry (Works 100% on Static GitHub Pages & Localhost)
window.loadCity = async function(cityId) {
  if (!cityId) return;
  const city = findCity(cityId);
  currentCityId = city.id;

  // Sync selectors to resolved canonical city.id
  const navCity = document.getElementById("navCitySelector");
  if (navCity && navCity.value !== city.id) navCity.value = city.id;
  const heroCity = document.getElementById("heroStateSelector");
  if (heroCity && heroCity.value !== city.id) heroCity.value = city.id;

  // Update active state chip
  document.querySelectorAll(".state-chip-btn").forEach(btn => {
    if (btn.dataset.cityId === city.id) {
      btn.classList.add("active", "border-primary", "shadow-sm");
    } else {
      btn.classList.remove("active", "border-primary", "shadow-sm");
    }
  });

  // Generate telemetry for resolved city
  const clientData = generateClientCityData(city);

  // Immediate render (zero delay)
  renderHero(clientData);
  renderMajorPollutants(clientData);
  renderCalendar(city.id, currentYear, calendarMonths);
  updateMapFocus(city.lat, city.lon);

  // If live backend exists, refresh asynchronously
  const iqairKey = localStorage.getItem("airsense_iqair_key") || "";
  const owKey = localStorage.getItem("airsense_openweather_key") || "";
  try {
    const url = `/api/city/${city.id}?openweather_key=${encodeURIComponent(owKey)}&iqair_key=${encodeURIComponent(iqairKey)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      renderHero(data);
      renderMajorPollutants(data);
      renderCalendar(city.id, currentYear, calendarMonths);
      updateMapFocus(data.city_info.lat, data.city_info.lon);
    }
  } catch (err) {
    // Client data is already rendered
  }
};

// Generate Local State Telemetry
function generateClientCityData(city) {
  const isDelhi = city.id === "delhi";
  const aqiVal = isDelhi ? 166 : city.aqi;
  const pm25Val = isDelhi ? 78 : city.pm25;
  const pm10Val = isDelhi ? 159 : city.pm10;
  const coVal = isDelhi ? 2661 : city.co;
  const so2Val = isDelhi ? 5 : city.so2;
  const no2Val = isDelhi ? 3 : city.no2;
  const o3Val = isDelhi ? 4 : city.o3;

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} (Local Time)`;

  return {
    city_info: {
      id: city.id,
      name: city.name,
      state: city.state,
      station: city.station,
      lat: city.lat,
      lon: city.lon,
      temp: city.temp,
      humidity: city.humidity,
      wind_speed: city.wind,
      description: "Partly Cloudy",
      uv_index: 1.5,
      timestamp: timeStr,
      rank: city.rank,
      rank_text: `Currently, ${city.name} ranks ${city.rank}th among the most polluted cities globally.`
    },
    aqi_data: {
      aqi: aqiVal,
      category: getAqiCategoryName(aqiVal),
      color: getAqiColor(aqiVal)
    },
    major_pollutants: [
      { id: "pm25", name: "Particulate Matter", symbol: "(PM2.5)", value: pm25Val, unit: "µg/m³", color: getAqiColor(aqiVal), alert: false },
      { id: "pm10", name: "Particulate Matter", symbol: "(PM10)", value: pm10Val, unit: "µg/m³", color: getAqiColor(aqiVal), alert: aqiVal > 100 },
      { id: "co", name: "Carbon Monoxide", symbol: "(CO)", value: coVal, unit: "ppb", color: "#00E400", alert: false },
      { id: "so2", name: "Sulfur Dioxide", symbol: "(SO2)", value: so2Val, unit: "ppb", color: "#00E400", alert: false },
      { id: "no2", name: "Nitrogen Dioxide", symbol: "(NO2)", value: no2Val, unit: "ppb", color: "#00E400", alert: false },
      { id: "o3", name: "Ozone", symbol: "(O3)", value: o3Val, unit: "ppb", color: "#00E400", alert: false }
    ]
  };
}

// Render Hero Section with Mascot Boy
function renderHero(data) {
  const info = data.city_info;
  const aqi = data.aqi_data.aqi;
  const cat = data.aqi_data.category;

  const title = document.getElementById("heroCityTitle");
  if (title) title.textContent = `${info.name} Air Quality Index (AQI) | Air Pollution`;

  const sub = document.getElementById("heroCitySubtitle");
  if (sub) sub.textContent = `Real-time PM2.5, PM10 air pollution level in ${info.name} (${info.state})`;

  const time = document.getElementById("lastUpdatedTime");
  if (time) time.textContent = info.timestamp;

  const aqiNum = document.getElementById("heroAqiNumber");
  if (aqiNum) aqiNum.textContent = aqi;

  const aqiCat = document.getElementById("heroAqiCategory");
  if (aqiCat) {
    aqiCat.textContent = cat;
    aqiCat.style.backgroundColor = getCategoryBgColor(aqi);
    aqiCat.style.color = getCategoryTextColor(aqi);
  }

  const bannerBg = document.getElementById("heroBannerBg");
  if (bannerBg) {
    bannerBg.style.background = getCategoryGradient(aqi);
  }

  const pointer = document.getElementById("heroSpectrumPointer");
  if (pointer) {
    let pct = (aqi / 350) * 100;
    pct = Math.max(2, Math.min(98, pct));
    pointer.style.left = `${pct}%`;
  }

  const pm25El = document.getElementById("heroPm25");
  const pm10El = document.getElementById("heroPm10");
  if (pm25El) {
    const p25 = data.major_pollutants ? data.major_pollutants.find(p => p.id === 'pm25') : null;
    pm25El.textContent = p25 ? p25.value : (data.raw_pollutants ? Math.round(data.raw_pollutants.pm25) : 78);
  }
  if (pm10El) {
    const p10 = data.major_pollutants ? data.major_pollutants.find(p => p.id === 'pm10') : null;
    pm10El.textContent = p10 ? p10.value : (data.raw_pollutants ? Math.round(data.raw_pollutants.pm10) : 159);
  }

  // Update Dynamic Mascot
  updateMascot(aqi);

  const wTemp = document.getElementById("heroWeatherTemp");
  if (wTemp) wTemp.textContent = `${info.temp} °C`;

  const wDesc = document.getElementById("heroWeatherDesc");
  if (wDesc) wDesc.textContent = info.description || "Partly Cloudy";

  const wHum = document.getElementById("heroWeatherHumidity");
  if (wHum) wHum.textContent = `${info.humidity} %`;

  const wWind = document.getElementById("heroWeatherWind");
  if (wWind) wWind.textContent = `${info.wind_speed} km/h`;

  const wUv = document.getElementById("heroWeatherUv");
  if (wUv) wUv.textContent = `${info.uv_index || 1.5}`;

  const rankVal = (info && info.rank) ? info.rank : (data.rank_info ? data.rank_info.rank : 74);
  const rankNum = document.getElementById("heroCityRank");
  if (rankNum) rankNum.textContent = `${rankVal}th`;

  const rankText = document.getElementById("heroRankText");
  if (rankText) {
    rankText.textContent = (info && info.rank_text) ? info.rank_text : `Currently, ${info.name || 'this city'} ranks ${rankVal}th among the most polluted cities globally.`;
  }

  const link1 = document.getElementById("pollutantsCityLink");
  if (link1) link1.textContent = info.name;

  const link2 = document.getElementById("calCityLink");
  if (link2) link2.textContent = info.name;
}

// Render Major Pollutants (Photo 1)
function renderMajorPollutants(data) {
  const pollutants = data.major_pollutants || [];
  const grid = document.getElementById("majorPollutantsGrid");
  if (!grid || !pollutants.length) return;

  const icons = {
    pm25: "fa-cloud",
    pm10: "fa-cloud-meatball",
    co: "fa-smog",
    so2: "fa-cloud-rain",
    no2: "fa-cloud-arrow-down",
    o3: "fa-circle-nodes"
  };

  let html = "";
  pollutants.forEach(p => {
    const iconClass = icons[p.id] || "fa-cloud";
    const alertBadge = p.alert ? `<span class="alert-dot-badge"><i class="fa-solid fa-circle-exclamation"></i></span>` : "";
    
    html += `
      <div class="col-md-4 col-sm-6">
        <div class="pollutant-card" style="--indicator-color: ${p.color};" onclick="window.populateCalculatorPollutant('${p.id}', ${p.value})">
          ${alertBadge}
          <div class="pollutant-left">
            <div class="pollutant-cloud-icon">
              <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="pollutant-meta">
              <div class="pollutant-title">${p.name}</div>
              <div class="pollutant-subtitle">${p.symbol}</div>
            </div>
          </div>
          <div class="pollutant-right">
            <div>
              <div class="pollutant-num">${p.value}</div>
              <div class="pollutant-unit">${p.unit}</div>
            </div>
            <i class="fa-solid fa-chevron-right pollutant-chevron"></i>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Render Air Quality Calendar (Photo 2)
async function renderCalendar(cityId, year, months) {
  const container = document.getElementById("calendarMonthsContainer");
  if (!container) return;

  try {
    const res = await fetch(`/api/calendar/${cityId}?year=${year}&months=${months.join(',')}`);
    if (res.ok) {
      const calData = await res.json();
      buildCalendarHtml(calData.months);
      return;
    }
  } catch (e) {
    // Client-side fallback calendar
  }

  const clientMonths = generateClientCalendar(cityId, year, months);
  buildCalendarHtml(clientMonths);
}

function buildCalendarHtml(monthsData) {
  const container = document.getElementById("calendarMonthsContainer");
  if (!container) return;

  const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  let html = "";

  monthsData.forEach(m => {
    html += `
      <div class="col-lg-4 col-md-6 month-calendar-block">
        <div class="month-title-header text-center">${m.month_name}</div>
        <div class="calendar-days-grid mb-1">
          ${weekdays.map(w => `<div class="calendar-weekday-col">${w}</div>`).join('')}
        </div>
        <div class="calendar-days-grid">
    `;

    m.days.forEach(d => {
      if (!d) {
        html += `<div style="min-height: 48px;"></div>`;
      } else {
        html += `
          <div class="cal-day-cell" title="${d.date_label}: AQI ${d.aqi} (${d.category})">
            <div class="cal-cell-date">${d.date_label}</div>
            <div class="cal-cell-aqi" style="background-color: ${d.color}; color: ${d.color === '#FFFF00' ? '#7A6800' : '#FFFFFF'};">
              ${d.aqi}
            </div>
          </div>
        `;
      }
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Client Calendar Generator scaled to state base AQI
function generateClientCalendar(cityId, year, months) {
  const city = findCity(cityId);
  const isDelhi = city.id === "delhi";
  const baseAqi = isDelhi ? 166 : city.aqi;

  const monthNames = { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" };
  const shortNames = { 1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.", 5: "May.", 6: "Jun.", 7: "Jul.", 8: "Aug.", 9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec." };

  const photoValues = {
    8: { 1: 127, 4: 95, 5: 126, 6: 110, 7: 114, 8: 120, 11: 141, 12: 147, 13: 127, 14: 123, 15: 132, 18: 94, 19: 104, 20: 115, 21: 104, 22: 98, 25: 137, 26: 150, 27: 138, 28: 109, 29: 95 },
    9: { 1: 94, 2: 108, 3: 102, 4: 100, 5: 107, 6: 99, 7: 140, 8: 108, 9: 103, 10: 106, 11: 130, 12: 112, 13: 116, 14: 125, 15: 145, 16: 121, 17: 132, 18: 107, 19: 151, 20: 166, 21: 162, 22: 164, 23: 166, 24: 146, 25: 82, 26: 79, 27: 69, 28: 97, 29: 131, 30: 144 },
    10: { 1: 146, 2: 148, 3: 146, 4: 136, 5: 131, 6: 136, 7: 146, 8: 159, 9: 164, 10: 155, 11: 138, 12: 123, 13: 178, 14: 178, 15: 151, 16: 145, 17: 178, 18: 176, 19: 161, 20: 192, 21: 221, 22: 210, 23: 214, 24: 184 }
  };

  const results = [];
  months.forEach(m => {
    const daysInMonth = new Date(year, m, 0).getDate();
    const firstDayIndex = new Date(year, m - 1, 1).getDay();
    const daysData = [];

    for (let i = 0; i < firstDayIndex; i++) daysData.push(null);

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      let aqiVal;
      if (isDelhi && photoValues[m] && photoValues[m][dayNum]) {
        aqiVal = photoValues[m][dayNum];
      } else {
        const variance = Math.sin(dayNum * 1.5 + m) * (baseAqi * 0.22);
        aqiVal = Math.max(12, Math.round(baseAqi + variance));
      }

      daysData.push({
        day: dayNum,
        date_label: `${dayNum} ${shortNames[m]}`,
        aqi: aqiVal,
        category: getAqiCategoryName(aqiVal),
        color: getAqiColor(aqiVal)
      });
    }

    results.push({
      month: m,
      month_name: monthNames[m],
      days: daysData
    });
  });

  return results;
}

// Calendar Month Controls
window.prevCalendarMonths = function() {
  calendarMonths = calendarMonths.map(m => m <= 1 ? 12 : m - 1);
  renderCalendar(currentCityId, currentYear, calendarMonths);
};

window.nextCalendarMonths = function() {
  calendarMonths = calendarMonths.map(m => m >= 12 ? 1 : m + 1);
  renderCalendar(currentCityId, currentYear, calendarMonths);
};

// Render Clickable Chips for ALL 28 States & 8 UTs
function renderAllStatesChips() {
  const container = document.getElementById("allStatesChipsGrid");
  if (!container) return;

  container.innerHTML = INDIAN_CITIES_LIST.map(c => {
    const color = getAqiColor(c.aqi);
    const textColor = color === "#FFFF00" ? "#7A6800" : "#FFFFFF";
    return `
      <button type="button" class="btn btn-sm btn-light border rounded-pill px-2 py-1 small state-chip-btn ${c.id === currentCityId ? 'active border-primary shadow-sm' : ''}" 
              data-city-id="${c.id}" 
              onclick="window.loadCity('${c.id}')"
              style="font-size: 0.76rem; display: inline-flex; align-items: center; gap: 4px;">
        <span style="display:inline-block; width: 9px; height: 9px; border-radius: 50%; background-color: ${color};"></span>
        <span class="fw-semibold">${c.name}</span>
        <span class="badge" style="background-color: ${color}; color: ${textColor}; font-size: 0.68rem; padding: 2px 5px;">${c.aqi}</span>
      </button>
    `;
  }).join("");
}

// Switch between Leaflet & Google Maps (Maps Demo Key)
window.switchMapView = function(mode) {
  const leafletEl = document.getElementById("indiaMap");
  const googleEl = document.getElementById("googleMap");
  const btnLeaflet = document.getElementById("btnViewLeaflet");
  const btnGoogle = document.getElementById("btnViewGoogle");

  if (mode === "google") {
    if (leafletEl) leafletEl.classList.add("d-none");
    if (googleEl) googleEl.classList.remove("d-none");
    if (btnLeaflet) {
      btnLeaflet.classList.remove("btn-primary", "active");
      btnLeaflet.classList.add("btn-outline-primary");
    }
    if (btnGoogle) {
      btnGoogle.classList.add("btn-primary", "active");
      btnGoogle.classList.remove("btn-outline-secondary");
    }
    const city = findCity(currentCityId);
    const iframe = document.getElementById("googleMapIframe");
    if (iframe) {
      iframe.src = `https://maps.google.com/maps?q=${city.lat},${city.lon}&hl=en&z=9&output=embed`;
    }
  } else {
    if (googleEl) googleEl.classList.add("d-none");
    if (leafletEl) leafletEl.classList.remove("d-none");
    if (btnGoogle) {
      btnGoogle.classList.remove("btn-primary", "active");
      btnGoogle.classList.add("btn-outline-secondary");
    }
    if (btnLeaflet) {
      btnLeaflet.classList.add("btn-primary", "active");
      btnLeaflet.classList.remove("btn-outline-primary");
    }
    if (mainLeafletMap) {
      setTimeout(() => { mainLeafletMap.invalidateSize(); }, 150);
    }
  }
};

// Active Map Layer State
let currentMapLayerName = "google_road";
let baseTileLayers = {};

// Switch Map Layers (Google Roadmap, Google Satellite, Carto Light)
window.setMapLayer = function(layerName) {
  if (!mainLeafletMap || !baseTileLayers[layerName]) return;
  currentMapLayerName = layerName;

  // Remove existing base layers
  Object.values(baseTileLayers).forEach(layer => {
    if (mainLeafletMap.hasLayer(layer)) {
      mainLeafletMap.removeLayer(layer);
    }
  });

  // Add selected base layer
  baseTileLayers[layerName].addTo(mainLeafletMap);

  // Update button active styles
  const btnRoad = document.getElementById("btnLayerGoogleMap");
  const btnSat = document.getElementById("btnLayerSatellite");
  const btnCarto = document.getElementById("btnLayerCarto");

  [btnRoad, btnSat, btnCarto].forEach(b => {
    if (b) {
      b.classList.remove("btn-primary", "active");
      b.classList.add("btn-outline-secondary");
    }
  });

  if (layerName === "google_road" && btnRoad) {
    btnRoad.classList.remove("btn-outline-secondary");
    btnRoad.classList.add("btn-primary", "active");
  } else if (layerName === "google_sat" && btnSat) {
    btnSat.classList.remove("btn-outline-secondary");
    btnSat.classList.add("btn-primary", "active");
  } else if (layerName === "carto" && btnCarto) {
    btnCarto.classList.remove("btn-outline-secondary");
    btnCarto.classList.add("btn-primary", "active");
  }

  mainLeafletMap.invalidateSize();
};

// Toggle Air Quality Heatmap Contour Overlay
window.toggleAqiHeatmap = function() {
  if (!mainLeafletMap || !aqiTileOverlayLayer) return;
  const btn = document.getElementById("btnToggleHeatmap");

  if (mainLeafletMap.hasLayer(aqiTileOverlayLayer)) {
    mainLeafletMap.removeLayer(aqiTileOverlayLayer);
    if (btn) {
      btn.classList.remove("btn-danger", "active");
      btn.classList.add("btn-outline-danger");
    }
  } else {
    aqiTileOverlayLayer.addTo(mainLeafletMap);
    if (btn) {
      btn.classList.add("btn-danger", "active");
      btn.classList.remove("btn-outline-danger");
    }
  }
};

// Initialize Leaflet Maps with Google Maps Platform Demo Key & Tile Layers
function initMaps() {
  const mapKey = localStorage.getItem("airsense_map_key") || "demo";
  const googleKey = localStorage.getItem("airsense_google_maps_key") || "AIzaSyDemoKeyMapsIndiaAirQuality2026";
  const overlayEnabled = localStorage.getItem("airsense_aqi_overlay_enabled") !== "false";

  // Google Maps Roadmap Base Layer
  const googleRoadmap = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps Platform</a>'
  });

  // Google Maps Satellite (Hybrid) Base Layer
  const googleSatellite = L.tileLayer("https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 20,
    attribution: '&copy; <a href="https://maps.google.com">Google Maps Satellite</a>'
  });

  // Carto Light Clean Base Layer
  const cartoLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  });

  baseTileLayers = {
    google_road: googleRoadmap,
    google_sat: googleSatellite,
    carto: cartoLight
  };

  // 1. Mini Map in Hero (Photo 3 Replica)
  const miniEl = document.getElementById("miniMap");
  if (miniEl && !miniLeafletMap) {
    miniLeafletMap = L.map("miniMap", { zoomControl: false, attributionControl: false }).setView([28.6139, 77.2090], 11);
    
    // Google Roadmap on mini-map
    L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 18
    }).addTo(miniLeafletMap);

    if (overlayEnabled) {
      miniAqiTileOverlayLayer = L.tileLayer("https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=" + mapKey, {
        maxZoom: 18,
        opacity: 0.65
      }).addTo(miniLeafletMap);
    }
  }

  // 2. Main India Interactive Map
  const mapEl = document.getElementById("indiaMap");
  if (mapEl && !mainLeafletMap) {
    mainLeafletMap = L.map("indiaMap").setView([22.5, 79.5], 5);

    // Default to Google Maps Roadmap
    googleRoadmap.addTo(mainLeafletMap);

    // Live Air Quality Tile Overlay Layer
    aqiTileOverlayLayer = L.tileLayer("https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=" + mapKey, {
      maxZoom: 18,
      opacity: 0.65,
      attribution: 'Live AQI Heatmap &copy; <a href="https://waqi.info">WAQI.info</a>'
    });

    if (overlayEnabled) {
      aqiTileOverlayLayer.addTo(mainLeafletMap);
    }

    // Add all 43 State & UT pins with click-to-load
    INDIAN_CITIES_LIST.forEach(city => {
      const color = getAqiColor(city.aqi);
      const icon = L.divIcon({
        className: "custom-map-pin",
        html: `<div style="background-color: ${color}; color: ${color === '#FFFF00' ? '#7A6800' : '#FFFFFF'}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.25); cursor: pointer;">${city.aqi}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([city.lat, city.lon], { icon: icon }).addTo(mainLeafletMap);
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h6 style="margin: 0 0 2px 0; font-weight: 800; color: #0F172A;">${city.name}</h6>
          <div style="font-size: 0.78rem; font-weight: 600; color: #0284C7;">${city.state}</div>
          <div style="font-size: 0.75rem; color: #64748B; margin-top: 2px;">${city.station}</div>
          <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="background: ${color}; color: ${color === '#FFFF00' ? '#7A6800' : '#FFFFFF'}; padding: 3px 10px; border-radius: 12px; font-weight: 800; font-size: 0.8rem;">AQI ${city.aqi}</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #0F172A;">${city.cat}</span>
          </div>
          <button onclick="window.loadCity('${city.id}')" style="margin-top: 10px; width: 100%; border: none; background: #0284C7; color: #FFFFFF; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.78rem; cursor: pointer;">View State Telemetry</button>
        </div>
      `);

      mapMarkers.push({ id: city.id, marker: marker });
    });

    // Invalidate size to guarantee no gray or misaligned tiles
    setTimeout(() => { if (mainLeafletMap) mainLeafletMap.invalidateSize(); }, 150);
    setTimeout(() => { if (mainLeafletMap) mainLeafletMap.invalidateSize(); }, 600);
    setTimeout(() => { if (miniLeafletMap) miniLeafletMap.invalidateSize(); }, 200);

    window.addEventListener("resize", () => {
      if (mainLeafletMap) mainLeafletMap.invalidateSize();
      if (miniLeafletMap) miniLeafletMap.invalidateSize();
    });
  }
}

// Update Map Focus & Render Local Monitoring Station Pins (Photo 3 Replica)
function updateMapFocus(lat, lon) {
  const city = INDIAN_CITIES_LIST.find(c => c.id === currentCityId) || INDIAN_CITIES_LIST[0];

  if (miniLeafletMap) {
    miniLeafletMap.setView([lat, lon], 11);
    
    // Clear old station markers
    miniLeafletMap.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        miniLeafletMap.removeLayer(layer);
      }
    });

    // Render local neighborhood monitoring stations around city (Photo 3 replica)
    const offsets = [
      { dLat: 0, dLon: 0, name: city.name, aqi: city.aqi },
      { dLat: 0.045, dLon: 0.035, name: "North CAAQMS", aqi: Math.round(city.aqi * 1.06) },
      { dLat: -0.040, dLon: 0.055, name: "East CAAQMS", aqi: Math.round(city.aqi * 0.95) },
      { dLat: -0.050, dLon: -0.035, name: "South CAAQMS", aqi: Math.round(city.aqi * 1.04) },
      { dLat: 0.030, dLon: -0.050, name: "West CAAQMS", aqi: Math.round(city.aqi * 0.91) },
      { dLat: 0.070, dLon: -0.020, name: "Airport CAAQMS", aqi: Math.round(city.aqi * 0.89) }
    ];

    offsets.forEach(s => {
      const col = getAqiColor(s.aqi);
      const textCol = col === '#FFFF00' ? '#7A6800' : '#FFFFFF';
      const icon = L.divIcon({
        className: "mini-station-pin",
        html: `<div style="background-color: ${col}; color: ${textCol}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.65rem; border: 2px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.25);">${s.aqi}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([lat + s.dLat, lon + s.dLon], { icon: icon }).addTo(miniLeafletMap);
    });

    miniLeafletMap.invalidateSize();
  }

  if (mainLeafletMap) {
    mainLeafletMap.panTo([lat, lon]);
    const markerObj = mapMarkers.find(m => m.id === currentCityId);
    if (markerObj) {
      markerObj.marker.openPopup();
    }
  }
}

window.resetMapView = function() {
  if (mainLeafletMap) {
    mainLeafletMap.setView([22.5, 79.5], 5);
  }
};

// CPCB Calculator - Step by Step Linear Formula
window.computeAqi = function() {
  const pm25 = parseFloat(document.getElementById("calc_pm25").value) || null;
  const pm10 = parseFloat(document.getElementById("calc_pm10").value) || null;
  const no2 = parseFloat(document.getElementById("calc_no2").value) || null;
  const so2 = parseFloat(document.getElementById("calc_so2").value) || null;
  const co = parseFloat(document.getElementById("calc_co").value) || null;
  const o3 = parseFloat(document.getElementById("calc_o3").value) || null;
  const nh3 = parseFloat(document.getElementById("calc_nh3").value) || null;

  const inputs = { pm25, pm10, no2, so2, co, o3, nh3 };
  const subIndices = {};
  const steps = [];

  for (const [p, conc] of Object.entries(inputs)) {
    if (conc === null || isNaN(conc) || conc < 0) continue;
    const ranges = CPCB_BREAKPOINTS[p];
    if (!ranges) continue;

    let sub = null;
    let matchedRange = null;

    for (const [b_lo, b_hi, i_lo, i_hi] of ranges) {
      if (conc >= b_lo && conc <= b_hi) {
        sub = Math.round(((i_hi - i_lo) / (b_hi - b_lo)) * (conc - b_lo) + i_lo);
        matchedRange = { b_lo, b_hi, i_lo, i_hi };
        break;
      }
    }

    if (sub !== null && matchedRange) {
      subIndices[p] = sub;
      const unit = p === "co" ? "mg/m³" : "µg/m³";
      steps.push({
        pollutant: p.toUpperCase(),
        conc: `${conc} ${unit}`,
        b_range: `${matchedRange.b_lo} - ${matchedRange.b_hi}`,
        i_range: `${matchedRange.i_lo} - ${matchedRange.i_hi}`,
        formula: `[(${matchedRange.i_hi} - ${matchedRange.i_lo}) / (${matchedRange.b_hi} - ${matchedRange.b_lo})] × (${conc} - ${matchedRange.b_lo}) + ${matchedRange.i_lo}`,
        sub_index: sub
      });
    }
  }

  // CPCB Standard requires at least 3 pollutants with at least one PM (PM2.5 or PM10)
  const count = Object.keys(subIndices).length;
  const hasPm = subIndices.pm25 !== undefined || subIndices.pm10 !== undefined;

  if (count === 0) {
    alert("Please enter at least one valid pollutant concentration value.");
    return;
  }

  if (count < 3 || !hasPm) {
    // Soft advisory
    console.warn("CPCB guidelines recommend at least 3 pollutants with at least one PM. Proceeding with available inputs.");
  }

  // Overall AQI = max of sub-indices
  let maxSub = 0;
  let dominant = "None";
  for (const [p, val] of Object.entries(subIndices)) {
    if (val > maxSub) {
      maxSub = val;
      dominant = p.toUpperCase();
    }
  }

  const category = getAqiCategoryName(maxSub);
  const color = getAqiColor(maxSub);

  // Show results
  const resBox = document.getElementById("calcResultsBox");
  if (resBox) resBox.classList.remove("d-none");

  const aqiEl = document.getElementById("calcResultAqi");
  if (aqiEl) aqiEl.textContent = maxSub;

  const catEl = document.getElementById("calcResultCat");
  if (catEl) {
    catEl.textContent = category;
    catEl.style.backgroundColor = color;
    catEl.style.color = color === "#FFFF00" ? "#7A6800" : "#FFFFFF";
  }

  const domEl = document.getElementById("calcResultDominant");
  if (domEl) domEl.textContent = dominant;

  // Render Mascot in Calculator result matching the computed AQI
  updateMascot(maxSub);

  // Render Breakdown Table
  const tableBody = document.getElementById("calcStepsTableBody");
  if (tableBody) {
    tableBody.innerHTML = steps.map(s => `
      <tr>
        <td class="fw-bold">${s.pollutant}</td>
        <td>${s.conc}</td>
        <td><code>${s.b_range}</code></td>
        <td><code>${s.i_range}</code></td>
        <td class="small font-monospace">${s.formula}</td>
        <td class="fw-bold fs-6 text-primary">${s.sub_index}</td>
      </tr>
    `).join("");
  }
};

// Load Live Pollutants from OpenWeather Air Pollution API into Calculator
window.fetchLiveForCalculator = async function() {
  const owKey = localStorage.getItem("airsense_openweather_key") || "";
  try {
    const res = await fetch(`/api/openweather/live/${currentCityId}?api_key=${encodeURIComponent(owKey)}`);
    if (res.ok) {
      const data = await res.json();
      const p = data.pollutants || {};
      
      if (p.pm25 !== undefined) document.getElementById("calc_pm25").value = p.pm25;
      if (p.pm10 !== undefined) document.getElementById("calc_pm10").value = p.pm10;
      if (p.no2 !== undefined) document.getElementById("calc_no2").value = p.no2;
      if (p.so2 !== undefined) document.getElementById("calc_so2").value = p.so2;
      if (p.co !== undefined) document.getElementById("calc_co").value = p.co;
      if (p.o3 !== undefined) document.getElementById("calc_o3").value = p.o3;
      if (p.nh3 !== undefined) document.getElementById("calc_nh3").value = p.nh3;

      computeAqi();
      alert(`Successfully loaded live measurements from ${data.source}!`);
      return;
    }
  } catch (err) {
    // Fallback to client city data
  }

  const city = findCity(currentCityId);
  document.getElementById("calc_pm25").value = city.pm25;
  document.getElementById("calc_pm10").value = city.pm10;
  document.getElementById("calc_co").value = (city.co / 1000).toFixed(1);
  document.getElementById("calc_so2").value = (city.so2 * 2.62).toFixed(1);
  document.getElementById("calc_no2").value = (city.no2 * 1.88).toFixed(1);
  document.getElementById("calc_o3").value = (city.o3 * 1.96).toFixed(1);
  document.getElementById("calc_nh3").value = "25.0";

  computeAqi();
  alert(`Loaded baseline CAAQMS telemetry for ${city.name} into calculator.`);
};

// Populate calculator input when clicking on pollutant card
window.populateCalculatorPollutant = function(pollutantId, val) {
  const el = document.getElementById(`calc_${pollutantId}`);
  if (el) {
    if (pollutantId === "co") {
      el.value = (val / 1000).toFixed(1); // convert ppb to mg/m³
    } else if (["so2", "no2", "o3"].includes(pollutantId)) {
      el.value = (val * 1.8).toFixed(1); // approximate ppb to µg/m³
    } else {
      el.value = val;
    }
    const calcSection = document.getElementById("calculatorSection");
    if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
    computeAqi();
  }
};

// Calculator Presets
window.loadCalcPreset = function(preset) {
  const presets = {
    clean: { pm25: 15, pm10: 25, no2: 12, so2: 6, co: 0.5, o3: 20, nh3: 40 },
    moderate: { pm25: 45, pm10: 75, no2: 35, so2: 15, co: 1.2, o3: 55, nh3: 85 },
    delhi_severe: { pm25: 220, pm10: 380, no2: 85, so2: 35, co: 4.5, o3: 95, nh3: 240 },
    industrial_so2: { pm25: 65, pm10: 110, no2: 55, so2: 140, co: 2.1, o3: 40, nh3: 110 }
  };

  const p = presets[preset];
  if (!p) return;

  document.getElementById("calc_pm25").value = p.pm25;
  document.getElementById("calc_pm10").value = p.pm10;
  document.getElementById("calc_no2").value = p.no2;
  document.getElementById("calc_so2").value = p.so2;
  document.getElementById("calc_co").value = p.co;
  document.getElementById("calc_o3").value = p.o3;
  document.getElementById("calc_nh3").value = p.nh3;

  computeAqi();
};

// Save API Keys & Map Settings
window.saveApiKeys = function() {
  const iqairKey = document.getElementById("inputIqairKey").value.trim();
  const owKey = document.getElementById("inputOpenweatherKey").value.trim();
  const mapKey = document.getElementById("inputMapKey").value.trim() || "demo";
  const googleKey = (document.getElementById("inputGoogleMapsKey") ? document.getElementById("inputGoogleMapsKey").value.trim() : "");
  const overlayEnabled = document.getElementById("toggleAqiTileOverlay").checked;

  localStorage.setItem("airsense_iqair_key", iqairKey);
  localStorage.setItem("airsense_openweather_key", owKey);
  localStorage.setItem("airsense_map_key", mapKey);
  localStorage.setItem("airsense_google_maps_key", googleKey);
  localStorage.setItem("airsense_aqi_overlay_enabled", overlayEnabled ? "true" : "false");

  // Update map layer if map exists
  if (mainLeafletMap && aqiTileOverlayLayer) {
    if (overlayEnabled) {
      aqiTileOverlayLayer.setUrl("https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=" + mapKey);
      if (!mainLeafletMap.hasLayer(aqiTileOverlayLayer)) {
        aqiTileOverlayLayer.addTo(mainLeafletMap);
      }
    } else {
      if (mainLeafletMap.hasLayer(aqiTileOverlayLayer)) {
        mainLeafletMap.removeLayer(aqiTileOverlayLayer);
      }
    }
  }

  const alertBox = document.getElementById("apiKeyStatusAlert");
  const alertText = document.getElementById("apiKeyStatusText");
  if (alertBox && alertText) {
    alertText.textContent = "API Keys, Maps Demo Key & Tile Settings saved! Refreshing...";
    alertBox.classList.remove("d-none");
  }

  setTimeout(() => {
    const modalEl = document.getElementById("apiSettingsModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    window.loadCity(currentCityId);
  }, 900);
};

// User Location
window.locateUser = function() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLon = pos.coords.longitude;
      
      let nearest = INDIAN_CITIES_LIST[0];
      let minDist = 999999;
      INDIAN_CITIES_LIST.forEach(c => {
        const d = Math.hypot(c.lat - userLat, c.lon - userLon);
        if (d < minDist) {
          minDist = d;
          nearest = c;
        }
      });
      window.loadCity(nearest.id);
    },
    () => {
      alert("Unable to retrieve your location. Showing Delhi NCR by default.");
    }
  );
};

// Share AQI
window.shareAQI = function() {
  const city = findCity(currentCityId);
  const shareText = `Live Air Quality in ${city.name} (${city.state}): AQI ${city.aqi} (${city.cat}). Checked on AirSense India!`;
  if (navigator.share) {
    navigator.share({ title: "AirSense India", text: shareText, url: window.location.href });
  } else {
    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
    alert("AQI assessment copied to clipboard!");
  }
};

// Favorite Toggle
window.toggleFavorite = function() {
  const favBtn = document.getElementById("btnFavorite");
  if (favBtn) {
    const icon = favBtn.querySelector("i");
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid", "text-danger");
    } else {
      icon.classList.remove("fa-solid", "text-danger");
      icon.classList.add("fa-regular");
    }
  }
};

// Export CSV (Direct Client-Side Generation - 100% Works Everywhere)
window.exportCityCSV = function() {
  const city = INDIAN_CITIES_LIST.find(c => c.id === currentCityId) || INDIAN_CITIES_LIST[0];
  const csvRows = [
    ["AirSense India - Air Quality Telemetry Report"],
    ["Generated", new Date().toISOString()],
    ["City", city.name],
    ["State", city.state],
    ["Station", city.station],
    ["Overall AQI", city.aqi],
    ["Category", city.cat],
    ["PM2.5 (ug/m3)", city.pm25],
    ["PM10 (ug/m3)", city.pm10],
    ["CO (ppb)", city.co],
    ["SO2 (ppb)", city.so2],
    ["NO2 (ppb)", city.no2],
    ["O3 (ppb)", city.o3],
    ["Temperature (C)", city.temp],
    ["Humidity (%)", city.humidity],
    ["Wind Speed (km/h)", city.wind]
  ];
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AirSense_${city.id}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// AQI Color Helpers
function getAqiColor(aqi) {
  if (aqi <= 50) return "#00E400";
  if (aqi <= 100) return "#FFFF00";
  if (aqi <= 200) return "#FF7E00";
  if (aqi <= 300) return "#FF0000";
  if (aqi <= 400) return "#8F3F97";
  return "#7E0023";
}

function getAqiCategoryName(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Unhealthy";
  if (aqi <= 400) return "Severe";
  return "Hazardous";
}

function getCategoryBgColor(aqi) {
  if (aqi <= 50) return "#DCFCE7";
  if (aqi <= 100) return "#FEF9C3";
  if (aqi <= 200) return "#FFEDD5";
  if (aqi <= 300) return "#FEE2E2";
  if (aqi <= 400) return "#F3E8FF";
  return "#FFE4E6";
}

function getCategoryTextColor(aqi) {
  if (aqi <= 50) return "#15803D";
  if (aqi <= 100) return "#854D0E";
  if (aqi <= 200) return "#C2410C";
  if (aqi <= 300) return "#B91C1C";
  if (aqi <= 400) return "#6B21A8";
  return "#881337";
}

function getCategoryGradient(aqi) {
  if (aqi <= 50) return "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)";
  if (aqi <= 100) return "linear-gradient(135deg, #FEFCE8 0%, #FEF08A 100%)";
  if (aqi <= 200) return "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)";
  if (aqi <= 300) return "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 60%, #FECDD3 100%)";
  if (aqi <= 400) return "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)";
  return "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)";
}
