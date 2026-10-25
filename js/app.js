/**
 * AirSense India - Web Application Client Logic
 * Author: Preethish (College Project)
 * Real-time CPCB & IQAir AQI monitoring, Major Air Pollutants, Air Quality Calendar & CPCB Calculator
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

// 20 Major Indian Cities Baseline Telemetry
const INDIAN_CITIES_LIST = [
  { id: "delhi", name: "Delhi NCR", state: "Delhi", lat: 28.6139, lon: 77.2090, aqi: 166, cat: "Unhealthy", pm25: 78, pm10: 159, co: 2661, so2: 5, no2: 3, o3: 4, rank: 74, temp: 34.0, humidity: 17, wind: 10.4, station: "Anand Vihar CAAQMS Station" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, aqi: 118, cat: "Poor", pm25: 68, pm10: 118, co: 1200, so2: 15, no2: 44, o3: 28, rank: 98, temp: 30.2, humidity: 78, wind: 14.5, station: "BKC Bandra CAAQMS Station" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, aqi: 62, cat: "Moderate", pm25: 38, pm10: 62, co: 800, so2: 8, no2: 26, o3: 22, rank: 145, temp: 23.0, humidity: 55, wind: 11.2, station: "Hebbal CAAQMS Station" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, aqi: 155, cat: "Poor", pm25: 128, pm10: 195, co: 1900, so2: 22, no2: 58, o3: 36, rank: 82, temp: 27.8, humidity: 70, wind: 7.5, station: "Victoria Memorial CAAQMS" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, aqi: 76, cat: "Moderate", pm25: 48, pm10: 76, co: 900, so2: 12, no2: 28, o3: 24, rank: 132, temp: 31.4, humidity: 74, wind: 16.0, station: "Velachery CAAQMS Station" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, aqi: 98, cat: "Moderate", pm25: 58, pm10: 98, co: 1100, so2: 11, no2: 38, o3: 32, rank: 115, temp: 28.5, humidity: 52, wind: 9.4, station: "Sanathnagar CAAQMS" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, aqi: 142, cat: "Poor", pm25: 94, pm10: 164, co: 1600, so2: 24, no2: 49, o3: 39, rank: 89, temp: 31.0, humidity: 44, wind: 8.1, station: "Maninagar CAAQMS Station" },
  { id: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, aqi: 88, cat: "Moderate", pm25: 54, pm10: 88, co: 1000, so2: 14, no2: 32, o3: 26, rank: 124, temp: 26.2, humidity: 58, wind: 10.3, station: "Shivajinagar CAAQMS" },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, aqi: 184, cat: "Unhealthy", pm25: 178, pm10: 284, co: 2600, so2: 21, no2: 66, o3: 44, rank: 68, temp: 23.8, humidity: 65, wind: 5.4, station: "Talkatora CAAQMS Station" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, aqi: 148, cat: "Poor", pm25: 112, pm10: 210, co: 1800, so2: 19, no2: 51, o3: 38, rank: 85, temp: 28.0, humidity: 38, wind: 7.2, station: "Adarsh Nagar CAAQMS" },
  { id: "patna", name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, aqi: 195, cat: "Unhealthy", pm25: 185, pm10: 295, co: 2900, so2: 26, no2: 69, o3: 45, rank: 62, temp: 25.0, humidity: 68, wind: 4.9, station: "Samarpal CAAQMS Station" },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, aqi: 178, cat: "Unhealthy", pm25: 162, pm10: 268, co: 2500, so2: 20, no2: 63, o3: 41, rank: 71, temp: 24.1, humidity: 64, wind: 5.8, station: "Nehru Nagar CAAQMS Station" },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, aqi: 164, cat: "Unhealthy", pm25: 145, pm10: 235, co: 2100, so2: 18, no2: 55, o3: 37, rank: 76, temp: 25.6, humidity: 63, wind: 6.1, station: "BHU CAAQMS Station" },
  { id: "chandigarh", name: "Chandigarh", state: "Punjab", lat: 30.7333, lon: 76.7794, aqi: 110, cat: "Poor", pm25: 82, pm10: 138, co: 1300, so2: 12, no2: 36, o3: 30, rank: 104, temp: 22.4, humidity: 58, wind: 8.7, station: "Sector 22 CAAQMS Station" },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, aqi: 72, cat: "Moderate", pm25: 44, pm10: 72, co: 900, so2: 17, no2: 29, o3: 21, rank: 138, temp: 29.8, humidity: 76, wind: 15.2, station: "Gajuwaka CAAQMS" },
  { id: "surat", name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, aqi: 125, cat: "Poor", pm25: 78, pm10: 132, co: 1400, so2: 21, no2: 42, o3: 31, rank: 94, temp: 30.5, humidity: 66, wind: 11.5, station: "SVNIT CAAQMS" },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, aqi: 92, cat: "Moderate", pm25: 66, pm10: 115, co: 1100, so2: 13, no2: 34, o3: 27, rank: 120, temp: 27.2, humidity: 49, wind: 9.0, station: "Paryavaran Parisar" },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, aqi: 98, cat: "Moderate", pm25: 72, pm10: 124, co: 1300, so2: 15, no2: 37, o3: 29, rank: 116, temp: 27.6, humidity: 47, wind: 9.8, station: "Chhoti Gwaltoli CAAQMS" },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, aqi: 45, cat: "Good", pm25: 32, pm10: 52, co: 600, so2: 7, no2: 19, o3: 18, rank: 185, temp: 29.0, humidity: 82, wind: 13.8, station: "Vyttila CAAQMS Station" },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, aqi: 115, cat: "Poor", pm25: 88, pm10: 142, co: 1200, so2: 11, no2: 31, o3: 25, rank: 101, temp: 24.8, humidity: 72, wind: 6.4, station: "Railway Colony CAAQMS" }
];

// App State
let currentCityId = "delhi";
let currentYear = 2026;
let currentStandard = "us"; // "us" or "cpcb"
let calendarMonths = [8, 9, 10]; // August, September, October
let mainLeafletMap = null;
let miniLeafletMap = null;
let mapMarkers = [];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initApiKeys();
  initEventListeners();
  initMaps();
  loadCity(currentCityId);
});

// Setup Stored API Keys
function initApiKeys() {
  const iqairKey = localStorage.getItem("airsense_iqair_key") || "";
  const owKey = localStorage.getItem("airsense_openweather_key") || "";
  
  const elIqair = document.getElementById("inputIqairKey");
  const elOw = document.getElementById("inputOpenweatherKey");
  if (elIqair) elIqair.value = iqairKey;
  if (elOw) elOw.value = owKey;
}

// Event Listeners
function initEventListeners() {
  // City Selectors
  const navCity = document.getElementById("navCitySelector");
  if (navCity) {
    navCity.addEventListener("change", (e) => {
      loadCity(e.target.value);
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

// Load City Telemetry
async function loadCity(cityId) {
  currentCityId = cityId;

  // Sync nav selector
  const navCity = document.getElementById("navCitySelector");
  if (navCity && navCity.value !== cityId) navCity.value = cityId;

  const iqairKey = localStorage.getItem("airsense_iqair_key") || "";
  const owKey = localStorage.getItem("airsense_openweather_key") || "";

  // Try fetching from FastAPI backend
  try {
    const url = `/api/city/${cityId}?openweather_key=${encodeURIComponent(owKey)}&iqair_key=${encodeURIComponent(iqairKey)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      renderHero(data);
      renderMajorPollutants(data);
      renderCalendar(cityId, currentYear, calendarMonths);
      updateMapFocus(data.city_info.lat, data.city_info.lon);
      return;
    }
  } catch (err) {
    console.log("Backend offline, utilizing client CAAQMS dataset:", err);
  }

  // Fallback to local dataset (e.g. GitHub Pages static serving)
  const city = INDIAN_CITIES_LIST.find(c => c.id === cityId) || INDIAN_CITIES_LIST[0];
  const mockDetails = generateClientCityData(city);
  renderHero(mockDetails);
  renderMajorPollutants(mockDetails);
  renderCalendar(cityId, currentYear, calendarMonths);
  updateMapFocus(city.lat, city.lon);
}

// Generate Mock City Data for static mode
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
      { id: "pm25", name: "Particulate Matter", symbol: "(PM2.5)", value: pm25Val, unit: "µg/m³", color: "#FF7E00", alert: false },
      { id: "pm10", name: "Particulate Matter", symbol: "(PM10)", value: pm10Val, unit: "µg/m³", color: "#FF7E00", alert: true },
      { id: "co", name: "Carbon Monoxide", symbol: "(CO)", value: coVal, unit: "ppb", color: "#00E400", alert: false },
      { id: "so2", name: "Sulfur Dioxide", symbol: "(SO2)", value: so2Val, unit: "ppb", color: "#00E400", alert: false },
      { id: "no2", name: "Nitrogen Dioxide", symbol: "(NO2)", value: no2Val, unit: "ppb", color: "#00E400", alert: false },
      { id: "o3", name: "Ozone", symbol: "(O3)", value: o3Val, unit: "ppb", color: "#00E400", alert: false }
    ]
  };
}

// Render Hero Section (Photo 3)
function renderHero(data) {
  const info = data.city_info;
  const aqi = data.aqi_data.aqi;
  const cat = data.aqi_data.category;
  const color = data.aqi_data.color;

  // Meta row
  const title = document.getElementById("heroCityTitle");
  if (title) title.textContent = `${info.name} Air Quality Index (AQI) | Air Pollution`;

  const sub = document.getElementById("heroCitySubtitle");
  if (sub) sub.textContent = `Real-time PM2.5, PM10 air pollution level in ${info.name}`;

  const time = document.getElementById("lastUpdatedTime");
  if (time) time.textContent = info.timestamp;

  // AQI Values
  const aqiNum = document.getElementById("heroAqiNumber");
  if (aqiNum) aqiNum.textContent = aqi;

  const aqiCat = document.getElementById("heroAqiCategory");
  if (aqiCat) {
    aqiCat.textContent = cat;
    aqiCat.style.backgroundColor = getCategoryBgColor(aqi);
    aqiCat.style.color = getCategoryTextColor(aqi);
  }

  // Dynamic Pastel Banner Background
  const bannerBg = document.getElementById("heroBannerBg");
  if (bannerBg) {
    bannerBg.style.background = getCategoryGradient(aqi);
  }

  // Pointer position on rainbow spectrum bar (0 to 500)
  const pointer = document.getElementById("heroSpectrumPointer");
  if (pointer) {
    let pct = (aqi / 350) * 100;
    pct = Math.max(2, Math.min(98, pct));
    pointer.style.left = `${pct}%`;
  }

  // Sub pollutants in hero
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

  // Weather Card in Hero
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

  // Rank Bar
  const rankNum = document.getElementById("heroCityRank");
  if (rankNum) rankNum.textContent = `${info.rank}th`;

  const rankText = document.getElementById("heroRankText");
  if (rankText) rankText.textContent = info.rank_text || `Currently, ${info.name} ranks ${info.rank}th among the most polluted cities globally.`;

  // Links in section headers
  const link1 = document.getElementById("pollutantsCityLink");
  if (link1) link1.textContent = info.name;

  const link2 = document.getElementById("calCityLink");
  if (link2) link2.textContent = info.name;

  const miniName = document.getElementById("miniMapCityName");
  if (miniName) miniName.textContent = info.name;
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
    console.log("Calendar fetch fallback to client generator:", e);
  }

  // Client-side fallback calendar generator
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

// Client Calendar Generator matching Photo 2 values for Delhi
function generateClientCalendar(cityId, year, months) {
  const monthNames = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
  };
  const shortNames = {
    1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.",
    5: "May.", 6: "Jun.", 7: "Jul.", 8: "Aug.",
    9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec."
  };

  const isDelhi = cityId.toLowerCase().includes("delhi");
  
  // Exact values from Photo 2 for Delhi
  const photoValues = {
    8: { 1: 127, 4: 95, 5: 126, 6: 110, 7: 114, 8: 120, 11: 141, 12: 147, 13: 127, 14: 123, 15: 132, 18: 94, 19: 104, 20: 115, 21: 104, 22: 98, 25: 137, 26: 150, 27: 138, 28: 109, 29: 95 },
    9: { 1: 94, 2: 108, 3: 102, 4: 100, 5: 107, 6: 99, 7: 140, 8: 108, 9: 103, 10: 106, 11: 130, 12: 112, 13: 116, 14: 125, 15: 145, 16: 121, 17: 132, 18: 107, 19: 151, 20: 166, 21: 162, 22: 164, 23: 166, 24: 146, 25: 82, 26: 79, 27: 69, 28: 97, 29: 131, 30: 144 },
    10: { 1: 146, 2: 148, 3: 146, 4: 136, 5: 131, 6: 136, 7: 146, 8: 159, 9: 164, 10: 155, 11: 138, 12: 123, 13: 178, 14: 178, 15: 151, 16: 145, 17: 178, 18: 176, 19: 161, 20: 192, 21: 221, 22: 210, 23: 214, 24: 184 }
  };

  const results = [];

  months.forEach(m => {
    const daysInMonth = new Date(year, m, 0).getDate();
    const firstDayIndex = new Date(year, m - 1, 1).getDay(); // 0 is Sunday
    const daysData = [];

    // Preceding empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      daysData.push(null);
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      let aqiVal;
      if (isDelhi && photoValues[m] && photoValues[m][dayNum]) {
        aqiVal = photoValues[m][dayNum];
      } else {
        const seed = (year * 100 + m * 31 + dayNum) % 100;
        aqiVal = m === 8 ? (85 + seed % 45) : (m === 9 ? (100 + seed % 65) : (140 + seed % 85));
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

// Calendar Month Shift Controls
window.prevCalendarMonths = function() {
  calendarMonths = calendarMonths.map(m => m <= 1 ? 12 : m - 1);
  renderCalendar(currentCityId, currentYear, calendarMonths);
};

window.nextCalendarMonths = function() {
  calendarMonths = calendarMonths.map(m => m >= 12 ? 1 : m + 1);
  renderCalendar(currentCityId, currentYear, calendarMonths);
};

// Initialize Leaflet Maps
function initMaps() {
  // 1. Mini Map in Hero (Photo 3)
  const miniEl = document.getElementById("miniMap");
  if (miniEl && !miniLeafletMap) {
    miniLeafletMap = L.map("miniMap", { zoomControl: false, attributionControl: false }).setView([28.6139, 77.2090], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 18 }).addTo(miniLeafletMap);
  }

  // 2. Main India Interactive Map
  const mapEl = document.getElementById("indiaMap");
  if (mapEl && !mainLeafletMap) {
    mainLeafletMap = L.map("indiaMap").setView([22.5, 79.5], 5);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mainLeafletMap);

    // Plot all 20 cities on map
    INDIAN_CITIES_LIST.forEach(city => {
      const color = getAqiColor(city.aqi);
      const icon = L.divIcon({
        className: "custom-map-pin",
        html: `<div style="background-color: ${color}; color: ${color === '#FFFF00' ? '#7A6800' : '#FFFFFF'}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: pointer;">${city.aqi}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([city.lat, city.lon], { icon: icon }).addTo(mainLeafletMap);
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h6 style="margin: 0 0 4px 0; font-weight: 800; color: #0F172A;">${city.name}</h6>
          <div style="font-size: 0.8rem; color: #64748B;">${city.station}</div>
          <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="background: ${color}; color: ${color === '#FFFF00' ? '#7A6800' : '#FFFFFF'}; padding: 3px 10px; border-radius: 12px; font-weight: 800; font-size: 0.8rem;">AQI ${city.aqi}</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #0F172A;">${city.cat}</span>
          </div>
          <button onclick="window.loadCity('${city.id}')" style="margin-top: 10px; width: 100%; border: none; background: #0284C7; color: #FFFFFF; padding: 5px 10px; border-radius: 6px; font-weight: 600; font-size: 0.78rem; cursor: pointer;">View City Telemetry</button>
        </div>
      `);

      mapMarkers.push({ id: city.id, marker: marker });
    });
  }
}

// Update Map Focus when city changes
function updateMapFocus(lat, lon) {
  if (miniLeafletMap) {
    miniLeafletMap.setView([lat, lon], 11);
    miniLeafletMap.eachLayer(layer => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        miniLeafletMap.removeLayer(layer);
      }
    });
    // Add pulsing circle marker for active city in mini map
    L.circleMarker([lat, lon], {
      radius: 14,
      fillColor: "#EF4444",
      color: "#FFFFFF",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(miniLeafletMap);
  }

  if (mainLeafletMap) {
    mainLeafletMap.panTo([lat, lon]);
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

    let matched = null;
    for (const [b_lo, b_hi, i_lo, i_hi] of ranges) {
      if (conc >= b_lo && conc <= b_hi) {
        matched = [b_lo, b_hi, i_lo, i_hi];
        break;
      }
    }
    if (!matched && conc > ranges[ranges.length - 1][1]) {
      const last = ranges[ranges.length - 1];
      matched = [last[0], last[1], last[2], last[3]];
    }

    if (matched) {
      const [b_lo, b_hi, i_lo, i_hi] = matched;
      const sub = Math.round(i_lo + ((i_hi - i_lo) / (b_hi - b_lo)) * (conc - b_lo));
      subIndices[p] = sub;
      steps.push({
        pollutant: p.toUpperCase(),
        conc: conc,
        b_range: `[${b_lo} - ${b_hi}]`,
        i_range: `[${i_lo} - ${i_hi}]`,
        formula: `${i_lo} + [(${i_hi} - ${i_lo})/(${b_hi} - ${b_lo})] × (${conc} - ${b_lo})`,
        sub_index: sub
      });
    }
  }

  if (steps.length === 0) {
    alert("Please provide at least one valid pollutant concentration value.");
    return;
  }

  // Find max sub-index as overall AQI
  let maxSub = 0;
  let dominant = "";
  for (const [p, sub] of Object.entries(subIndices)) {
    if (sub > maxSub) {
      maxSub = sub;
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
    console.log("Direct backend live fetch error, using city baseline:", err);
  }

  // Fallback to active city telemetry
  const city = INDIAN_CITIES_LIST.find(c => c.id === currentCityId) || INDIAN_CITIES_LIST[0];
  document.getElementById("calc_pm25").value = city.pm25;
  document.getElementById("calc_pm10").value = city.pm10;
  document.getElementById("calc_no2").value = city.no2;
  document.getElementById("calc_so2").value = city.so2;
  document.getElementById("calc_co").value = (city.co / 1000).toFixed(1);
  document.getElementById("calc_o3").value = city.o3;
  document.getElementById("calc_nh3").value = 22;
  computeAqi();
};

// Preset Scenarios
window.loadCalcPreset = function(type) {
  if (type === "clean") {
    document.getElementById("calc_pm25").value = 18;
    document.getElementById("calc_pm10").value = 32;
    document.getElementById("calc_no2").value = 14;
    document.getElementById("calc_so2").value = 6;
    document.getElementById("calc_co").value = 0.5;
    document.getElementById("calc_o3").value = 16;
    document.getElementById("calc_nh3").value = 10;
  } else if (type === "moderate") {
    document.getElementById("calc_pm25").value = 52;
    document.getElementById("calc_pm10").value = 88;
    document.getElementById("calc_no2").value = 34;
    document.getElementById("calc_so2").value = 14;
    document.getElementById("calc_co").value = 1.2;
    document.getElementById("calc_o3").value = 28;
    document.getElementById("calc_nh3").value = 18;
  } else if (type === "delhi_severe") {
    document.getElementById("calc_pm25").value = 240;
    document.getElementById("calc_pm10").value = 380;
    document.getElementById("calc_no2").value = 92;
    document.getElementById("calc_so2").value = 32;
    document.getElementById("calc_co").value = 3.8;
    document.getElementById("calc_o3").value = 54;
    document.getElementById("calc_nh3").value = 64;
  } else if (type === "industrial_so2") {
    document.getElementById("calc_pm25").value = 65;
    document.getElementById("calc_pm10").value = 110;
    document.getElementById("calc_no2").value = 45;
    document.getElementById("calc_so2").value = 420;
    document.getElementById("calc_co").value = 1.6;
    document.getElementById("calc_o3").value = 32;
    document.getElementById("calc_nh3").value = 26;
  }
  computeAqi();
};

// Helper: Populate Calculator when user clicks a Major Pollutant card
window.populateCalculatorPollutant = function(pollutantId, val) {
  const target = document.getElementById(`calc_${pollutantId}`);
  if (target) {
    if (pollutantId === "co" && val > 100) {
      target.value = (val / 1000).toFixed(1);
    } else {
      target.value = val;
    }
  }
  const calcSec = document.getElementById("calculatorSection");
  if (calcSec) {
    calcSec.scrollIntoView({ behavior: "smooth" });
  }
};

// Save API Keys from Modal
window.saveApiKeys = function() {
  const iqairKey = document.getElementById("inputIqairKey").value.trim();
  const owKey = document.getElementById("inputOpenweatherKey").value.trim();

  localStorage.setItem("airsense_iqair_key", iqairKey);
  localStorage.setItem("airsense_openweather_key", owKey);

  const alertBox = document.getElementById("apiKeyStatusAlert");
  const alertText = document.getElementById("apiKeyStatusText");
  if (alertBox && alertText) {
    alertText.textContent = "API Keys saved successfully! Refreshing telemetry...";
    alertBox.classList.remove("d-none");
  }

  setTimeout(() => {
    const modalEl = document.getElementById("apiSettingsModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    loadCity(currentCityId);
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
      
      // Find nearest city
      let nearest = INDIAN_CITIES_LIST[0];
      let minDist = 999999;
      INDIAN_CITIES_LIST.forEach(c => {
        const d = Math.hypot(c.lat - userLat, c.lon - userLon);
        if (d < minDist) {
          minDist = d;
          nearest = c;
        }
      });
      loadCity(nearest.id);
    },
    () => {
      alert("Unable to retrieve your location. Showing Delhi NCR by default.");
    }
  );
};

// Share AQI
window.shareAQI = function() {
  const city = INDIAN_CITIES_LIST.find(c => c.id === currentCityId) || INDIAN_CITIES_LIST[0];
  const shareText = `Live Air Quality in ${city.name}: AQI ${city.aqi} (${city.cat}). Checked on AirSense India!`;
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

// Export CSV
window.exportCityCSV = function() {
  window.location.href = `/api/export/${currentCityId}`;
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
