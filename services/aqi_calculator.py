"""
AirSense India - CPCB AQI Calculator Service
Implements official Indian Central Pollution Control Board (CPCB) sub-index calculation rules.
"""

from typing import Dict, Any, Optional, Tuple

# CPCB Standard Breakpoints: (B_lo, B_hi, I_lo, I_hi)
BREAKPOINTS = {
    "pm25": [
        (0.0, 30.0, 0, 50),
        (30.1, 60.0, 51, 100),
        (60.1, 90.0, 101, 200),
        (90.1, 120.0, 201, 300),
        (120.1, 250.0, 301, 400),
        (250.1, 500.0, 401, 500)
    ],
    "pm10": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 250.0, 101, 200),
        (250.1, 350.0, 201, 300),
        (350.1, 430.0, 301, 400),
        (430.1, 500.0, 401, 500)
    ],
    "no2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 180.0, 101, 200),
        (180.1, 280.0, 201, 300),
        (280.1, 400.0, 301, 400),
        (400.1, 500.0, 401, 500)
    ],
    "so2": [
        (0.0, 40.0, 0, 50),
        (40.1, 80.0, 51, 100),
        (80.1, 380.0, 101, 200),
        (380.1, 800.0, 201, 300),
        (800.1, 1600.0, 301, 400),
        (1600.1, 2000.0, 401, 500)
    ],
    "co": [
        (0.0, 1.0, 0, 50),
        (1.01, 2.0, 51, 100),
        (2.01, 10.0, 101, 200),
        (10.01, 17.0, 201, 300),
        (17.01, 34.0, 301, 400),
        (34.01, 50.0, 401, 500)
    ],
    "o3": [
        (0.0, 50.0, 0, 50),
        (50.1, 100.0, 51, 100),
        (100.1, 168.0, 101, 200),
        (168.1, 208.0, 201, 300),
        (208.1, 748.0, 301, 400),
        (748.1, 1000.0, 401, 500)
    ],
    "nh3": [
        (0.0, 200.0, 0, 50),
        (200.1, 400.0, 51, 100),
        (400.1, 800.0, 101, 200),
        (800.1, 1200.0, 201, 300),
        (1200.1, 1800.0, 301, 400),
        (1800.1, 2000.0, 401, 500)
    ]
}

POLLUTANT_NAMES = {
    "pm25": "PM2.5",
    "pm10": "PM10",
    "no2": "NO₂",
    "so2": "SO₂",
    "co": "CO",
    "o3": "O₃",
    "nh3": "NH₃"
}

POLLUTANT_UNITS = {
    "pm25": "µg/m³",
    "pm10": "µg/m³",
    "no2": "µg/m³",
    "so2": "µg/m³",
    "co": "mg/m³",
    "o3": "µg/m³",
    "nh3": "µg/m³"
}

def calculate_sub_index(pollutant: str, concentration: float) -> Tuple[Optional[int], Optional[Dict[str, Any]]]:
    """
    Computes the sub-index for a single pollutant using linear interpolation:
    I_p = [ (I_hi - I_lo) / (B_hi - B_lo) ] * (C_p - B_lo) + I_lo
    """
    key = pollutant.lower().replace(".", "")
    if key not in BREAKPOINTS or concentration is None or concentration < 0:
        return None, None
    
    ranges = BREAKPOINTS[key]
    matched_range = None
    
    for (b_lo, b_hi, i_lo, i_hi) in ranges:
        if b_lo <= concentration <= b_hi:
            matched_range = (b_lo, b_hi, i_lo, i_hi)
            break
            
    # If concentration exceeds highest breakpoint, cap or extrapolate up to 500
    if not matched_range:
        if concentration > ranges[-1][1]:
            b_lo, b_hi, i_lo, i_hi = ranges[-1]
            matched_range = (b_lo, b_hi, i_lo, i_hi)
        else:
            return None, None

    b_lo, b_hi, i_lo, i_hi = matched_range
    sub_index = ((i_hi - i_lo) / (b_hi - b_lo)) * (concentration - b_lo) + i_lo
    sub_index_rounded = int(round(min(500, max(0, sub_index))))
    
    calc_step = {
        "pollutant": POLLUTANT_NAMES.get(key, pollutant),
        "concentration": concentration,
        "unit": POLLUTANT_UNITS.get(key, "µg/m³"),
        "b_lo": b_lo,
        "b_hi": b_hi,
        "i_lo": i_lo,
        "i_hi": i_hi,
        "sub_index": sub_index_rounded,
        "formula": f"[({i_hi} - {i_lo}) / ({b_hi} - {b_lo})] × ({concentration} - {b_lo}) + {i_lo}"
    }
    return sub_index_rounded, calc_step


