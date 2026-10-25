/**
 * AirSense India - Web Application Client Logic
 * Author: Preethish (College Project)
 * Real-time CPCB Sub-Index AQI, Interactive India Map, and CPCB Calculator
 */

// Official CPCB Breakpoints: [B_lo, B_hi, I_lo, I_hi]
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

const POLLUTANT_NAMES = {
  pm25: "PM2.5",
  pm10: "PM10",
  no2: "NO₂",
  so2: "SO₂",
  co: "CO",
  o3: "O₃",
  nh3: "NH₃"
};

const POLLUTANT_UNITS = {
  pm25: "µg/m³",
  pm10: "µg/m³",
  no2: "µg/m³",
  so2: "µg/m³",
  co: "mg/m³",
  o3: "µg/m³",
  nh3: "µg/m³"
};

// 20 Indian Cities CAAQMS Dataset with real coordinates
const INDIAN_CITIES_DATA = [
  { id: "delhi", name: "Delhi NCR", state: "Delhi", lat: 28.6139, lon: 77.2090, pollutants: { pm25: 172.0, pm10: 275.0, no2: 74.0, so2: 19.0, co: 2.8, o3: 44.0, nh3: 38.0 }, station: "Anand Vihar CAAQMS Station, Delhi", temp: 24.5, humidity: 62, wind: 6.8 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, pollutants: { pm25: 68.0, pm10: 118.0, no2: 44.0, so2: 15.0, co: 1.2, o3: 28.0, nh3: 19.0 }, station: "BKC Bandra CAAQMS Station, Mumbai", temp: 30.2, humidity: 78, wind: 14.5 },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, pollutants: { pm25: 38.0, pm10: 62.0, no2: 26.0, so2: 8.0, co: 0.8, o3: 22.0, nh3: 12.0 }, station: "Hebbal CAAQMS Station, Bengaluru", temp: 23.0, humidity: 55, wind: 11.2 },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, pollutants: { pm25: 128.0, pm10: 195.0, no2: 58.0, so2: 22.0, co: 1.9, o3: 36.0, nh3: 28.0 }, station: "Victoria Memorial CAAQMS, Kolkata", temp: 27.8, humidity: 70, wind: 7.5 },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, pollutants: { pm25: 48.0, pm10: 76.0, no2: 28.0, so2: 12.0, co: 0.9, o3: 24.0, nh3: 15.0 }, station: "Velachery CAAQMS Station, Chennai", temp: 31.4, humidity: 74, wind: 16.0 },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, pollutants: { pm25: 58.0, pm10: 98.0, no2: 38.0, so2: 11.0, co: 1.1, o3: 32.0, nh3: 20.0 }, station: "Sanathnagar CAAQMS, Hyderabad", temp: 28.5, humidity: 52, wind: 9.4 },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, pollutants: { pm25: 94.0, pm10: 164.0, no2: 49.0, so2: 24.0, co: 1.6, o3: 39.0, nh3: 25.0 }, station: "Maninagar CAAQMS Station, Ahmedabad", temp: 31.0, humidity: 44, wind: 8.1 },
  { id: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, pollutants: { pm25: 54.0, pm10: 88.0, no2: 32.0, so2: 14.0, co: 1.0, o3: 26.0, nh3: 16.0 }, station: "Shivajinagar CAAQMS, Pune", temp: 26.2, humidity: 58, wind: 10.3 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, pollutants: { pm25: 178.0, pm10: 284.0, no2: 66.0, so2: 21.0, co: 2.6, o3: 44.0, nh3: 42.0 }, station: "Talkatora CAAQMS Station, Lucknow", temp: 23.8, humidity: 65, wind: 5.4 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, pollutants: { pm25: 112.0, pm10: 210.0, no2: 51.0, so2: 19.0, co: 1.8, o3: 38.0, nh3: 31.0 }, station: "Adarsh Nagar CAAQMS, Jaipur", temp: 28.0, humidity: 38, wind: 7.2 },
  { id: "patna", name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, pollutants: { pm25: 185.0, pm10: 295.0, no2: 69.0, so2: 26.0, co: 2.9, o3: 45.0, nh3: 46.0 }, station: "Samarpal CAAQMS Station, Patna", temp: 25.0, humidity: 68, wind: 4.9 },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, pollutants: { pm25: 162.0, pm10: 268.0, no2: 63.0, so2: 20.0, co: 2.5, o3: 41.0, nh3: 39.0 }, station: "Nehru Nagar CAAQMS Station, Kanpur", temp: 24.1, humidity: 64, wind: 5.8 },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, pollutants: { pm25: 145.0, pm10: 235.0, no2: 55.0, so2: 18.0, co: 2.1, o3: 37.0, nh3: 34.0 }, station: "BHU CAAQMS Station, Varanasi", temp: 25.6, humidity: 63, wind: 6.1 },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab / Haryana", lat: 30.7333, lon: 76.7794, pollutants: { pm25: 82.0, pm10: 138.0, no2: 36.0, so2: 12.0, co: 1.3, o3: 30.0, nh3: 22.0 }, station: "Sector 22 CAAQMS Station, Chandigarh", temp: 22.4, humidity: 58, wind: 8.7 },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, pollutants: { pm25: 44.0, pm10: 72.0, no2: 29.0, so2: 17.0, co: 0.9, o3: 21.0, nh3: 14.0 }, station: "Gajuwaka CAAQMS, Visakhapatnam", temp: 29.8, humidity: 76, wind: 15.2 },
  { id: "surat", name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, pollutants: { pm25: 78.0, pm10: 132.0, no2: 42.0, so2: 21.0, co: 1.4, o3: 31.0, nh3: 23.0 }, station: "SVNIT CAAQMS, Surat", temp: 30.5, humidity: 66, wind: 11.5 },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, pollutants: { pm25: 66.0, pm10: 115.0, no2: 34.0, so2: 13.0, co: 1.1, o3: 27.0, nh3: 18.0 }, station: "Paryavaran Parisar, Bhopal", temp: 27.2, humidity: 49, wind: 9.0 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, pollutants: { pm25: 72.0, pm10: 124.0, no2: 37.0, so2: 15.0, co: 1.3, o3: 29.0, nh3: 20.0 }, station: "Chhoti Gwaltoli CAAQMS, Indore", temp: 27.6, humidity: 47, wind: 9.8 },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, pollutants: { pm25: 32.0, pm10: 52.0, no2: 19.0, so2: 7.0, co: 0.6, o3: 18.0, nh3: 11.0 }, station: "Vyttila CAAQMS Station, Kochi", temp: 29.0, humidity: 82, wind: 13.8 },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, pollutants: { pm25: 88.0, pm10: 142.0, no2: 31.0, so2: 11.0, co: 1.2, o3: 25.0, nh3: 17.0 }, station: "Railway Colony CAAQMS, Guwahati", temp: 24.8, humidity: 72, wind: 6.4 }
];

