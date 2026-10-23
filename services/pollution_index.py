"""
AirSense India - Pollution Index Service
Computes the Comprehensive Pollution Index (CPI) and compares it with CPCB AQI.
"""

from typing import Dict, Any

# CPCB National Ambient Air Quality Standards (NAAQS) permissible limits (24-hr or 8-hr)
NAAQS_LIMITS = {
    "pm25": 60.0,    # µg/m³ (24 hr)
    "pm10": 100.0,   # µg/m³ (24 hr)
    "no2": 80.0,     # µg/m³ (24 hr)
    "so2": 80.0,     # µg/m³ (24 hr)
    "co": 2.0,       # mg/m³ (8 hr)
    "o3": 100.0,     # µg/m³ (8 hr)
    "nh3": 400.0     # µg/m³ (24 hr)
}

# Relative health impact weights (normalized sum = 1.0)
HEALTH_WEIGHTS = {
    "pm25": 0.35,    # Fine particulate: highest lung & bloodstream penetration
    "pm10": 0.20,    # Coarse particulate: upper respiratory tract
    "no2": 0.15,     # Vehicular emissions, inflammation
    "so2": 0.10,     # Industrial/thermal power plants, bronchoconstriction
    "co": 0.10,      # Incomplete combustion, oxygen delivery inhibition
    "o3": 0.07,      # Photochemical smog, powerful oxidant
    "nh3": 0.03      # Agricultural/waste emissions
}

def calculate_pollution_index(pollutants: Dict[str, float]) -> Dict[str, Any]:
    """
    Computes a multi-pollutant weighted Pollution Index (CPI).
    Formula: CPI = (1 / total_weights) * SUM [ weight_i * (Concentration_i / NAAQS_Limit_i) * 100 ]
    - CPI < 50: Clean / Low Burden
    - CPI 50 - 100: Within Standard Limits
    - CPI 100 - 200: Moderate Multi-pollutant Burden
    - CPI 200 - 300: High Multi-pollutant Load
    - CPI > 300: Critical Environmental Toxicity
    """
    contributions = []
    weighted_sum = 0.0
    weight_total = 0.0

    for p, conc in pollutants.items():
        key = p.lower().replace(".", "")
        if key in NAAQS_LIMITS and conc is not None:
            c = float(conc)
            limit = NAAQS_LIMITS[key]
            weight = HEALTH_WEIGHTS.get(key, 0.1)
            
            # Ratio of concentration to permissible standard
            ratio = c / limit
            sub_score = ratio * 100.0
            weighted_contribution = weight * sub_score
            
            weighted_sum += weighted_contribution
            weight_total += weight
            
            contributions.append({
                "pollutant": key.upper(),
                "concentration": c,
                "standard_limit": limit,
                "ratio_to_standard": round(ratio, 2),
                "sub_score": round(sub_score, 1),
                "weight": weight
            })

    if weight_total == 0:
        return {
            "pollution_index": 0,
            "category": "Unknown",
            "burden_level": "No Data",
            "contributions": []
        }

    cpi = round(weighted_sum / weight_total, 1)

    if cpi <= 50:
        cpi_category = "Low Pollution Burden"
        cpi_color = "#10B981"
        cpi_status = "Safe"
    elif cpi <= 100:
        cpi_category = "Acceptable Standard"
        cpi_color = "#84CC16"
        cpi_status = "Compliant"
    elif cpi <= 175:
        cpi_category = "Moderate Burden"
        cpi_color = "#F59E0B"
        cpi_status = "Elevated"
    elif cpi <= 250:
        cpi_category = "High Composite Burden"
        cpi_color = "#F97316"
        cpi_status = "Hazardous"
    else:
        cpi_category = "Severe Toxicity"
        cpi_color = "#7C3AED"
        cpi_status = "Critical Alert"

    return {
        "pollution_index": cpi,
        "category": cpi_category,
        "color": cpi_color,
        "status": cpi_status,
        "contributions": contributions,
        "summary": (
            f"Composite Pollution Index is {cpi} ({cpi_category}). "
            f"While AQI flags the single worst pollutant, CPI assesses total chemical exposure burden."
        )
    }
