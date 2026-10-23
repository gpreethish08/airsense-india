"""
AirSense India - Health Advisory Service
Provides comprehensive health precautions and guidelines based on CPCB AQI categories.
"""

from typing import Dict, Any

ADVISORIES = {
    "Good": {
        "title": "Air Quality is Ideal",
        "badge": "Safe for All",
        "mask_required": False,
        "mask_type": "None required",
        "outdoor_activity": "Ideal conditions for all outdoor workouts, jogging, and sports.",
        "ventilation": "Open windows and doors to let fresh air circulate freely throughout the home.",
        "sensitive_groups": "No risk detected. Children, elderly, and asthmatic individuals can exercise freely.",
        "lifestyle_tips": [
            "Great time for morning runs, cycling, and park visits.",
            "Enjoy natural ventilation throughout your workspace and residence.",
            "Zero air purifier usage needed today."
        ]
    },
    "Satisfactory": {
        "title": "Air Quality is Acceptable",
        "badge": "Generally Safe",
        "mask_required": False,
        "mask_type": "Optional for hyper-sensitive individuals",
        "outdoor_activity": "Normal outdoor activities are safe for most individuals.",
        "ventilation": "Ventilation is safe during daytime hours.",
        "sensitive_groups": "Hypersensitive individuals with chronic bronchial asthma may experience mild discomfort.",
        "lifestyle_tips": [
            "Continue regular sports, fitness, and daily commute.",
            "Sensitive individuals should keep emergency inhalers accessible.",
            "Keep hydrated to support natural respiratory mucous barrier."
        ]
    },
    "Moderate": {
        "title": "Moderate Pollution - Caution Advised",
        "badge": "Moderate Discomfort",
        "mask_required": False,
        "mask_type": "Recommended for respiratory patients",
        "outdoor_activity": "Healthy adults can continue moderate outdoor tasks. Avoid heavy aerobic workouts during rush hour.",
        "ventilation": "Ventilate between 12:00 PM and 4:00 PM when atmospheric boundary dispersion is highest.",
        "sensitive_groups": "Children, pregnant women, and asthmatics may experience shortness of breath or eye irritation.",
        "lifestyle_tips": [
            "Avoid strenuous jogging on arterial roads with dense vehicle traffic.",
            "Keep windows shut during early morning smog or late night inversion.",
            "Drink plenty of water and warm fluids; consume jaggery/ginger tea."
        ]
    },
    "Poor": {
        "title": "Unhealthy Air - Precautions Required",
        "badge": "High Health Risk",
        "mask_required": True,
        "mask_type": "N95 / FFP2 Mask Recommended Outdoors",
        "outdoor_activity": "Avoid prolonged outdoor exertion. Shift workouts indoors or to a gym with filtered air.",
        "ventilation": "Keep windows and external doors closed to prevent particulate infiltration.",
        "sensitive_groups": "Elderly and children must limit outdoor playtime. Keep inhalers and medication at hand.",
        "lifestyle_tips": [
            "Wear a snug-fitting N95 or KN95 respirator mask when going outside.",
            "Run indoor HEPA air purifiers in bedrooms overnight.",
            "Rinse eyes with clean water if stinging or redness develops.",
            "Avoid burning candles, incense, or biomass indoors."
        ]
    },
    "Very Poor": {
        "title": "Very Unhealthy - Serious Health Warning",
        "badge": "Severe Danger",
        "mask_required": True,
        "mask_type": "Mandatory N95 / FFP2 / FFP3 Mask",
        "outdoor_activity": "Strictly cancel all outdoor jogging, running, and athletic training.",
        "ventilation": "Seal window gaps. Do not open windows. Run indoor air purifiers on high speed.",
        "sensitive_groups": "Children and seniors must stay indoors. High likelihood of wheezing, chest tightness, and coughing.",
        "lifestyle_tips": [
            "Mandatory N95 mask outside; cloth masks provide near-zero protection against PM2.5.",
            "Use wet mopping instead of dry dusting to avoid kicking up settled dust.",
            "Place indoor air-purifying plants (Areca Palm, Snake Plant, Peace Lily) indoors.",
            "Consult a physician if experiencing persistent coughing, palpitations, or asthma flare-up."
        ]
    },
    "Severe": {
        "title": "Hazardous Emergency - Stay Indoors",
        "badge": "Public Health Emergency",
        "mask_required": True,
        "mask_type": "Mandatory N95 / N99 or Respirator",
        "outdoor_activity": "Avoid all unnecessary outdoor exposure. Complete halt to outdoor sports and school parades.",
        "ventilation": "Complete building sealing. Continuous HEPA filtration with closed circuit.",
        "sensitive_groups": "Critical danger to respiratory and cardiovascular patients. Immediate risk of acute bronchial spasm.",
        "lifestyle_tips": [
            "Stay indoors with doors and windows tightly shut.",
            "Avoid morning walks entirely — morning surface inversion traps severe toxic pollutants.",
            "Work from home if possible; avoid high-traffic corridors.",
            "Seek urgent emergency medical care if experiencing chest pain or acute breathlessness."
        ]
    }
}

def get_health_advisory(category: str) -> Dict[str, Any]:
    """Returns comprehensive health advisory for a given AQI category."""
    clean_cat = category.replace("Moderately Polluted", "Moderate").title()
    for key in ADVISORIES:
        if key.lower() in clean_cat.lower():
            return ADVISORIES[key]
    return ADVISORIES["Moderate"]