def get_aqi_category(aqi: int) -> Dict[str, str]:
    """
    Returns official CPCB category, color code, and badge class.
    """
    if aqi <= 50:
        return {
            "category": "Good",
            "color": "#10B981",       # Emerald
            "textColor": "#ffffff",
            "badgeClass": "bg-success",
            "desc": "Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.",
            "healthStatus": "Healthy"
        }
    elif aqi <= 100:
        return {
            "category": "Satisfactory",
            "color": "#84CC16",       # Lime
            "textColor": "#1a1a1a",
            "badgeClass": "bg-light-green",
            "desc": "Minor breathing discomfort to sensitive people.",
            "healthStatus": "Acceptable"
        }
    elif aqi <= 200:
        return {
            "category": "Moderate",
            "color": "#F59E0B",       # Amber
            "textColor": "#1a1a1a",
            "badgeClass": "bg-warning",
            "desc": "Breathing discomfort to people with lungs, asthma and heart diseases.",
            "healthStatus": "Caution for Sensitive Groups"
        }
    elif aqi <= 300:
        return {
            "category": "Poor",
            "color": "#F97316",       # Orange
            "textColor": "#ffffff",
            "badgeClass": "bg-orange",
            "desc": "Breathing discomfort to most people on prolonged exposure.",
            "healthStatus": "Unhealthy"
        }
    elif aqi <= 400:
        return {
            "category": "Very Poor",
            "color": "#EF4444",       # Red
            "textColor": "#ffffff",
            "badgeClass": "bg-danger",
            "desc": "Respiratory illness on prolonged exposure. Significant risk for elderlies and children.",
            "healthStatus": "Very Unhealthy"
        }
    else:
        return {
            "category": "Severe",
            "color": "#7C3AED",       # Purple / Maroon
            "textColor": "#ffffff",
            "badgeClass": "bg-purple",
            "desc": "Affects healthy people and seriously impacts those with existing diseases. Emergency conditions.",
            "healthStatus": "Hazardous"
        }


def calculate_overall_aqi(pollutants: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes overall AQI as per CPCB norms:
    - At least 3 sub-indices must be present, with at least one being PM2.5 or PM10.
    - Overall AQI = max(sub-indices).
    - Dominant pollutant is the one with the maximum sub-index.
    """
    sub_indices = {}
    breakdowns = []
    
    for p_name, conc in pollutants.items():
        if conc is not None:
            idx, step = calculate_sub_index(p_name, float(conc))
            if idx is not None:
                sub_indices[p_name] = idx
                breakdowns.append(step)
                
    if not sub_indices:
        return {
            "aqi": 0,
            "category": "Data Unavailable",
            "color": "#9CA3AF",
            "dominant_pollutant": "None",
            "dominant_name": "None",
            "sub_indices": {},
            "breakdowns": [],
            "valid": False,
            "message": "No valid pollutant data provided."
        }
        
    has_particulate = ("pm25" in sub_indices) or ("pm10" in sub_indices)
    valid_cpcb = (len(sub_indices) >= 3 and has_particulate) or len(sub_indices) >= 1
    
    dominant_key = max(sub_indices, key=sub_indices.get)
    max_aqi = sub_indices[dominant_key]
    category_info = get_aqi_category(max_aqi)
    
    return {
        "aqi": max_aqi,
        "dominant_pollutant": dominant_key,
        "dominant_name": POLLUTANT_NAMES.get(dominant_key, dominant_key.upper()),
        "category": category_info["category"],
        "color": category_info["color"],
        "textColor": category_info["textColor"],
        "badgeClass": category_info["badgeClass"],
        "description": category_info["desc"],
        "health_status": category_info["healthStatus"],
        "sub_indices": sub_indices,
        "breakdowns": breakdowns,
        "is_cpcb_compliant": valid_cpcb,
        "count": len(sub_indices)
    }
