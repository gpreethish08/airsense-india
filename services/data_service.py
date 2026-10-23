"""
AirSense India - Data Service
Provides comprehensive Indian cities database, coordinates, CAAQMS sensor data,
hourly diurnal cycles, multi-day historical trends, and seasonal patterns.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import math
import random

from services.aqi_calculator import calculate_overall_aqi, calculate_sub_index
from services.pollution_index import calculate_pollution_index
from services.health_advisory import get_health_advisory
from services.forecast import generate_7day_forecast

# Major Indian Cities CAAQMS Dataset with real geographical coordinates & realistic concentrations
INDIAN_CITIES: Dict[str, Dict[str, Any]] = {
    "Delhi": {
        "id": "delhi",
        "name": "Delhi NCR",
        "state": "National Capital Region",
        "lat": 28.6139,
        "lon": 77.2090,
        "pollutants": {"pm25": 168.0, "pm10": 265.0, "no2": 72.0, "so2": 18.0, "co": 2.8, "o3": 42.0, "nh3": 38.0},
        "station": "Anand Vihar CAAQMS Station, Delhi",
        "temp": 24.5,
        "humidity": 62,
        "wind_speed": 6.8
    },
    "Mumbai": {
        "id": "mumbai",
        "name": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.0760,
        "lon": 72.8777,
        "pollutants": {"pm25": 68.0, "pm10": 118.0, "no2": 44.0, "so2": 15.0, "co": 1.2, "o3": 28.0, "nh3": 19.0},
        "station": "BKC Bandra CAAQMS Station, Mumbai",
        "temp": 30.2,
        "humidity": 78,
        "wind_speed": 14.5
    },
    "Bengaluru": {
        "id": "bengaluru",
        "name": "Bengaluru",
        "state": "Karnataka",
        "lat": 12.9716,
        "lon": 77.5946,
        "pollutants": {"pm25": 38.0, "pm10": 62.0, "no2": 26.0, "so2": 8.0, "co": 0.8, "o3": 22.0, "nh3": 12.0},
        "station": "Hebbal CAAQMS Station, Bengaluru",
        "temp": 23.0,
        "humidity": 55,
        "wind_speed": 11.2
    },
    "Kolkata": {
        "id": "kolkata",
        "name": "Kolkata",
        "state": "West Bengal",
        "lat": 22.5726,
        "lon": 88.3639,
        "pollutants": {"pm25": 128.0, "pm10": 195.0, "no2": 58.0, "so2": 22.0, "co": 1.9, "o3": 36.0, "nh3": 28.0},
        "station": "Victoria Memorial CAAQMS, Kolkata",
        "temp": 27.8,
        "humidity": 70,
        "wind_speed": 7.5
    },
    "Chennai": {
        "id": "chennai",
        "name": "Chennai",
        "state": "Tamil Nadu",
        "lat": 13.0827,
        "lon": 80.2707,
        "pollutants": {"pm25": 48.0, "pm10": 76.0, "no2": 28.0, "so2": 12.0, "co": 0.9, "o3": 24.0, "nh3": 15.0},
        "station": "Velachery CAAQMS Station, Chennai",
        "temp": 31.4,
        "humidity": 74,
        "wind_speed": 16.0
    },
    "Hyderabad": {
        "id": "hyderabad",
        "name": "Hyderabad",
        "state": "Telangana",
        "lat": 17.3850,
        "lon": 78.4867,
        "pollutants": {"pm25": 58.0, "pm10": 98.0, "no2": 38.0, "so2": 11.0, "co": 1.1, "o3": 32.0, "nh3": 20.0},
        "station": "Sanathnagar CAAQMS, Hyderabad",
        "temp": 28.5,
        "humidity": 52,
        "wind_speed": 9.4
    },
    "Ahmedabad": {
        "id": "ahmedabad",
        "name": "Ahmedabad",
        "state": "Gujarat",
        "lat": 23.0225,
        "lon": 72.5714,
        "pollutants": {"pm25": 94.0, "pm10": 164.0, "no2": 49.0, "so2": 24.0, "co": 1.6, "o3": 39.0, "nh3": 25.0},
        "station": "Maninagar CAAQMS Station, Ahmedabad",
        "temp": 31.0,
        "humidity": 44,
        "wind_speed": 8.1
    },
    "Pune": {
        "id": "pune",
        "name": "Pune",
        "state": "Maharashtra",
        "lat": 18.5204,
        "lon": 73.8567,
        "pollutants": {"pm25": 54.0, "pm10": 88.0, "no2": 32.0, "so2": 14.0, "co": 1.0, "o3": 26.0, "nh3": 16.0},
        "station": "Shivajinagar CAAQMS, Pune",
        "temp": 26.2,
        "humidity": 58,
        "wind_speed": 10.3
    },
    "Lucknow": {
        "id": "lucknow",
        "name": "Lucknow",
        "state": "Uttar Pradesh",
        "lat": 26.8467,
        "lon": 80.9462,
        "pollutants": {"pm25": 175.0, "pm10": 280.0, "no2": 66.0, "so2": 21.0, "co": 2.6, "o3": 44.0, "nh3": 42.0},
        "station": "Talkatora CAAQMS Station, Lucknow",
        "temp": 23.8,
        "humidity": 65,
        "wind_speed": 5.4
    },
    "Jaipur": {
        "id": "jaipur",
        "name": "Jaipur",
        "state": "Rajasthan",
        "lat": 26.9124,
        "lon": 75.7873,
        "pollutants": {"pm25": 112.0, "pm10": 210.0, "no2": 51.0, "so2": 19.0, "co": 1.8, "o3": 38.0, "nh3": 31.0},
        "station": "Adarsh Nagar CAAQMS, Jaipur",
        "temp": 28.0,
        "humidity": 38,
        "wind_speed": 7.2
    },
    "Patna": {
        "id": "patna",
        "name": "Patna",
        "state": "Bihar",
        "lat": 25.5941,
        "lon": 85.1376,
        "pollutants": {"pm25": 185.0, "pm10": 295.0, "no2": 69.0, "so2": 26.0, "co": 2.9, "o3": 45.0, "nh3": 46.0},
        "station": "Samarpal CAAQMS Station, Patna",
        "temp": 25.0,
        "humidity": 68,
        "wind_speed": 4.9
    },
    "Kanpur": {
        "id": "kanpur",
        "name": "Kanpur",
        "state": "Uttar Pradesh",
        "lat": 26.4499,
        "lon": 80.3319,
        "pollutants": {"pm25": 162.0, "pm10": 268.0, "no2": 63.0, "so2": 20.0, "co": 2.5, "o3": 41.0, "nh3": 39.0},
        "station": "Nehru Nagar CAAQMS Station, Kanpur",
        "temp": 24.1,
        "humidity": 64,
        "wind_speed": 5.8
    },
    "Varanasi": {
        "id": "varanasi",
        "name": "Varanasi",
        "state": "Uttar Pradesh",
        "lat": 25.3176,
        "lon": 82.9739,
        "pollutants": {"pm25": 145.0, "pm10": 235.0, "no2": 55.0, "so2": 18.0, "co": 2.1, "o3": 37.0, "nh3": 34.0},
        "station": "BHU CAAQMS Station, Varanasi",
        "temp": 25.6,
        "humidity": 63,
        "wind_speed": 6.1
    },
    "Chandigarh": {
        "id": "chandigarh",
        "name": "Chandigarh",
        "state": "Punjab / Haryana",
        "lat": 30.7333,
        "lon": 76.7794,
        "pollutants": {"pm25": 82.0, "pm10": 138.0, "no2": 36.0, "so2": 12.0, "co": 1.3, "o3": 30.0, "nh3": 22.0},
        "station": "Sector 22 CAAQMS Station, Chandigarh",
        "temp": 22.4,
        "humidity": 58,
        "wind_speed": 8.7
    },
    "Visakhapatnam": {
        "id": "visakhapatnam",
        "name": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "lat": 17.6868,
        "lon": 83.2185,
        "pollutants": {"pm25": 44.0, "pm10": 72.0, "no2": 29.0, "so2": 17.0, "co": 0.9, "o3": 21.0, "nh3": 14.0},
        "station": "Gajuwaka CAAQMS, Visakhapatnam",
        "temp": 29.8,
        "humidity": 76,
        "wind_speed": 15.2
    },
    "Surat": {
        "id": "surat",
        "name": "Surat",
        "state": "Gujarat",
        "lat": 21.1702,
        "lon": 72.8311,
        "pollutants": {"pm25": 78.0, "pm10": 132.0, "no2": 42.0, "so2": 21.0, "co": 1.4, "o3": 31.0, "nh3": 23.0},
        "station": "SVNIT CAAQMS, Surat",
        "temp": 30.5,
        "humidity": 66,
        "wind_speed": 11.5
    },
    "Bhopal": {
        "id": "bhopal",
        "name": "Bhopal",
        "state": "Madhya Pradesh",
        "lat": 23.2599,
        "lon": 77.4126,
        "pollutants": {"pm25": 66.0, "pm10": 115.0, "no2": 34.0, "so2": 13.0, "co": 1.1, "o3": 27.0, "nh3": 18.0},
        "station": "Paryavaran Parisar, Bhopal",
        "temp": 27.2,
        "humidity": 49,
        "wind_speed": 9.0
    },
    "Indore": {
        "id": "indore",
        "name": "Indore",
        "state": "Madhya Pradesh",
        "lat": 22.7196,
        "lon": 75.8577,
        "pollutants": {"pm25": 72.0, "pm10": 124.0, "no2": 37.0, "so2": 15.0, "co": 1.3, "o3": 29.0, "nh3": 20.0},
        "station": "Chhoti Gwaltoli CAAQMS, Indore",
        "temp": 27.6,
        "humidity": 47,
        "wind_speed": 9.8
    },
    "Kochi": {
        "id": "kochi",
        "name": "Kochi",
        "state": "Kerala",
        "lat": 9.9312,
        "lon": 76.2673,
        "pollutants": {"pm25": 32.0, "pm10": 52.0, "no2": 19.0, "so2": 7.0, "co": 0.6, "o3": 18.0, "nh3": 11.0},
        "station": "Vyttila CAAQMS Station, Kochi",
        "temp": 29.0,
        "humidity": 82,
        "wind_speed": 13.8
    },
    "Guwahati": {
        "id": "guwahati",
        "name": "Guwahati",
        "state": "Assam",
        "lat": 26.1445,
        "lon": 91.7362,
        "pollutants": {"pm25": 88.0, "pm10": 142.0, "no2": 31.0, "so2": 11.0, "co": 1.2, "o3": 25.0, "nh3": 17.0},
        "station": "Railway Colony CAAQMS, Guwahati",
        "temp": 24.8,
        "humidity": 72,
        "wind_speed": 6.4
    }
}


def get_all_cities() -> List[Dict[str, Any]]:
    """Returns summarized cards for all cities with live computed AQI for maps and listing."""
    results = []
    for city_key, city in INDIAN_CITIES.items():
        aqi_res = calculate_overall_aqi(city["pollutants"])
        cpi_res = calculate_pollution_index(city["pollutants"])
        results.append({
            "id": city["id"],
            "name": city["name"],
            "state": city["state"],
            "lat": city["lat"],
            "lon": city["lon"],
            "station": city["station"],
            "aqi": aqi_res["aqi"],
            "category": aqi_res["category"],
            "color": aqi_res["color"],
            "textColor": aqi_res["textColor"],
            "badgeClass": aqi_res["badgeClass"],
            "dominant_pollutant": aqi_res["dominant_name"],
            "pollution_index": cpi_res["pollution_index"],
            "temp": city["temp"],
            "humidity": city["humidity"],
            "wind_speed": city["wind_speed"],
            "pm25": city["pollutants"].get("pm25"),
            "pm10": city["pollutants"].get("pm10")
        })
    results.sort(key=lambda x: x["aqi"], reverse=True)
    return results


def get_city_details(city_id_or_name: str) -> Optional[Dict[str, Any]]:
    """Returns comprehensive analytics for a chosen city."""
    target_key = None
    clean_target = city_id_or_name.lower().strip()
    
    for key, c in INDIAN_CITIES.items():
        if key.lower() == clean_target or c["id"].lower() == clean_target or clean_target in c["name"].lower():
            target_key = key
            break
            
    if not target_key:
        target_key = "Delhi"
        
    city = INDIAN_CITIES[target_key]
    aqi_res = calculate_overall_aqi(city["pollutants"])
    cpi_res = calculate_pollution_index(city["pollutants"])
    advisory = get_health_advisory(aqi_res["category"])
    forecast = generate_7day_forecast(city["name"], aqi_res["aqi"], aqi_res["dominant_name"])
    
    # Generate 24-hr diurnal trend
    hourly_trends = generate_hourly_trend(aqi_res["aqi"])
    
    # Generate 30-day monthly trend
    monthly_trends = generate_monthly_trend(aqi_res["aqi"], city["name"])
    
    return {
        "city_info": {
            "id": city["id"],
            "name": city["name"],
            "state": city["state"],
            "station": city["station"],
            "lat": city["lat"],
            "lon": city["lon"],
            "temp": city["temp"],
            "humidity": city["humidity"],
            "wind_speed": city["wind_speed"],
            "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p IST")
        },
        "aqi_data": aqi_res,
        "pollution_index_data": cpi_res,
        "health_advisory": advisory,
        "forecast_7days": forecast,
        "hourly_trend": hourly_trends,
        "monthly_trend": monthly_trends,
        "raw_pollutants": city["pollutants"]
    }


def generate_hourly_trend(base_aqi: int) -> List[Dict[str, Any]]:
    """Generates 24-hour diurnal cycle reflecting morning/evening traffic spikes and night inversion."""
    now = datetime.now()
    trend = []
    
    for i in range(24, 0, -1):
        dt = now - timedelta(hours=i)
        hour = dt.hour
        
        # Diurnal atmospheric physics factors:
        # 07:00 - 10:00: Morning rush hour & inversion breakup (factor ~ 1.18)
        # 12:00 - 16:00: Solar convection & maximum boundary layer dispersion (factor ~ 0.78)
        # 18:00 - 22:00: Evening traffic peak (factor ~ 1.22)
        # 23:00 - 05:00: Surface temperature inversion trapping emissions (factor ~ 1.10)
        if 7 <= hour <= 10:
            factor = 1.18
        elif 12 <= hour <= 16:
            factor = 0.78
        elif 18 <= hour <= 22:
            factor = 1.24
        else:
            factor = 1.05
            
        noise = math.sin(i * 0.5) * 6.0
        val = max(20, int(round(base_aqi * factor + noise)))
        trend.append({
            "time": dt.strftime("%I %p"),
            "full_time": dt.strftime("%b %d %I:%M %p"),
            "aqi": val
        })
    return trend


def generate_monthly_trend(base_aqi: int, city_name: str) -> List[Dict[str, Any]]:
    """Generates 30-day historical time-series data."""
    now = datetime.now()
    trend = []
    random.seed(hash(city_name) + 42)
    
    for i in range(30, 0, -1):
        dt = now - timedelta(days=i)
        variance = random.uniform(-25.0, 30.0)
        val = max(25, int(round(base_aqi + variance)))
        trend.append({
            "date": dt.strftime("%b %d"),
            "aqi": val
        })
    return trend


def get_seasonal_patterns() -> Dict[str, Any]:
    """Provides seasonal analysis comparison between North, South, and Coastal regions."""
    seasons = ["Winter (Nov-Jan)", "Pre-Monsoon / Summer (Mar-May)", "Monsoon (Jun-Sep)", "Post-Monsoon (Oct)"]
    return {
        "seasons": seasons,
        "delhi_north": [360, 190, 85, 290],     # Severe winter stubble + inversion, summer dust, clean monsoon
        "mumbai_coastal": [170, 125, 55, 140],  # Maritime boundary layer, pristine monsoon washout
        "bengaluru_south": [85, 75, 42, 65],    # Stable plateau climate, lush vegetation
        "kolkata_east": [280, 145, 60, 210]     # High humidity, winter inversion
    }