// CPCB Sub-Index Calculation
function computeSubIndex(pollutant, concentration) {
  const p = pollutant.toLowerCase().replace(".", "");
  const ranges = CPCB_BREAKPOINTS[p];
  if (!ranges || concentration === null || isNaN(concentration) || concentration < 0) return null;

  let matched = null;
  for (const [b_lo, b_hi, i_lo, i_hi] of ranges) {
    if (concentration >= b_lo && concentration <= b_hi) {
      matched = [b_lo, b_hi, i_lo, i_hi];
      break;
    }
  }

  if (!matched) {
    if (concentration > ranges[ranges.length - 1][1]) {
      matched = ranges[ranges.length - 1];
    } else {
      return null;
    }
  }

  const [b_lo, b_hi, i_lo, i_hi] = matched;
  const subIndex = ((i_hi - i_lo) / (b_hi - b_lo)) * (concentration - b_lo) + i_lo;
  const rounded = Math.min(500, Math.max(0, Math.round(subIndex)));

  return {
    pollutant: POLLUTANT_NAMES[p] || pollutant,
    concentration: concentration,
    unit: POLLUTANT_UNITS[p] || "µg/m³",
    b_lo, b_hi, i_lo, i_hi,
    sub_index: rounded,
    formula: `[(${i_hi} - ${i_lo}) / (${b_hi} - ${b_lo})] × (${concentration} - ${b_lo}) + ${i_lo}`
  };
}

