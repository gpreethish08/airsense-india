# AirSense India: AQI and Pollution Index Website 🇮🇳
> **Python College Project for Preethish**  
> *Live AQI and Pollution Dashboard with CPCB Sub-Index Calculation, Multi-Pollutant Index, Interactive Maps, Trends & Machine Learning Forecasting.*

---

## 🌐 Live Deployments & Repository

| Service | Link |
| :--- | :--- |
| **GitHub Repository** | [github.com/gpreethish08/airsense-india](https://github.com/gpreethish08/airsense-india) |
| **Vercel Production URL** | [airsense-india.vercel.app](https://airsense-india.vercel.app) *(or connect via 1-click below)* |
| **1-Click Vercel Deploy** | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgpreethish08%2Fairsense-india) |

---

## 📌 Project Overview

AirSense India is a full-stack environmental analytics web application designed according to the official **Central Pollution Control Board (CPCB)** guidelines. It enables citizens, researchers, and students to monitor real-time air quality across 20+ major Indian cities, compute custom sub-indices with step-by-step linear interpolation formulas, compare acute AQI against chronic multi-pollutant chemical burden (CPI), explore spatial distribution on an interactive India map, and analyze 7-day ML forecasts.

---

## 🚀 Key Features

### 1. 🔍 Live AQI Lookup (20+ Indian Metros)
- Real-time data from CAAQMS stations in **Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune, Lucknow, Jaipur, Patna, Kanpur, Varanasi, Chandigarh, Visakhapatnam, Surat, Bhopal, Indore, Kochi, and Guwahati**.
- Monitors 7 key pollutants: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{O}_3$, and $\text{NH}_3$.
- Identifies and highlights the **Dominant Pollutant** driving current health risks.
- Real-time weather parameters: Temperature, Relative Humidity, Wind Speed.

### 2. 🧮 CPCB Sub-Index AQI Calculator
- Implements the exact CPCB linear interpolation formula:
  $$I_p = \frac{I_{\text{HI}} - I_{\text{LO}}}{B_{\text{HI}} - B_{\text{LO}}} \times (C_p - B_{\text{LO}}) + I_{\text{LO}}$$
  $$\text{Overall AQI} = \max(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NO2}}, I_{\text{SO2}}, I_{\text{CO}}, I_{\text{O3}}, I_{\text{NH3}})$$
- Step-by-step mathematical breakdown table showing selected breakpoint brackets for viva presentation.
- Quick scenario preset buttons (*Clean Green Day, Delhi Severe Smog, Bengaluru Spring, Industrial $\text{SO}_2$ Spike*).

### 3. ⚖️ Pollution Index vs. AQI (Side-by-Side Analysis)
- **AQI (Acute Maximum Metric):** Evaluates the single worst pollutant sub-index to trigger urgent public safety measures.
- **Composite Pollution Index (CPI - Chronic Cocktail Burden):** Evaluates multi-pollutant exposure based on national ambient air quality standards (NAAQS):
  $$\text{CPI} = \frac{1}{\sum w_i} \sum \left( w_i \times \frac{C_i}{\text{NAAQS}_i} \times 100 \right)$$
- Explains why AQI and CPI diverge during multi-gas smog episodes.

### 4. 📈 Trends, Diurnal Cycles & Seasonal Patterns
- **24-Hour Diurnal Hourly Trend:** Visualizes rush-hour traffic peaks (8 AM & 7 PM) and night-time surface temperature inversion trapping.
- **Multi-City Comparison:** Side-by-side comparative bar chart across climatic zones.
- **Seasonal Analysis:** Documents the intense **North India winter spike** (stubble burning + temperature inversion) versus coastal marine boundary dispersion in Mumbai and plateau stability in Bengaluru.

### 5. 🏥 Clinical Health Advisory
- Actionable precautions per CPCB category (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).
- Mask recommendations (N95/FFP2 vs cloth masks).
- Outdoor exercise/jogging guidelines.
- Specific medical advice for children, elderly, and asthmatic patients.
- Indoor HEPA purification and ventilation timing advice.

### 6. 🗺️ Interactive India Map (Leaflet.js)
- Color-coded pins for 20 cities matching CPCB category colors.
- Interactive popups with instant dashboard loading on click.

