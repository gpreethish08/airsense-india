"""
AirSense India: AQI and Pollution Index Web Application
FastAPI Backend Server
College Project for Preethish
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import os

from services.aqi_calculator import calculate_overall_aqi, calculate_sub_index, get_aqi_category
from services.pollution_index import calculate_pollution_index
from services.health_advisory import get_health_advisory
from services.forecast import generate_7day_forecast
from services.data_service import get_all_cities, get_city_details, get_seasonal_patterns, INDIAN_CITIES

app = FastAPI(
    title="AirSense India API",
    description="Live AQI and Pollution Index Dashboard with CPCB Calculation and Forecasting",
    version="1.0.0"
)

# Enable CORS for cross-origin requests (e.g., Vercel frontend, external clients)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
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
        "cpcb_compliant": True
    }


@app.get("/api/cities")
def list_cities():
    """Returns all monitored Indian cities with live AQI and geo-coordinates."""
    return {"cities": get_all_cities()}


@app.get("/api/city/{city_id}")
def get_city(city_id: str):
    """Returns comprehensive analytics, trends, health advisory, and 7-day forecast for a city."""
    details = get_city_details(city_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"City '{city_id}' not found.")
    return details


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


@app.get("/api/seasonal")
def get_seasonal_data():
    """Returns regional seasonal trend patterns across Indian climatic zones."""
    return get_seasonal_patterns()


@app.get("/api/compare")
def compare_cities(city_ids: str = Query("delhi,mumbai,bengaluru,kolkata")):
    """Compares multiple cities across AQI, dominant pollutant, and CPI."""
    ids = [c.strip().lower() for c in city_ids.split(",") if c.strip()]
    comparison_data = []
    
    for c_id in ids:
        details = get_city_details(c_id)
        if details:
            comparison_data.append({
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


# Mount static assets if the folder exists
static_dir = os.path.join(os.path.dirname(__file__), "public")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_home():
    index_path = os.path.join(os.path.dirname(__file__), "public", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "AirSense India API is running. Access /docs for API documentation."}


if __name__ == "__main__":
    import uvicorn
    print("Starting AirSense India server on http://localhost:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