function getAQICategory(aqi) {
  if (aqi <= 50) {
    return { name: "Good", color: "#10B981", textColor: "#ffffff", desc: "Air quality is considered satisfactory, and air pollution poses little or no risk." };
  } else if (aqi <= 100) {
    return { name: "Satisfactory", color: "#84CC16", textColor: "#111827", desc: "Minor breathing discomfort to sensitive people." };
  } else if (aqi <= 200) {
    return { name: "Moderate", color: "#F59E0B", textColor: "#111827", desc: "Breathing discomfort to people with lungs, asthma and heart diseases." };
  } else if (aqi <= 300) {
    return { name: "Poor", color: "#F97316", textColor: "#ffffff", desc: "Breathing discomfort to most people on prolonged exposure." };
  } else if (aqi <= 400) {
    return { name: "Very Poor", color: "#EF4444", textColor: "#ffffff", desc: "Respiratory illness on prolonged exposure. Significant risk for elderlies and children." };
  } else {
    return { name: "Severe", color: "#A855F7", textColor: "#ffffff", desc: "Emergency condition. Seriously affects healthy people and severely impacts sensitive groups." };
  }
}

function calculateOverallAQI(pollutants) {
  let subIndices = {};
  let breakdowns = [];

  for (const [key, val] of Object.entries(pollutants)) {
    if (val !== null && !isNaN(val)) {
      const step = computeSubIndex(key, parseFloat(val));
      if (step) {
        subIndices[key] = step.sub_index;
        breakdowns.push(step);
      }
    }
  }

  if (Object.keys(subIndices).length === 0) {
    return { aqi: 0, category: "No Data", color: "#6B7280", textColor: "#fff", dominant: "None", breakdowns: [] };
  }

  let dominant = "pm25";
  let maxAQI = -1;
  for (const [k, v] of Object.entries(subIndices)) {
    if (v > maxAQI) {
      maxAQI = v;
      dominant = k;
    }
  }

  const category = getAQICategory(maxAQI);
  return {
    aqi: maxAQI,
    category: category.name,
    color: category.color,
    textColor: category.textColor,
    desc: category.desc,
    dominant: dominant,
    dominantName: POLLUTANT_NAMES[dominant] || dominant.toUpperCase(),
    subIndices,
    breakdowns
  };
}

// Global App State
let currentCity = INDIAN_CITIES_DATA[0];
let leafletMap = null;
let mapMarkers = [];
let alertThreshold = 200;

// Initialize Web Application with Safety Guards
document.addEventListener("DOMContentLoaded", () => {
  initCitySelector();
  initIndiaMap();
  loadCityData("delhi");
  initCalculatorControls();
  initAlertControls();
});

// Additional window load trigger to guarantee map size rendering
window.addEventListener("load", () => {
  setTimeout(() => {
    if (leafletMap) {
      leafletMap.invalidateSize();
    }
  }, 250);
});