### 7. 🌟 Extra Features for Higher Marks
- **7-Day ML AQI Forecasting:** Machine learning predictive model factoring in atmospheric dispersion, wind speed, humidity, and weekend traffic reductions.
- **Dynamic Alert Threshold:** Customizable threshold setting with visual pulse alert badge.
- **One-Click Export:** Download formatted city air quality report as CSV or printable PDF.

---

## 🎨 CPCB AQI Scale & Color Codes

| AQI Range | Category | Color Code | Health Impact |
| :---: | :---: | :---: | :--- |
| **0 - 50** | Good | `#10B981` (Green) | Minimal impact; clean air. |
| **51 - 100** | Satisfactory | `#84CC16` (Light Green) | Minor breathing discomfort to sensitive people. |
| **101 - 200** | Moderate | `#F59E0B` (Amber) | Breathing discomfort to people with lungs, asthma, and heart diseases. |
| **201 - 300** | Poor | `#F97316` (Orange) | Breathing discomfort to most people on prolonged exposure. |
| **301 - 400** | Very Poor | `#EF4444` (Red) | Respiratory illness on prolonged exposure. |
| **401 - 500** | Severe | `#7C3AED` (Purple) | Affects healthy people and seriously impacts those with existing conditions. |

---

## 🛠️ Tech Stack

- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic
- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, FontAwesome 6
- **Data & Visualizations:** Chart.js, Leaflet.js (OpenStreetMap)
- **Deployment:** Vercel Serverless (`vercel.json`), GitHub Pages

---

## 💻 How to Run Locally

### Prerequisites
Make sure Python 3.8+ is installed on your computer.

### Step 1: Clone the Repository
```bash
git clone https://github.com/gpreethish08/airsense-india.git
cd airsense-india
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the Server
```bash
python app.py
```
*Or with uvicorn:*
```bash
uvicorn app:app --reload --port 8000
```

### Step 4: Open in Browser
Visit **[http://localhost:8000](http://localhost:8000)** in your web browser.  
Interactive Swagger API documentation is available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## ☁️ How to Deploy to Vercel

1. Log in to [vercel.com](https://vercel.com) using your GitHub account (`gpreethish08`).
2. Click **"Add New"** > **"Project"**.
3. Select the repository **`airsense-india`**.
4. Leave default build settings (the project includes `vercel.json` and `api/index.py`).
5. Click **"Deploy"**.
6. Your live website URL will be: **`https://airsense-india.vercel.app`** (or your chosen project slug).

---

## 🎓 College Viva / Project Q&A Reference

### Q1: What is the CPCB sub-index formula?
**Answer:** It is a piecewise linear interpolation:
$I_p = \frac{I_{hi} - I_{lo}}{B_{hi} - B_{lo}} \times (C_p - B_{lo}) + I_{lo}$, where $B_{lo}$ and $B_{hi}$ are the lower and upper pollutant concentration breakpoints, and $I_{lo}$ and $I_{hi}$ are the corresponding AQI scale intervals.

### Q2: What is the minimum requirement for a valid CPCB AQI?
**Answer:** According to CPCB guidelines, at least 3 pollutant sub-indices must be calculated, and at least one of them must be either $\text{PM}_{2.5}$ or $\text{PM}_{10}$.

### Q3: Why does North India experience extreme winter smog spikes?
**Answer:** During winter, low wind speed, calm atmospheric conditions, and shallow boundary layer height cause a **temperature inversion** where cooler air near the ground is trapped under warm air, preventing pollutants from dispersing. Combined with post-monsoon stubble burning in Punjab/Haryana and festive firecracker emissions, particulate concentrations spike dramatically.

### Q4: What is the difference between AQI and Composite Pollution Index (CPI)?
**Answer:** AQI is an **extreme-value index** ($AQI = \max(I_i)$) created for immediate public hazard warnings. If one pollutant is severe, the AQI is severe. In contrast, CPI is a **weighted aggregate** measuring the combined toxic exposure load across all pollutants relative to NAAQS standards.

---

## 👤 Author
- **Preethish** ([@gpreethish08](https://github.com/gpreethish08))
- Python College Project
