"""
AirSense India: AQI and Pollution Index Web Application
FastAPI Backend Server
College Project for Preethish
"""

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import os
import io
import csv

from services.aqi_calculator import calculate_overall_aqi, calculate_sub_index, get_aqi_category
from services.pollution_index import calculate_pollution_index
from services.health_advisory import get_health_advisory
from services.forecast import generate_7day_forecast
from services.data_service import (
    get_all_cities, get_city_details, get_seasonal_patterns, 
    INDIAN_CITIES, generate_calendar_data, fetch_openweather_data, 
    fetch_iqair_data, fetch_waqi_live_data, resolve_city_key
)

app = FastAPI(
    title="AirSense India API",
    description="Live AQI and Pollution Index Dashboard with CPCB Calculation and ML Forecasting",
    version="1.0.0"
)

# Enable CORS for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
CSS_DIR = os.path.join(PUBLIC_DIR, "css")
JS_DIR = os.path.join(PUBLIC_DIR, "js")

# Mount CSS & JS static routes explicitly
if os.path.exists(CSS_DIR):
    app.mount("/css", StaticFiles(directory=CSS_DIR), name="css")
if os.path.exists(JS_DIR):
    app.mount("/js", StaticFiles(directory=JS_DIR), name="js")
if os.path.exists(PUBLIC_DIR):
    app.mount("/static", StaticFiles(directory=PUBLIC_DIR), name="static")


# Pydantic Request Models
class CalculateAQIRequest(BaseModel):
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None
    nh3: Optional[float] = None


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "AirSense India",
        "author": "Preethish",
        "version": "1.0.0",
        "cpcb_compliant": True,
        "monitored_cities": len(INDIAN_CITIES)
    }


@app.get("/api/cities")
def list_cities():
    """Returns all monitored Indian cities with live AQI and geo-coordinates."""
    return {"cities": get_all_cities()}


@app.get("/api/city/{city_id}")
def get_city(city_id: str, openweather_key: Optional[str] = None, iqair_key: Optional[str] = None):
    """Returns comprehensive analytics, trends, major pollutants, and live weather for a city."""
    details = get_city_details(city_id, openweather_key=openweather_key, iqair_key=iqair_key)
    if not details:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
    return details


@app.get("/api/calendar/{city_id}")
def get_calendar(city_id: str, year: int = 2026, months: str = "8,9,10"):
    """Returns daily AQI calendar data for specified months (e.g. August, September, October)."""
    month_list = [int(m.strip()) for m in months.split(",") if m.strip().isdigit()]
    if not month_list:
        month_list = [8, 9, 10]
    return generate_calendar_data(city_id, year=year, months=month_list)


@app.get("/api/openweather/live/{city_id}")
def get_openweather_live(city_id: str, api_key: Optional[str] = None):
    """Fetches real-time pollutant concentrations directly from OpenWeather Air Pollution API for the CPCB calculator."""
    city_key = resolve_city_key(city_id)
    target = INDIAN_CITIES.get(city_key, INDIAN_CITIES["Delhi"])
        
    lat = target["lat"]
    lon = target["lon"]
    ow_result = fetch_openweather_data(lat, lon, api_key)
    if ow_result:
        return ow_result
        
    # Fallback to WAQI or target CAAQMS station
    waqi_res = fetch_waqi_live_data(lat, lon)
    if waqi_res:
        return waqi_res
        
    return {
        "source": "CAAQMS Baseline",
        "pollutants": target["pollutants"],
        "weather": {
            "temp": target["temp"],
            "humidity": target["humidity"],
            "wind_speed": target["wind_speed"],
            "description": "Partly Cloudy",
            "uv_index": 1.5
        }
    }


@app.post("/api/calculate")
def calculate_aqi_endpoint(data: CalculateAQIRequest):
    """
    CPCB AQI Calculator:
    Computes sub-indices using standard breakpoint linear interpolation,
    identifies dominant pollutant, and returns step-by-step mathematical breakdown.
    """
    pollutants = {
        "pm25": data.pm25,
        "pm10": data.pm10,
        "no2": data.no2,
        "so2": data.so2,
        "co": data.co,
        "o3": data.o3,
        "nh3": data.nh3
    }
    
    # Filter out None values
    valid_pollutants = {k: v for k, v in pollutants.items() if v is not None}
    if not valid_pollutants:
        raise HTTPException(status_code=400, detail="Please provide at least one pollutant concentration value.")
        
    aqi_result = calculate_overall_aqi(valid_pollutants)
    cpi_result = calculate_pollution_index(valid_pollutants)
    health_advice = get_health_advisory(aqi_result["category"])
    
    return {
        "aqi_data": aqi_result,
        "pollution_index_data": cpi_result,
        "health_advisory": health_advice
    }