// City Selector Dropdown
function initCitySelector() {
  const select = document.getElementById("citySelector");
  if (!select) return;

  select.innerHTML = "";
  INDIAN_CITIES_DATA.forEach(city => {
    const aqiRes = calculateOverallAQI(city.pollutants);
    const opt = document.createElement("option");
    opt.value = city.id;
    opt.textContent = `${city.name} (${city.state}) - AQI ${aqiRes.aqi}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    loadCityData(e.target.value);
  });
}

// Load City Data: Queries Backend or falls back to local data
async function loadCityData(cityId) {
  let backendData = null;
  try {
    const res = await fetch(`/api/city/${cityId}`);
    if (res.ok) {
      backendData = await res.json();
    }
  } catch (err) {
    console.log("Backend offline, using local data service:", err);
  }

  if (backendData) {
    applyCityData(backendData.city_info, backendData.aqi_data);
  } else {
    const city = INDIAN_CITIES_DATA.find(c => c.id === cityId) || INDIAN_CITIES_DATA[0];
    const aqiRes = calculateOverallAQI(city.pollutants);
    applyCityData(city, aqiRes);
  }
}

// Unified UI update function
function applyCityData(info, aqi) {
  currentCity = INDIAN_CITIES_DATA.find(c => c.id === info.id) || currentCity;

  // Header display
  const nameEl = document.getElementById("cityNameDisplay");
  if (nameEl) nameEl.textContent = info.name;

  const stationEl = document.getElementById("stationDisplay");
  if (stationEl) stationEl.textContent = info.station;

  const dateEl = document.getElementById("stationDateDisplay");
  if (dateEl) dateEl.textContent = info.timestamp || new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  // AQI Circle
  const aqiBadge = document.getElementById("aqiCircleBadge");
  const aqiVal = document.getElementById("aqiDisplayValue");
  const aqiCat = document.getElementById("aqiCategoryBadge");
  const aqiDesc = document.getElementById("aqiDescription");
  const dominantBadge = document.getElementById("dominantPollutantBadge");

  const aqiScore = aqi.aqi;
  const aqiColor = aqi.color;
  const aqiCategoryName = aqi.category;
  const dominantName = aqi.dominant_name || aqi.dominantName || "PM2.5";

  if (aqiVal) aqiVal.textContent = aqiScore;
  if (aqiBadge) aqiBadge.style.backgroundColor = aqiColor;
  if (aqiCat) {
    aqiCat.textContent = aqiCategoryName;
    aqiCat.style.backgroundColor = aqiColor;
    aqiCat.style.color = aqi.textColor || "#ffffff";
  }
  if (aqiDesc) aqiDesc.textContent = aqi.description || aqi.desc || "Monitored as per CPCB CAAQMS guidelines.";
  if (dominantBadge) {
    dominantBadge.textContent = `Dominant Pollutant: ${dominantName} (Sub-index: ${aqiScore})`;
  }

  // Weather stats
  const tempEl = document.getElementById("weatherTemp");
  if (tempEl) tempEl.textContent = `${info.temp}°C`;

  const humEl = document.getElementById("weatherHumidity");
  if (humEl) humEl.textContent = `${info.humidity}%`;

  const windEl = document.getElementById("weatherWind");
  if (windEl) windEl.textContent = `${info.wind_speed || info.wind || 6.5} km/h`;

  // Check alert threshold
  checkAlertThreshold(aqiScore, info.name);

  // Pan Map
  if (leafletMap && info.lat && info.lon) {
    leafletMap.flyTo([info.lat, info.lon], 7, { duration: 1.2 });
  }
}

// Interactive India Map (Robust Initialization with Zero Broken Tiles)
function initIndiaMap() {
  const mapElement = document.getElementById("indiaMap");
  if (!mapElement || typeof L === 'undefined') {
    return;
  }

  // Clear existing map instance if any to prevent Leaflet container re-init error
  if (leafletMap) {
    try {
      leafletMap.remove();
    } catch (e) {
      console.warn("Map cleanup notice:", e);
    }
    leafletMap = null;
  }

  try {
    leafletMap = L.map("indiaMap", {
      center: [22.5, 79.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      scrollWheelZoom: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    mapMarkers = [];

    // Add circular markers for all 20 cities
    INDIAN_CITIES_DATA.forEach(city => {
      const aqiRes = calculateOverallAQI(city.pollutants);

      const marker = L.circleMarker([city.lat, city.lon], {
        radius: 11,
        fillColor: aqiRes.color,
        color: "#ffffff",
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.95
      }).addTo(leafletMap);

      // Tooltip on hover
      marker.bindTooltip(`<b>${city.name}</b>: AQI ${aqiRes.aqi} (${aqiRes.category})`, {
        direction: 'top',
        offset: [0, -8],
        className: 'custom-map-tooltip'
      });

      // Interactive Popup
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 170px; padding: 4px;">
          <h6 style="margin: 0 0 2px 0; font-weight: 700; color: #f8fafc; font-size: 0.95rem;">${city.name}</h6>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 8px;">${city.state}</div>
          <div style="background: ${aqiRes.color}; color: ${aqiRes.textColor}; padding: 6px 10px; border-radius: 6px; font-weight: 700; text-align: center; margin-bottom: 8px; font-size: 0.85rem;">
            AQI: ${aqiRes.aqi} &bull; ${aqiRes.category}
          </div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-bottom: 8px;">
            Dominant: <strong style="color: #F59E0B;">${aqiRes.dominantName}</strong>
          </div>
          <button onclick="window.selectCityFromMap('${city.id}')" style="width: 100%; background: #F59E0B; color: #13091B; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer;">
            <i class="fa-solid fa-gauge me-1"></i> View Full Dashboard
          </button>
        </div>
      `);

      mapMarkers.push(marker);
    });

    // Invalidate map size to ensure full render
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 150);
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 400);
    setTimeout(() => { if (leafletMap) leafletMap.invalidateSize(); }, 900);

  } catch (err) {
    console.error("Leaflet map initialization error:", err);
  }
}

// Reset Map View to default center
window.resetMapView = function() {
  if (leafletMap) {
    leafletMap.setView([22.5, 79.0], 5);
    leafletMap.invalidateSize();
  }
};

window.selectCityFromMap = function(cityId) {
  const select = document.getElementById("citySelector");
  if (select) select.value = cityId;
  loadCityData(cityId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// AQI Calculator Controls (Connects to Backend POST /api/calculate with Client Fallback)
function initCalculatorControls() {
  const calcBtn = document.getElementById("btnComputeAQI");
  if (!calcBtn) return;

  calcBtn.addEventListener("click", async () => {
    let pm25 = parseFloat(document.getElementById("calc_pm25").value);
    let pm10 = parseFloat(document.getElementById("calc_pm10").value);
    let no2 = parseFloat(document.getElementById("calc_no2").value);
    let so2 = parseFloat(document.getElementById("calc_so2").value);
    let co = parseFloat(document.getElementById("calc_co").value);
    let o3 = parseFloat(document.getElementById("calc_o3").value);
    let nh3 = parseFloat(document.getElementById("calc_nh3").value);

    // If inputs are blank, provide standard defaults
    if (isNaN(pm25) && isNaN(pm10) && isNaN(no2) && isNaN(so2) && isNaN(co) && isNaN(o3) && isNaN(nh3)) {
      document.getElementById("calc_pm25").value = 95;
      document.getElementById("calc_pm10").value = 160;
      document.getElementById("calc_no2").value = 52;
      document.getElementById("calc_so2").value = 24;
      document.getElementById("calc_co").value = 1.6;
      document.getElementById("calc_o3").value = 42;
      document.getElementById("calc_nh3").value = 28;
      pm25 = 95; pm10 = 160; no2 = 52; so2 = 24; co = 1.6; o3 = 42; nh3 = 28;
    }

    const payload = {};
    if (!isNaN(pm25)) payload.pm25 = pm25;
    if (!isNaN(pm10)) payload.pm10 = pm10;
    if (!isNaN(no2)) payload.no2 = no2;
    if (!isNaN(so2)) payload.so2 = so2;
    if (!isNaN(co)) payload.co = co;
    if (!isNaN(o3)) payload.o3 = o3;
    if (!isNaN(nh3)) payload.nh3 = nh3;

    // Button loading state
    const originalText = calcBtn.innerHTML;
    calcBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2"></i> Computing...`;
    calcBtn.disabled = true;

    let computedAqi = null;

    // 1. Try FastAPI Backend
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        computedAqi = data.aqi_data;
      }
    } catch (err) {
      console.log("Backend calculation failed, using local fallback:", err);
    }

    // 2. Fallback to Local Engine if backend offline
    if (!computedAqi) {
      computedAqi = calculateOverallAQI(payload);
    }

    // Render results
    renderCalculationResults(computedAqi);

    // Restore button
    calcBtn.innerHTML = originalText;
    calcBtn.disabled = false;
  });
}