@app.get("/api/forecast/{city_id}")
def get_city_forecast(city_id: str):
    """Returns 7-day ML weather and AQI forecast for a city."""
    details = get_city_details(city_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
    return {
        "city": details["city_info"]["name"],
        "forecast": details["forecast_7days"]
    }


@app.get("/api/seasonal")
def get_seasonal_data():
    """Returns regional seasonal trend patterns across Indian climatic zones."""
    return get_seasonal_patterns()


@app.get("/api/compare")
def compare_cities(city_ids: str = Query("delhi,mumbai,bengaluru,kolkata,chennai,lucknow,hyderabad")):
    """Compares multiple cities across AQI, dominant pollutant, and CPI."""
    ids = [c.strip().lower() for c in city_ids.split(",") if c.strip()]
    comparison_data = []
    
    for c_id in ids:
        details = get_city_details(c_id)
        if details:
            comparison_data.append({
                "id": details["city_info"]["id"],
                "name": details["city_info"]["name"],
                "state": details["city_info"]["state"],
                "aqi": details["aqi_data"]["aqi"],
                "category": details["aqi_data"]["category"],
                "color": details["aqi_data"]["color"],
                "dominant": details["aqi_data"]["dominant_name"],
                "cpi": details["pollution_index_data"]["pollution_index"],
                "pm25": details["raw_pollutants"].get("pm25", 0),
                "pm10": details["raw_pollutants"].get("pm10", 0),
                "no2": details["raw_pollutants"].get("no2", 0)
            })
            
    return {"comparison": comparison_data}


@app.get("/api/export/{city_id}")
def export_csv_endpoint(city_id: str):
    """Generates and downloads a CSV report for a city's current air quality."""
    details = get_city_details(city_id)
    if not details:
        raise HTTPException(status_code=404, detail="City not found.")
        
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Parameter", "Value", "Unit"])
    writer.writerow(["City", details["city_info"]["name"], ""])
    writer.writerow(["State", details["city_info"]["state"], ""])
    writer.writerow(["Station", details["city_info"]["station"], ""])
    writer.writerow(["Timestamp", details["city_info"]["timestamp"], ""])
    writer.writerow(["Overall AQI", details["aqi_data"]["aqi"], "CPCB Scale"])
    writer.writerow(["Category", details["aqi_data"]["category"], ""])
    writer.writerow(["Dominant Pollutant", details["aqi_data"]["dominant_name"], ""])
    writer.writerow(["Composite Pollution Index (CPI)", details["pollution_index_data"]["pollution_index"], "NAAQS Weighted"])
    
    for p, v in details["raw_pollutants"].items():
        unit = "mg/m³" if p == "co" else "µg/m³"
        writer.writerow([p.upper(), v, unit])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=AirSense_{city_id}_Report.csv"
    return response


# Root route
@app.get("/")
def serve_home():
    index_path = os.path.join(PUBLIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    root_index = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(root_index):
        return FileResponse(root_index)
    return {"message": "AirSense India API is running. Access /docs for API documentation."}


# Catch-all route to serve static files with zero 404s
@app.get("/{file_path:path}")
def serve_static_files(file_path: str):
    # Try public directory first
    p = os.path.join(PUBLIC_DIR, file_path)
    if os.path.exists(p) and os.path.isfile(p):
        return FileResponse(p)
    # Try root directory
    root_p = os.path.join(BASE_DIR, file_path)
    if os.path.exists(root_p) and os.path.isfile(root_p):
        return FileResponse(root_p)
    # Fallback to index.html
    index_p = os.path.join(PUBLIC_DIR, "index.html")
    if os.path.exists(index_p):
        return FileResponse(index_p)
    raise HTTPException(status_code=404, detail="File not found")


if __name__ == "__main__":
    import uvicorn
    print("Starting AirSense India server on http://localhost:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