function renderCalculationResults(res) {
  const resContainer = document.getElementById("calcResultsBox");
  if (!resContainer) return;

  resContainer.classList.remove("d-none");
  resContainer.scrollIntoView({ behavior: "smooth" });

  const aqiEl = document.getElementById("calcResultAqi");
  if (aqiEl) aqiEl.textContent = res.aqi;

  const catEl = document.getElementById("calcResultCat");
  if (catEl) {
    catEl.textContent = res.category;
    catEl.style.backgroundColor = res.color;
    catEl.style.color = res.textColor || "#ffffff";
  }

  const domEl = document.getElementById("calcResultDominant");
  if (domEl) {
    domEl.textContent = res.dominant_name || res.dominantName || "PM2.5";
  }

  // Render step-by-step breakdown table
  const tbody = document.getElementById("calcStepsTableBody");
  if (tbody) {
    tbody.innerHTML = "";
    const breakdowns = res.breakdowns || [];

    breakdowns.forEach(step => {
      const cat = getAQICategory(step.sub_index);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="fw-bold">${step.pollutant}</td>
        <td>${step.concentration} ${step.unit}</td>
        <td>[${step.b_lo} - ${step.b_hi}]</td>
        <td>[${step.i_lo} - ${step.i_hi}]</td>
        <td><code>${step.formula}</code></td>
        <td class="fw-bold" style="color: ${cat.color}">${step.sub_index}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Preset Buttons for Calculator
window.loadCalcPreset = function(type) {
  const presets = {
    clean: { pm25: 18, pm10: 32, no2: 15, so2: 8, co: 0.5, o3: 20, nh3: 10 },
    delhi_severe: { pm25: 285, pm10: 420, no2: 95, so2: 32, co: 3.8, o3: 55, nh3: 65 },
    moderate: { pm25: 65, pm10: 140, no2: 45, so2: 18, co: 1.4, o3: 35, nh3: 22 },
    industrial_so2: { pm25: 45, pm10: 85, no2: 60, so2: 410, co: 2.2, o3: 30, nh3: 15 }
  };

  const p = presets[type];
  if (!p) return;

  document.getElementById("calc_pm25").value = p.pm25;
  document.getElementById("calc_pm10").value = p.pm10;
  document.getElementById("calc_no2").value = p.no2;
  document.getElementById("calc_so2").value = p.so2;
  document.getElementById("calc_co").value = p.co;
  document.getElementById("calc_o3").value = p.o3;
  document.getElementById("calc_nh3").value = p.nh3;

  const btn = document.getElementById("btnComputeAQI");
  if (btn) btn.click();
};

// Alert Controls
function initAlertControls() {
  const alertInput = document.getElementById("alertThresholdInput");
  if (alertInput) {
    alertInput.addEventListener("input", (e) => {
      alertThreshold = parseInt(e.target.value) || 200;
      const aqiRes = calculateOverallAQI(currentCity.pollutants);
      checkAlertThreshold(aqiRes.aqi, currentCity.name);
    });
  }
}

function checkAlertThreshold(aqi, cityName) {
  const banner = document.getElementById("alertBanner");
  if (!banner) return;

  if (aqi >= alertThreshold) {
    banner.classList.remove("d-none");
    const bannerText = document.getElementById("alertBannerText");
    if (bannerText) {
      bannerText.innerHTML = `
        <strong>AQI Warning Alert:</strong> AQI in <b>${cityName}</b> is currently <b>${aqi}</b>, exceeding your set threshold of ${alertThreshold}! High-risk precautions recommended.
      `;
    }
  } else {
    banner.classList.add("d-none");
  }
}

// Export CSV Feature
window.exportCityCSV = function() {
  const cityId = currentCity ? currentCity.id : "delhi";
  const backendExportUrl = `/api/export/${cityId}`;
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = backendExportUrl;
  document.body.appendChild(iframe);

  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 3000);

  // Client-side fallback generator
  const aqiRes = calculateOverallAQI(currentCity.pollutants);
  const rows = [
    ["Parameter", "Value", "Unit"],
    ["City", currentCity.name, ""],
    ["State", currentCity.state, ""],
    ["Station", currentCity.station, ""],
    ["Overall AQI", aqiRes.aqi, "CPCB Scale"],
    ["AQI Category", aqiRes.category, ""],
    ["Dominant Pollutant", aqiRes.dominantName, ""],
    ["PM2.5", currentCity.pollutants.pm25, "µg/m³"],
    ["PM10", currentCity.pollutants.pm10, "µg/m³"],
    ["NO2", currentCity.pollutants.no2, "µg/m³"],
    ["SO2", currentCity.pollutants.so2, "µg/m³"],
    ["CO", currentCity.pollutants.co, "mg/m³"],
    ["O3", currentCity.pollutants.o3, "µg/m³"],
    ["NH3", currentCity.pollutants.nh3, "µg/m³"],
    ["Export Date", new Date().toISOString(), "UTC"]
  ];

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AirSense_${currentCity.id}_AQI_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Print / PDF Report
window.printReport = function() {
  window.print();
};
