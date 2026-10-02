"""
Intelligent Multi-Hazard AI Classification & Specialized Operational Planner Engine.
Evaluates multi-sensor telemetry, physical dynamics, and incident narrative to:
1. Classify discrete disaster archetypes with calibrated confidence & XAI feature attribution.
2. Generate an individual, specialized operational mitigation and response plan tailored specifically for that disaster.
3. Compute hazard-specific 'What-If' dynamic simulations based on physics-based mechanics.
"""

from typing import Dict, Any, List, Optional
import math
import re
from datetime import datetime, timezone, timedelta

# Supported disaster classes
DISASTER_CLASSES = [
    "LANDSLIDE_DEBRIS_FLOW",
    "TROPICAL_CYCLONE",
    "RIVERINE_FLOOD",
    "FOREST_WILDFIRE",
    "VOLCANIC_ANOMALY",
    "SEISMIC_EARTHQUAKE",
    "EXTREME_DROUGHT"
]

# Pre-defined high-stakes disaster scenarios for 1-click demonstration
PRESET_DISASTERS = [
    {
        "id": "wayanad_landslide",
        "title": "Wayanad Meppadi Hillside Escarpment (2024 Event)",
        "region": "Western Ghats, Wayanad District, Kerala",
        "category_hint": "LANDSLIDE_DEBRIS_FLOW",
        "description": "Torrential monsoon deluge (>310mm in 48 hours) saturated tea estate slopes above 32° gradient. Geotechnical sensors report pore-water pressure exceeding critical shear threshold. High risk of debris flow towards Chooralmala and Mundakkai.",
        "telemetry": {
            "rainfall_48h_mm": 312.0,
            "rainfall_rate_mmh": 45.0,
            "soil_saturation_pct": 92.4,
            "slope_angle_deg": 34.0,
            "pore_pressure_kpa": 88.5,
            "barometric_pressure_hpa": 985.0,
            "wind_speed_kmh": 38.0,
            "river_discharge_cusecs": 12000,
            "thermal_power_mw": 0.0,
            "seismic_pga_g": 0.02
        },
        "what_if_defaults": {
            "param1_name": "Rainfall Rate (mm/hr)",
            "param1_val": 45.0,
            "param1_min": 10.0,
            "param1_max": 120.0,
            "param2_name": "Slope Angle (°)",
            "param2_val": 34.0,
            "param2_min": 15.0,
            "param2_max": 55.0
        }
    },
    {
        "id": "cyclone_dana",
        "title": "Severe Cyclonic Storm 'Dana' Approaching Odisha Coast",
        "region": "Northwest Bay of Bengal (Approaching Dhamra / Puri)",
        "category_hint": "TROPICAL_CYCLONE",
        "description": "Deep depression intensified into a severe cyclonic storm with central pressure 982 hPa and sustained core winds of 115 km/h. Coastal radar shows well-defined eye wall tracking northwest. Astronomical high tide overlaps landfall window.",
        "telemetry": {
            "barometric_pressure_hpa": 982.0,
            "wind_speed_kmh": 115.0,
            "wind_gusts_kmh": 135.0,
            "sea_surface_temp_c": 29.8,
            "distance_to_coast_km": 85.0,
            "storm_surge_projected_m": 2.4,
            "rainfall_48h_mm": 180.0,
            "soil_saturation_pct": 55.0,
            "slope_angle_deg": 2.0,
            "thermal_power_mw": 0.0,
            "seismic_pga_g": 0.0
        },
        "what_if_defaults": {
            "param1_name": "Central Pressure (hPa)",
            "param1_val": 982.0,
            "param1_min": 940.0,
            "param1_max": 1005.0,
            "param2_name": "Distance to Coast (km)",
            "param2_val": 85.0,
            "param2_min": 0.0,
            "param2_max": 250.0
        }
    },
    {
        "id": "brahmaputra_flood",
        "title": "Brahmaputra Valley Riverine Basin Surge & Dyke Overtopping",
        "region": "Upper Assam (Majuli - Kaziranga Riparian Belt)",
        "category_hint": "RIVERINE_FLOOD",
        "description": "Continuous precipitation in upper catchment has raised river stage to 1.6 meters above statutory danger level at Nematighat and Tezpur. Embankment dyke freeboard compromised. Upstream reservoir spillway gates open at 38,000 m³/s.",
        "telemetry": {
            "river_stage_above_danger_m": 1.6,
            "river_discharge_cusecs": 42000,
            "catchment_rain_mm": 145.0,
            "embankment_freeboard_m": 0.4,
            "submerged_hectares_est": 28400,
            "soil_saturation_pct": 88.0,
            "barometric_pressure_hpa": 998.0,
            "wind_speed_kmh": 24.0,
            "thermal_power_mw": 0.0,
            "seismic_pga_g": 0.0
        },
        "what_if_defaults": {
            "param1_name": "Dam Discharge (cusecs)",
            "param1_val": 42000.0,
            "param1_min": 10000.0,
            "param1_max": 90000.0,
            "param2_name": "Embankment Freeboard (m)",
            "param2_val": 0.4,
            "param2_min": -0.8,
            "param2_max": 2.5
        }
    },
    {
        "id": "similipal_wildfire",
        "title": "Similipal Biosphere Reserve Dry Canopy Wildfire",
        "region": "Mayurbhanj District, Odisha",
        "category_hint": "FOREST_WILDFIRE",
        "description": "Satellite MODIS/VIIRS registers 84 active thermal fire pixels with Fire Radiative Power (FRP) of 420 MW in core deciduous sal forest. High ambient temperature (41°C) and gusty winds are driving fast-moving crown fire.",
        "telemetry": {
            "thermal_power_mw": 420.0,
            "fuel_moisture_pct": 7.5,
            "ambient_temp_c": 41.2,
            "wind_speed_kmh": 46.0,
            "relative_humidity_pct": 18.0,
            "soil_saturation_pct": 12.0,
            "rainfall_48h_mm": 0.0,
            "barometric_pressure_hpa": 1004.0,
            "seismic_pga_g": 0.0
        },
        "what_if_defaults": {
            "param1_name": "Wind Velocity (km/h)",
            "param1_val": 46.0,
            "param1_min": 10.0,
            "param1_max": 90.0,
            "param2_name": "Fuel Moisture (%)",
            "param2_val": 7.5,
            "param2_min": 3.0,
            "param2_max": 25.0
        }
    },
    {
        "id": "barren_volcano",
        "title": "Barren Island Caldera Thermal Anomaly & Ash Venting",
        "region": "Andaman Sea (138 km East of Port Blair)",
        "category_hint": "VOLCANIC_ANOMALY",
        "description": "Sentinel-2 SWIR and TROPOMI sensors detect 142 MW thermal bloom from central caldera with SO2 aerosol plume column rising to 4.2 km. Continuous strombolian lava ejection along western fissure into sea.",
        "telemetry": {
            "thermal_power_mw": 142.0,
            "so2_column_du": 4.8,
            "plume_height_km": 4.2,
            "acoustic_tremor_hz": 3.4,
            "barometric_pressure_hpa": 1006.0,
            "wind_speed_kmh": 22.0,
            "rainfall_48h_mm": 12.0,
            "soil_saturation_pct": 40.0,
            "seismic_pga_g": 0.05
        },
        "what_if_defaults": {
            "param1_name": "Thermal Power (MW)",
            "param1_val": 142.0,
            "param1_min": 20.0,
            "param1_max": 500.0,
            "param2_name": "Plume Height (km)",
            "param2_val": 4.2,
            "param2_min": 1.0,
            "param2_max": 15.0
        }
    },
    {
        "id": "himalayan_earthquake",
        "title": "Himalayan Main Boundary Thrust (MBT) Seismic Rupture",
        "region": "Uttarakhand / Garhwal Seismic Belt",
        "category_hint": "SEISMIC_EARTHQUAKE",
        "description": "Strong motion accelerometer network detects Mw 6.4 tectonic rupture along Main Boundary Thrust at 14 km focal depth. Peak Ground Acceleration (PGA) measured at 0.38g in Rudraprayag and Chamoli.",
        "telemetry": {
            "seismic_magnitude_mw": 6.4,
            "focal_depth_km": 14.0,
            "seismic_pga_g": 0.38,
            "mmi_intensity": 7.5,
            "aftershock_count_1h": 12,
            "barometric_pressure_hpa": 1008.0,
            "wind_speed_kmh": 14.0,
            "rainfall_48h_mm": 25.0,
            "soil_saturation_pct": 52.0,
            "thermal_power_mw": 0.0
        },
        "what_if_defaults": {
            "param1_name": "Magnitude (Mw)",
            "param1_val": 6.4,
            "param1_min": 4.5,
            "param1_max": 8.5,
            "param2_name": "Focal Depth (km)",
            "param2_val": 14.0,
            "param2_min": 5.0,
            "param2_max": 60.0
        }
    }
]

def classify_disaster(
    text: str = "",
    telemetry: Optional[Dict[str, Any]] = None,
    category_hint: Optional[str] = None
) -> Dict[str, Any]:
    """
    Intelligent Multi-Class Hazard Classification Engine.
    Uses multi-feature heuristics, physics-based parameter bounds, and multilingual NLP.
    """
    telemetry = telemetry or {}
    text_clean = (text or "").lower()

    # Probability accumulator for each class
    scores = {cls: 0.05 for cls in DISASTER_CLASSES}

    # 1. Feature attribution scores based on physical sensors
    attributions = []

    # Landslide triggers
    soil_sat = float(telemetry.get("soil_saturation_pct", 0))
    rain_48h = float(telemetry.get("rainfall_48h_mm", 0))
    slope = float(telemetry.get("slope_angle_deg", 0))
    pore_kpa = float(telemetry.get("pore_pressure_kpa", 0))

    if soil_sat > 70 or rain_48h > 150 or slope > 25 or pore_kpa > 50:
        ls_weight = (soil_sat / 100.0) * 0.45 + min(1.0, rain_48h / 250.0) * 0.35 + min(1.0, slope / 40.0) * 0.20
        scores["LANDSLIDE_DEBRIS_FLOW"] += ls_weight * 2.8
        attributions.append({
            "feature": "Soil Pore Saturation & Antecedent Rain",
            "value": f"{soil_sat:.1f}% sat, {rain_48h:.0f} mm/48h",
            "weight": round(ls_weight, 2),
            "target": "LANDSLIDE_DEBRIS_FLOW",
            "impact": "High Geotechnical Instability"
        })

    # Cyclone triggers
    wind_kmh = float(telemetry.get("wind_speed_kmh", 0))
    press_hpa = float(telemetry.get("barometric_pressure_hpa", 1013))
    dist_coast = float(telemetry.get("distance_to_coast_km", 999))

    if wind_kmh > 65 or press_hpa < 995:
        cyc_weight = min(1.0, (wind_kmh - 50) / 100.0) * 0.55 + max(0.0, (1013 - press_hpa) / 40.0) * 0.45
        scores["TROPICAL_CYCLONE"] += cyc_weight * 3.0
        attributions.append({
            "feature": "Barometric Depression & Gale Core",
            "value": f"{press_hpa:.1f} hPa, {wind_kmh:.0f} km/h",
            "weight": round(cyc_weight, 2),
            "target": "TROPICAL_CYCLONE",
            "impact": "Severe Cyclonic Circulation"
        })

    # Flood triggers
    river_stage = float(telemetry.get("river_stage_above_danger_m", 0))
    discharge = float(telemetry.get("river_discharge_cusecs", 0))
    freeboard = float(telemetry.get("embankment_freeboard_m", 99))

    if river_stage > 0.5 or discharge > 20000 or freeboard < 1.0:
        flood_weight = min(1.0, river_stage / 2.0) * 0.50 + min(1.0, discharge / 50000.0) * 0.35 + max(0.0, (1.0 - freeboard)) * 0.15
        scores["RIVERINE_FLOOD"] += flood_weight * 2.9
        attributions.append({
            "feature": "River Stage Delta & Catchment Runoff",
            "value": f"+{river_stage:.2f}m above danger, {discharge:,.0f} cusecs",
            "weight": round(flood_weight, 2),
            "target": "RIVERINE_FLOOD",
            "impact": "Critical Riparian Inundation"
        })

    # Wildfire triggers
    thermal_mw = float(telemetry.get("thermal_power_mw", 0))
    fuel_moist = float(telemetry.get("fuel_moisture_pct", 100))
    ambient_c = float(telemetry.get("ambient_temp_c", 25))

    if (thermal_mw > 150 and fuel_moist < 15) or ambient_c > 38:
        wf_weight = min(1.0, thermal_mw / 400.0) * 0.60 + max(0.0, (20 - fuel_moist) / 20.0) * 0.40
        scores["FOREST_WILDFIRE"] += wf_weight * 3.0
        attributions.append({
            "feature": "Fire Radiative Power (FRP) & Fuel Dryness",
            "value": f"{thermal_mw:.0f} MW, {fuel_moist:.1f}% fuel moisture",
            "weight": round(wf_weight, 2),
            "target": "FOREST_WILDFIRE",
            "impact": "Rapid Canopy Fire Spread"
        })

    # Volcanic triggers
    so2_du = float(telemetry.get("so2_column_du", 0))
    plume_km = float(telemetry.get("plume_height_km", 0))

    if (thermal_mw > 50 and so2_du > 2.0) or plume_km > 2.0:
        volc_weight = min(1.0, so2_du / 6.0) * 0.50 + min(1.0, plume_km / 8.0) * 0.50
        scores["VOLCANIC_ANOMALY"] += volc_weight * 3.2
        attributions.append({
            "feature": "SO₂ Column Plume & Caldera Venting",
            "value": f"{so2_du:.1f} DU SO₂, {plume_km:.1f} km ash column",
            "weight": round(volc_weight, 2),
            "target": "VOLCANIC_ANOMALY",
            "impact": "Sub-surface Magmatic / Hydrothermal Vent"
        })

    # Earthquake triggers
    pga_g = float(telemetry.get("seismic_pga_g", 0))
    mag_mw = float(telemetry.get("seismic_magnitude_mw", 0))

    if pga_g > 0.10 or mag_mw > 5.0:
        eq_weight = min(1.0, pga_g / 0.50) * 0.60 + max(0.0, (mag_mw - 4.5) / 3.0) * 0.40
        scores["SEISMIC_EARTHQUAKE"] += eq_weight * 3.5
        attributions.append({
            "feature": "Peak Ground Acceleration & Moment Magnitude",
            "value": f"{pga_g:.2f}g PGA, Mw {mag_mw:.1f}",
            "weight": round(eq_weight, 2),
            "target": "SEISMIC_EARTHQUAKE",
            "impact": "High Structural Masonry Hazard"
        })

    # 2. Multilingual Natural Language Keywords Attribution
    nlp_patterns = {
        "LANDSLIDE_DEBRIS_FLOW": [r"landslide", r"mudslip", r"debris flow", r"slope", r"भूस्खलन", r"मलबा", r"पहाड़ खिसकना"],
        "TROPICAL_CYCLONE": [r"cyclone", r"storm surge", r"eye wall", r"typhoon", r"चक्रवात", r"महातूफान", r"तट प्रवेश"],
        "RIVERINE_FLOOD": [r"flood", r"inundat", r"river stage", r"overtop", r"dyke", r"बाढ़", r"जलभराव", r"डूबा"],
        "FOREST_WILDFIRE": [r"wildfire", r"forest fire", r"canopy blaze", r"दावानल", r"जंगल की आग"],
        "VOLCANIC_ANOMALY": [r"volcano", r"caldera", r"lava", r"ash plume", r"ज्वालामुखी", r"राख"],
        "SEISMIC_EARTHQUAKE": [r"earthquake", r"tremor", r"seismic", r"aftershock", r"भूकंप", r"झटके"]
    }

    for cls, patterns in nlp_patterns.items():
        match_count = sum(1 for pat in patterns if re.search(pat, text_clean))
        if match_count > 0:
            scores[cls] += match_count * 0.85
            attributions.append({
                "feature": "NLP Incident Keyword Correlation",
                "value": f"{match_count} matched lexical tokens",
                "weight": round(min(1.0, match_count * 0.35), 2),
                "target": cls,
                "impact": "Field Semantic Correlation"
            })

    # Apply category hint if provided explicitly
    if category_hint and category_hint in scores:
        scores[category_hint] += 1.5

    # Compute softmax-normalized probabilities
    max_score = max(scores.values())
    exp_scores = {cls: math.exp(score - max_score) for cls, score in scores.items()}
    sum_exp = sum(exp_scores.values())
    probs = {cls: round((exp_s / sum_exp) * 100, 1) for cls, exp_s in exp_scores.items()}

    # Pick top predicted class
    sorted_classes = sorted(probs.items(), key=lambda x: x[1], reverse=True)
    best_class, best_confidence = sorted_classes[0]

    # Compute MHSI score (0-100) based on severity factors
    if best_class == "LANDSLIDE_DEBRIS_FLOW":
        mhsi = min(98.0, max(25.0, (soil_sat * 0.40 + rain_48h * 0.15 + slope * 0.40)))
    elif best_class == "TROPICAL_CYCLONE":
        mhsi = min(99.0, max(20.0, (wind_kmh * 0.50 + max(0.0, 1013 - press_hpa) * 1.2)))
    elif best_class == "RIVERINE_FLOOD":
        mhsi = min(95.0, max(25.0, (river_stage * 30.0 + (discharge / 1000.0) * 0.8)))
    elif best_class == "FOREST_WILDFIRE":
        mhsi = min(94.0, max(25.0, ((thermal_mw / 5.0) + (100 - fuel_moist) * 0.3)))
    elif best_class == "VOLCANIC_ANOMALY":
        mhsi = min(88.0, max(20.0, ((thermal_mw / 4.0) + so2_du * 8.0)))
    elif best_class == "SEISMIC_EARTHQUAKE":
        mhsi = min(99.0, max(30.0, (pga_g * 140.0 + mag_mw * 6.0)))
    else:
        mhsi = 50.0

    mhsi = round(mhsi, 1)

    # Assign Alert Tier
    if mhsi >= 65.0:
        alert_tier = "LEVEL_3_RED_CRISIS"
        alert_label = "RED ALERT (Immediate Emergency Protocols Active)"
        badge_color = "bg-red-600"
    elif mhsi >= 40.0:
        alert_tier = "LEVEL_2_ORANGE_ADVISORY"
        alert_label = "ORANGE ADVISORY (Tactical Mobilization Staging)"
        badge_color = "bg-orange-600"
    elif mhsi >= 20.0:
        alert_tier = "LEVEL_1_YELLOW_WATCH"
        alert_label = "YELLOW WATCH (Guarded Surveillance Active)"
        badge_color = "bg-amber-500"
    else:
        alert_tier = "LEVEL_0_GREEN_NORMAL"
        alert_label = "GREEN NORMAL (De-escalated / Controlled)"
        badge_color = "bg-emerald-600"

    # Filter attributions relevant to best class or high impact
    relevant_attr = [a for a in attributions if a.get("target") == best_class or a.get("weight", 0) >= 0.40]
    if not relevant_attr:
        relevant_attr = [{
            "feature": "Multi-Sensor Synoptic Convergence",
            "value": "Telemetry signatures match historical hazard envelope",
            "weight": 0.85,
            "impact": "Composite Risk Match"
        }]

    return {
        "classified_class": best_class,
        "confidence_pct": best_confidence,
        "mhsi_score": mhsi,
        "alert_tier": alert_tier,
        "alert_label": alert_label,
        "badge_color": badge_color,
        "class_probabilities": probs,
        "feature_attributions": relevant_attr[:4]
    }


def synthesize_individual_mitigation_plan(
    classified_class: str,
    mhsi_score: float,
    telemetry: Dict[str, Any],
    location_name: str = "Regional Sector"
) -> Dict[str, Any]:
    """
    Synthesizes an Individual, Specialized Operational Master Plan tailored specifically
    to the unique physical behavior and tactical requirements of the classified disaster.
    """

    if classified_class == "LANDSLIDE_DEBRIS_FLOW":
        return {
            "disaster_name": "Hillside Slope Instability & Debris Torrent",
            "hazard_mechanics": "Hydraulic pore-water pressure exceeds Mohr-Coulomb shear strength of topsoil layer, triggering planar or rotational slippage channelizing into viscous debris torrent.",
            "primary_threat_vectors": [
                "Debris runout velocity reaching 25-45 km/h along valley channels",
                "Damming of natural river channels forming temporary catastrophic flash reservoirs",
                "Shear cracking across tea estates and arterial mountain bridges",
                "Secondary liquefaction triggered by sustained precipitation"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Immediate Life Safety & Zoned Evacuation",
                    "actions": [
                        "Sound localized pneumatic sirens (continuous 3-minute pulse) across vulnerable downslope settlements.",
                        "Enforce immediate mandatory evacuation of Chooralmala/Mundakkai valley floor within 400m of stream bed.",
                        "Block all non-emergency traffic at foothill checkpoints (Vythiri / Meppadi access roads).",
                        "Issue CAP v1.2 Cell Broadcast to all IMSI numbers connected to local base transceivers."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Tactical Search & Heavy Hardware Deployment",
                    "actions": [
                        "Deploy 4 NDRF battalions equipped with high-mobility tracked hydraulic excavators and synthetic winch ropes.",
                        "Mobilize Army Engineering Task Force (Madras Sappers) for immediate Bailey Bridge installation over severed river crossings.",
                        "Deploy search-and-rescue K9 cadaver/live detection units and ground-penetrating radar (GPR).",
                        "Establish forward medical triage point at Meppadi Community Health Centre."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Lifeline Clearance & Humanitarian Relief",
                    "actions": [
                        "Clear debris choke points using simultaneous 2-point excavator operations to restore road access.",
                        "Air-drop dry food packets, purification tablets, and satellite phones to stranded high-altitude pockets.",
                        "Deploy Mobile Cell-on-Wheels (COW) units to re-establish emergency telecom links.",
                        "De-energize 11kV high-tension power lines running through the debris zone to prevent electrocution."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Cascading Risk Prevention & Geological Survey",
                    "actions": [
                        "Conduct UAV LiDAR flights to detect upstream debris damming and prevent secondary flash flooding.",
                        "Install piezometric pore-pressure boreholes to monitor residual water dissipation.",
                        "Relocate all displaced families to designated permanent cyclone/monsoon concrete shelters.",
                        "Initiate post-disaster geotechnical slope stabilization with hydro-seeding and wire-mesh gabions."
                    ]
                }
            ],
            "resources": {
                "ndrf_battalions": 6,
                "heavy_excavators": 18,
                "bailey_bridges_staged": 2,
                "uav_drones_active": 8,
                "potable_water_liters": 85000,
                "trauma_medical_tents": 4
            },
            "directives": {
                "en": f"DIRECTIVE TO DISTRICT COLLECTOR ({location_name}): Enforce immediate Section 144 around designated red-zone hillsides. Mobilize all registered earth-moving machinery under DM Act 2005. Stage Indian Army engineering units for immediate bridging operations.",
                "hi": f"जिला कलेक्टर को निर्देश ({location_name}): आपदा प्रबंधन अधिनियम 2005 के तहत चिन्हित रेड-ज़ोन पहाड़ियों के आसपास तत्काल धारा 144 लागू करें। सभी उत्खनन मशीनों को तुरंत जुटाएं और बेली ब्रिज निर्माण हेतु सेना इंजीनियरिंग कोर को तैनात करें।"
            }
        }

    elif classified_class == "TROPICAL_CYCLONE":
        return {
            "disaster_name": "Severe Tropical Cyclone & Coastal Surge",
            "hazard_mechanics": "Deep atmospheric depression driven by latent heat release over warm sea surface (>28°C), generating concentric gale wind fields and dangerous astronomical storm surge inundation.",
            "primary_threat_vectors": [
                "Destructive core wind gusts exceeding 135 km/h tearing unreinforced roofs",
                "Coastal storm surge of 2.0 - 3.5m overtopping saline embankments",
                "Widespread electrical grid disruption and falling tree strikes",
                "Inland flash flooding from extreme precipitation rainbands"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Harbor Lockdown & Maritime Evacuation",
                    "actions": [
                        "Hoisting of Great Danger Signal #10 at Paradip, Dhamra, and Gopalpur ports.",
                        "Complete recall of all motorized fishing trawlers; enforce total ban on sea entry.",
                        "Broadcast CAP Emergency Alerts to all mobile subscribers in coastal panchayats within 15 km of shoreline.",
                        "Initiate zero-casualty priority evacuation of elderly, pregnant women, and children to Multipurpose Cyclone Shelters."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Mass Evacuation & Power Grid Isolation",
                    "actions": [
                        "Complete evacuation of 250,000+ residents living in thatched/asbestos houses within the 10 km surge zone.",
                        "Pre-emptively de-energize 33kV and 11kV coastal sub-stations 3 hours prior to gale-force winds.",
                        "Position quick-clearing road teams armed with chainsaw cutters at 5 km intervals along NH-16.",
                        "Secure automated diesel generators at district hospitals and oxygen generation plants."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Landfall Management & Eye-Wall Passage",
                    "actions": [
                        "Strict lockdown: Zero human or vehicle movement during eye-wall passage and deceptive eye calm.",
                        "Deploy amphibious tracked rescue vehicles for trapped coastal hamlets cut off by tidal surge.",
                        "Mobilize water tankers with chlorine dosing to prevent brackish water disease outbreak.",
                        "Track post-landfall decay and issue inland flash flood warnings for downstream river basins."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Restoration, Power Energization & Compensation Survey",
                    "actions": [
                        "Restore primary arterial highways and remove fallen trees within 12 hours of landfall.",
                        "Conduct drone surveys to calculate crop salinity damage and structural housing collapse.",
                        "Inspect sub-stations for moisture and systematically re-energize residential power grids.",
                        "Distribute disaster relief compensation packets via direct benefit transfer (DBT)."
                    ]
                }
            ],
            "resources": {
                "ndrf_battalions": 14,
                "cyclone_shelters_active": 450,
                "inflatable_gemini_boats": 65,
                "chainsaw_tree_cutters": 240,
                "mobile_diesel_generators": 85,
                "packaged_dry_rations": 300000
            },
            "directives": {
                "en": f"OPERATIONAL ORDER ({location_name}): Enforce mandatory evacuation along entire vulnerable coastline. Prohibit all maritime operations. Power utility DISCOM to initiate staggered shutdown of coastal grids prior to gale wind onset.",
                "hi": f"कमान निर्देश ({location_name}): पूरी तटरेखा पर अनिवार्य निकासी सुनिश्चित करें। सभी समुद्री और मछली पकड़ने की गतिविधियों पर पूर्ण प्रतिबंध लगाएं। 60 किमी/घंटा से अधिक हवा की गति होने से पूर्व विद्युत ग्रिड बंद करें।"
            }
        }

    elif classified_class == "RIVERINE_FLOOD":
        return {
            "disaster_name": "Riverine Basin Inundation & Embankment Breach",
            "hazard_mechanics": "Catchment deluge exceeds river channel carrying capacity, causing hydraulic backwater pressure and structural failure of earthen dykes.",
            "primary_threat_vectors": [
                "Sudden dyke breach creating catastrophic wall of water in rural habitations",
                "Prolonged waterlogging isolating island populations (e.g. Majuli)",
                "Contamination of groundwater aquifers causing waterborne cholera/diarrhea",
                "Destruction of standing paddy crops and livestock mortality"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Embankment Patrol & Alert Warning",
                    "actions": [
                        "Deploy 24x7 geotechnical foot-patrols along flood embankments to identify boiling and seepage points.",
                        "Pre-position 50,000 geo-textile sandbags and wooden pilings at critical embankment spurs.",
                        "Trigger early warning siren at all riverside revenue villages.",
                        "Coordinate with Central Water Commission (CWC) for upstream dam discharge throttling."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Water Rescue & High-Ground Evacuation",
                    "actions": [
                        "Deploy 35 inflatable OBM Gemini rescue boats for immediate evacuation of marooned river islands.",
                        "Shift vulnerable population and cattle to designated highland raised platforms (Highlands/Chaporis).",
                        "Set up community kitchens (Langar) supplying warm cooked meals and baby food.",
                        "Stage Indian Air Force Mi-17 helicopters for emergency winching operations."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Breach Plugging & Medical Disinfection",
                    "actions": [
                        "Execute emergency dyke plugging using gabion boulder crates and geo-synthetic mattresses.",
                        "Deploy high-capacity dewatering axial pumps (1000 GPM) to drain water from hospitals and substations.",
                        "Distribute chlorine halogen tablets and ORS sachets across all relief camps.",
                        "Launch mobile medical boat clinics staffed with pediatric and epidemiological doctors."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Receding Water Sanitation & Vector Control",
                    "actions": [
                        "Spray bleaching powder and malathion fogging to prevent post-flood dengue and malaria outbreaks.",
                        "Conduct carcass disposal protocol with deep limestone burial to prevent bacterial contamination.",
                        "Begin structural integrity audit of flooded road bridges and railway culverts.",
                        "Initiate satellite Sentinel-1 SAR flood extent mapping for agricultural loss evaluation."
                    ]
                }
            ],
            "resources": {
                "inflatable_gemini_boats": 45,
                "high_capacity_dewatering_pumps": 30,
                "geo_sandbags_staged": 120000,
                "mobile_water_treatment_units": 8,
                "halogen_chlorine_tabs": 500000,
                "veterinary_fodder_camps": 12
            },
            "directives": {
                "en": f"HYDROLOGICAL CRISIS DIRECTIVE ({location_name}): Implement immediate breach reinforcement along vulnerable river bends. Position SDRF boat flotilla for immediate island rescue. CWC gauge operators to report stage delta hourly.",
                "hi": f"जल संकट कमान निर्देश ({location_name}): संवेदनशील तटबंधों पर तत्काल सैंडबैग सुदृढ़ीकरण लागू करें। नदी द्वीपों से त्वरित बचाव हेतु नाव दस्ते तैनात करें। सीडब्ल्यूसी गेज अधिकारी प्रति घंटा जलस्तर रिपोर्ट दें।"
            }
        }

    elif classified_class == "FOREST_WILDFIRE":
        return {
            "disaster_name": "Forest Canopy Wildfire & Biosphere Reserve Blaze",
            "hazard_mechanics": "Extreme thermal combustion fueled by dry deciduous leaf litter, high ambient temperatures, and wind-driven ember spotting creating multi-directional fire fronts.",
            "primary_threat_vectors": [
                "Rapid fire spread velocity (>8 km/h) jumping across natural gorges",
                "Ember spotting igniting spot fires up to 1.5 km ahead of main fire front",
                "Dense toxic smoke plumes causing asphyxiation in wildlife and nearby tribal villages",
                "Loss of endangered flora, fauna, and canopy carbon sink"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Perimeter Containment & Firebreak Cutting",
                    "actions": [
                        "Deploy forest protection strike forces to cut 10m-wide counter-fire breaks using brush cutters.",
                        "Evacuate tribal forest fringe hamlets located downwind of advancing fire front.",
                        "Dispatch 6 specialized forest fire water tenders and high-pressure backpack blowers.",
                        "Activate satellite thermal hotspot tracking via FSI (Forest Survey of India) SNPP-VIIRS."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Aerial Retardant Sorties & Counter-Firing",
                    "actions": [
                        "Requisition Indian Air Force Bambi Bucket helicopter sorties to douse inaccessible ridge tops.",
                        "Execute controlled back-burning (counter-firing) under expert supervision to starve fire front.",
                        "Establish smoke-free animal escape corridors leading towards water reservoirs.",
                        "Distribute N95/carbon smoke filter respirators to forest frontline personnel."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Mop-Up Operations & Smoldering Root Extinguishment",
                    "actions": [
                        "Extinguish deep smoldering subterranean roots and hollow tree trunks using chemical foam.",
                        "Maintain 24-hour ember watch at cleared perimeter boundaries to prevent flare-ups.",
                        "Conduct thermal infrared drone sweeps to detect hidden underground heat signatures.",
                        "Set up wildlife medical triage camp for burned or asphyxiated animals."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Ecological Restoration & Post-Fire Audit",
                    "actions": [
                        "Audit scorched acreage using Sentinel-2 Normalized Burn Ratio (NBR).",
                        "Install soil erosion barriers along bare hillsides to prevent monsoonal mudslides.",
                        "Investigate origin point for potential illegal poaching or dry season clearance.",
                        "Implement indigenous tree sapling replanting and soil nutrient rejuvenation plan."
                    ]
                }
            ],
            "resources": {
                "iaf_helicopter_bambi_sorties": 12,
                "fire_fighting_strike_personnel": 220,
                "backpack_air_blowers": 95,
                "high_pressure_water_tenders": 14,
                "thermal_uav_sweeps": 6,
                "smoke_respirators": 1500
            },
            "directives": {
                "en": f"FOREST FIRE EMERGENCY DIRECTIVE ({location_name}): Mobilize all beat officers for perimeter back-burning. Enforce complete tourist and tribal ban on reserve core. Coordinate IAF Bambi Bucket sorties for canopy suppression.",
                "hi": f"वनाग्नि कमान निर्देश ({location_name}): परिधि पर नियंत्रित आग (बैक-बर्निंग) द्वारा आग को फैलने से रोकें। रिज़र्व के मुख्य क्षेत्र में नागरिकों के प्रवेश पर पूर्ण रोक लगाएं। वायुसेना हेलीकॉप्टर द्वारा पानी की बौछार कराएं।"
            }
        }

    elif classified_class == "VOLCANIC_ANOMALY":
        return {
            "disaster_name": "Volcanic Eruption & Pyroclastic Gas Venting",
            "hazard_mechanics": "Sub-surface magma ascent through central conduit ejecting basaltic spatter, volcanic ash, and high-concentration SO2 aerosol columns.",
            "primary_threat_vectors": [
                "Aviation hazards from high-altitude abrasive volcanic ash clouds",
                "Toxic sulfur dioxide (SO2) dispersion triggering severe respiratory distress",
                "Sub-surface lava entry into sea generating hazardous steam-acid plumes (laze)",
                "Local marine tsunami risk from slope collapse"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Airspace Exclusion & Maritime Cordon",
                    "actions": [
                        "Issue immediate NOTAM (Notice to Airmen) establishing a 45 km Flight Level 250 exclusion zone.",
                        "Indian Coast Guard enforces a 30 nautical mile maritime perimeter around the island.",
                        "Task INSAT-3DR and Sentinel-5P for hourly SO2 column and aerosol optical depth tracking.",
                        "Alert Port Blair Civil Aviation radar for ash plume trajectory shifts towards shipping lanes."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Naval Patrol & Thermal Surveillance",
                    "actions": [
                        "Deploy Indian Navy offshore patrol vessel with gas chromatography instruments to monitor air toxicity.",
                        "Activate seismic accelerometer telemetry on nearby islands to detect paroxysmal eruption signs.",
                        "Broadcast maritime navigational warnings (NAVTEX) in multiple languages.",
                        "Ensure standby emergency evacuation plan for research personnel on adjacent outposts."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Aerosol Dispersion Modeling & Tsunami Watch",
                    "actions": [
                        "Run HYSPLIT atmospheric dispersion models to forecast SO2 plume landfall over coastal Andaman.",
                        "Maintain INCOIS bottom pressure recorders on 24x7 watch for seismic slope failure tsunamis.",
                        "Pre-distribute specialized SO2 respirators and eye protection in Port Blair port area.",
                        "Conduct high-resolution synthetic aperture radar (SAR) passes to track caldera morphology."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Scientific Assessment & Airway De-restriction",
                    "actions": [
                        "Review Geological Survey of India (GSI) thermal drone telemetry for magma subsidence.",
                        "Evaluate ash particle concentration in lower atmosphere before adjusting flight corridors.",
                        "Archive thermal radiative power metrics into national volcanological registry.",
                        "Maintain automated real-time satellite alert trigger thresholds."
                    ]
                }
            ],
            "resources": {
                "coast_guard_patrol_vessels": 3,
                "notam_airspace_sectors_closed": 2,
                "so2_gas_monitoring_buoys": 4,
                "satellite_tasking_passes_per_day": 8,
                "specialized_so2_respirators": 5000,
                "tsunami_gauge_monitoring_stations": 6
            },
            "directives": {
                "en": f"VOLCANIC ALERT DIRECTIVE ({location_name}): Enforce strict 30 NM maritime exclusion cordon. Airports Authority of India to divert all civil flights away from ash plume envelope. Coast Guard to interdict unauthorized vessels.",
                "hi": f"ज्वालामुखी कमान निर्देश ({location_name}): द्वीप के चारों ओर 30 समुद्री मील का सख्त सुरक्षा घेरा लागू करें। विमानपत्तन प्राधिकरण सभी नागरिक उड़ानों को राख के बादल से दूर मोड़ें।"
            }
        }

    else: # SEISMIC_EARTHQUAKE or default
        return {
            "disaster_name": "Tectonic Fault Rupture & Seismic Ground Motion",
            "hazard_mechanics": "Sudden release of elastic strain energy along tectonic plate boundary generating compressive P-waves and destructive shear S-waves propagating through crustal strata.",
            "primary_threat_vectors": [
                "Unreinforced masonry building collapse and trapping of occupants",
                "Ground liquefaction and severed underground gas and water mains",
                "Secondary mountain landslides blocking vital relief corridors",
                "Prolonged sequence of high-magnitude aftershocks threatening rescue crews"
            ],
            "phases": [
                {
                    "phase_id": "T0_T2",
                    "timeframe": "T - 0h to T + 2h",
                    "title": "Golden Hour Search & Gas Grid Isolation",
                    "actions": [
                        "Mobilize specialized Urban Search & Rescue (USAR) teams with acoustic listening and snake cameras.",
                        "Execute emergency automatic shutoff of city gas distribution networks to prevent catastrophic conflagration.",
                        "Activate State Emergency Operations Center (SEOC) under National Incident Management System (NIMS).",
                        "Enforce open-air congregational zones in public parks; prohibit re-entry into structurally damaged buildings."
                    ]
                },
                {
                    "phase_id": "T2_T6",
                    "timeframe": "T + 2h to T + 6h",
                    "title": "Structural Triage & Air Corridor Mobilization",
                    "actions": [
                        "Civil engineers implement Rapid Damage Assessment Tagging (Red = Condemned, Yellow = Restricted, Green = Safe).",
                        "Indian Air Force activates C-130J transport aircraft carrying field trauma hospitals and hydraulic spreaders.",
                        "Establish open-air triage surgical theater at district stadium with backup blood bank refrigeration.",
                        "Deploy seismic aftershock warning accelerometer network to sound sirens 10 seconds before aftershock S-waves arrive."
                    ]
                },
                {
                    "phase_id": "T6_T24",
                    "timeframe": "T + 6h to T + 24h",
                    "title": "Extrication & Emergency Sheltering",
                    "actions": [
                        "Conduct heavy concrete cutting and tunnel extraction for collapsed multi-story structures.",
                        "Set up emergency tent cities equipped with portable chemical toilets and halogen water purification.",
                        "Establish Missing Persons Registry with biometric and facial verification desks.",
                        "Restore electricity to designated trauma centers via mobile substation transformer trucks."
                    ]
                },
                {
                    "phase_id": "T24_T72",
                    "timeframe": "T + 24h to T + 72h",
                    "title": "Secondary Threat Mitigation & Temporary Housing",
                    "actions": [
                        "Clear seismic landslide blocks along critical national highways to re-open supply conduits.",
                        "Provide professional psychological trauma counseling to disaster survivors.",
                        "Deploy structural laser vibrometers to monitor stability of bridges, dams, and historic monuments.",
                        "Transition emergency relief into intermediate prefabricated shelter distribution."
                    ]
                }
            ],
            "resources": {
                "ndrf_usar_teams": 12,
                "acoustic_life_detectors": 28,
                "iaf_c130j_airlift_sorties": 8,
                "emergency_shelter_tents": 2500,
                "mobile_field_surgical_hospitals": 3,
                "dog_search_squads": 14
            },
            "directives": {
                "en": f"SEISMIC EMERGENCY DIRECTIVE ({location_name}): Mobilize all available USAR teams under Golden Hour protocol. Shut down municipal gas mains immediately. Enforce building condemnation tagging before civilian re-entry.",
                "hi": f"भूकंप कमान निर्देश ({location_name}): गोल्डन ऑवर प्रोटोकॉल के तहत सभी यूएसएआर बचाव दल तैनात करें। गैस ग्रिड तत्काल बंद करें। संरचनात्मक सुरक्षा टैगिंग के बिना क्षतिग्रस्त इमारतों में प्रवेश पूर्णतः वर्जित करें।"
            }
        }


def compute_hazard_what_if_simulation(
    classified_class: str,
    param1: float,
    param2: float
) -> Dict[str, Any]:
    """
    Computes a disaster-specific What-If dynamic simulation based on that disaster's
    unique physical parameters and equations.
    """

    if classified_class == "LANDSLIDE_DEBRIS_FLOW":
        # param1: Rainfall rate (mm/hr), param2: Slope angle (degrees)
        rain_rate = param1
        slope_deg = param2
        slope_rad = math.radians(slope_deg)

        # Factor of Safety (FoS) estimation
        # Baseline cohesion & friction angle = 28 deg
        # High rainfall increases pore pressure, lowering FoS
        phi_rad = math.radians(28.0)
        pore_pressure_ratio = min(0.95, (rain_rate / 80.0) * 0.70 + 0.20)
        fos = (math.tan(phi_rad) / math.tan(slope_rad)) * (1.0 - pore_pressure_ratio)
        fos = max(0.40, min(2.5, round(fos, 2)))

        # Debris volume estimate (m^3)
        debris_volume = int(max(1000, min(120000, 2500 * (slope_deg / 25.0) * (rain_rate / 30.0)**1.5)))
        # Runout reach (meters down valley)
        runout_reach_m = int(max(200, min(3500, (debris_volume**0.42) * (slope_deg / 15.0) * 35)))
        # Population in danger zone
        evac_needed = int(runout_reach_m * 1.8)

        if fos < 1.0:
            status = "CRITICAL SLOPE COLLAPSE IMMINENT (FoS < 1.0)"
            severity = "HIGH_DANGER"
        elif fos < 1.25:
            status = "UNSTABLE MARGIN (High Liquefaction Risk)"
            severity = "WARNING"
        else:
            status = "STABLE EQUILIBRIUM"
            severity = "SAFE"

        return {
            "simulation_type": "GEOTECHNICAL_SLOPE_STABILITY",
            "param1_label": "Rainfall Rate",
            "param1_value": f"{rain_rate} mm/hr",
            "param2_label": "Slope Gradient",
            "param2_value": f"{slope_deg}°",
            "metrics": [
                {"label": "Factor of Safety (FoS)", "value": f"{fos:.2f}", "flag": "danger" if fos < 1.0 else "safe", "unit": "Ratio (<1.0 is failure)"},
                {"label": "Predicted Debris Volume", "value": f"{debris_volume:,}", "flag": "normal", "unit": "Cubic Meters (m³)"},
                {"label": "Debris Runout Reach", "value": f"{runout_reach_m} m", "flag": "danger" if runout_reach_m > 1200 else "normal", "unit": "Downslope Channel"},
                {"label": "Population At Direct Risk", "value": f"{evac_needed:,}", "flag": "danger" if evac_needed > 1000 else "normal", "unit": "Individuals to Evacuate"}
            ],
            "status_headline": status,
            "severity_tag": severity,
            "ai_inference": f"At {rain_rate} mm/hr rain on a {slope_deg}° gradient, geotechnical hydraulic pore pressure reduces slope shear resistance to FoS {fos:.2f}. " + 
                           ("Immediate evacuation of valley settlements is imperative as failure threshold is breached." if fos < 1.0 else "Slope remains under monitored equilibrium but requires continuous telemetry surveillance.")
        }

    elif classified_class == "TROPICAL_CYCLONE":
        # param1: Central Pressure (hPa), param2: Distance to Coast (km)
        pressure_hpa = param1
        dist_km = param2

        # Empirical wind estimation (Holland / Dvorak relation)
        delta_p = max(5.0, 1013.0 - pressure_hpa)
        sustained_wind_kmh = int(math.sqrt(delta_p) * 18.5)
        gusts_kmh = int(sustained_wind_kmh * 1.28)

        # Storm surge height (Bathymetry-dependent shallow Bay of Bengal formula)
        surge_m = max(0.2, round((delta_p * 0.08) * (1.0 + (sustained_wind_kmh / 200.0)), 1))
        # Evacuees required within surge buffer
        evac_count = int(max(5000, min(800000, (surge_m * 45000) * max(0.3, (120 - min(120, dist_km)) / 100.0))))
        hours_to_landfall = max(0.5, round(dist_km / 18.0, 1))

        if sustained_wind_kmh >= 120:
            category = "VERY SEVERE CYCLONIC STORM (VSCS)"
            severity = "HIGH_DANGER"
        elif sustained_wind_kmh >= 89:
            category = "SEVERE CYCLONIC STORM (SCS)"
            severity = "WARNING"
        elif sustained_wind_kmh >= 62:
            category = "CYCLONIC STORM (CS)"
            severity = "WARNING"
        else:
            category = "DEPRESSION / LOW THREAT"
            severity = "SAFE"

        return {
            "simulation_type": "CYCLONIC_WIND_AND_SURGE_DYNAMICS",
            "param1_label": "Central Barometric Pressure",
            "param1_value": f"{pressure_hpa} hPa",
            "param2_label": "Distance to Coast",
            "param2_value": f"{dist_km} km",
            "metrics": [
                {"label": "Sustained Core Winds", "value": f"{sustained_wind_kmh} km/h", "flag": "danger" if sustained_wind_kmh > 100 else "normal", "unit": f"Gusts to {gusts_kmh} km/h"},
                {"label": "Peak Storm Surge Height", "value": f"+{surge_m} m", "flag": "danger" if surge_m > 1.8 else "normal", "unit": "Above Astronomical Tide"},
                {"label": "Estimated Time to Landfall", "value": f"{hours_to_landfall} hrs", "flag": "normal", "unit": "@ 18 km/h Translation Speed"},
                {"label": "Recommended Evacuation Buffer", "value": f"{evac_count:,}", "flag": "danger" if evac_count > 50000 else "normal", "unit": "Coastal Population"}
            ],
            "status_headline": f"{category} · {sustained_wind_kmh} km/h Core",
            "severity_tag": severity,
            "ai_inference": f"With barometric pressure of {pressure_hpa} hPa at {dist_km} km offshore, cyclonic vortex generates a dangerous +{surge_m}m storm surge with {sustained_wind_kmh} km/h winds. " +
                           ("Full coastal shelter lockdown and marine recall is mandatory." if sustained_wind_kmh >= 90 else "Active sea swell alert in force; keep maritime fleets in harbor.")
        }

    elif classified_class == "RIVERINE_FLOOD":
        # param1: Upstream discharge (cusecs), param2: Embankment Freeboard (m)
        discharge = param1
        freeboard = param2

        stage_above_danger = max(0.1, round((discharge / 22000.0) * 1.1, 2))
        inundated_sqkm = int((discharge / 1000.0) * 8.5)
        boat_units = int(max(4, min(120, (discharge / 1000.0) * 1.8)))
        time_to_crest_h = max(1.5, round(36.0 / max(1.0, discharge / 20000.0), 1))

        if freeboard <= 0.0 or discharge > 55000:
            status = "CATASTROPHIC DYKE OVERTOPPING / BREACH"
            severity = "HIGH_DANGER"
        elif freeboard < 0.5:
            status = "CRITICAL HYDRAULIC PRESSURE (Imminent Seepage)"
            severity = "WARNING"
        else:
            status = "CONTROLLED BANKFULL DISCHARGE"
            severity = "SAFE"

        return {
            "simulation_type": "HYDROLOGICAL_BASIN_ROUTING",
            "param1_label": "Dam Inflow / Discharge",
            "param1_value": f"{discharge:,.0f} cusecs",
            "param2_label": "Embankment Freeboard Margin",
            "param2_value": f"{freeboard:.2f} m",
            "metrics": [
                {"label": "River Stage Delta", "value": f"+{stage_above_danger} m", "flag": "danger" if stage_above_danger > 1.2 else "normal", "unit": "Above Statutory Danger Level"},
                {"label": "Estimated Inundation Area", "value": f"{inundated_sqkm:,} km²", "flag": "danger" if inundated_sqkm > 300 else "normal", "unit": "Submerged Floodplain"},
                {"label": "Flood Crest Arrival Window", "value": f"{time_to_crest_h} hrs", "flag": "normal", "unit": "Downstream Reaches"},
                {"label": "Gemini Rescue Flotilla Required", "value": f"{boat_units} Boats", "flag": "danger" if boat_units > 40 else "normal", "unit": "Tactical Rescue Units"}
            ],
            "status_headline": status,
            "severity_tag": severity,
            "ai_inference": f"Discharge of {discharge:,.0f} cusecs with {freeboard:.2f}m freeboard puts riparian embankments under severe stress. " +
                           ("Overtopping and breach alert triggered. Immediate rescue boat flotilla dispatch required." if freeboard <= 0.2 else "Hydrological flood wave progressing within safe engineered channel capacity.")
        }

    elif classified_class == "FOREST_WILDFIRE":
        # param1: Wind velocity (km/h), param2: Fuel moisture (%)
        wind_kmh = param1
        fuel_pct = param2

        spread_rate_kmh = max(0.5, round((wind_kmh / 12.0) * ((25.0 - min(25.0, fuel_pct)) / 8.0), 1))
        spotting_dist_km = max(0.1, round((wind_kmh / 25.0) * 0.9, 1))
        firebreak_width_m = int(max(6, min(40, spread_rate_kmh * 4.2)))
        containment_hours = int(max(4, min(96, (spread_rate_kmh * 14) / 2.0)))

        if spread_rate_kmh > 4.0 or fuel_pct < 6.0:
            status = "UNCONTROLLED CANOPY BLOWUP (Spotting Active)"
            severity = "HIGH_DANGER"
        elif spread_rate_kmh > 1.5:
            status = "ACTIVE SURFACE FIRE SPREAD"
            severity = "WARNING"
        else:
            status = "MODERATE SMOLDERING CONTAINMENT"
            severity = "SAFE"

        return {
            "simulation_type": "FIRE_PROPAGATION_DYNAMICS",
            "param1_label": "Ambient Wind Velocity",
            "param1_value": f"{wind_kmh} km/h",
            "param2_label": "Forest Fuel Moisture",
            "param2_value": f"{fuel_pct}%",
            "metrics": [
                {"label": "Rate of Fire Front Spread", "value": f"{spread_rate_kmh} km/h", "flag": "danger" if spread_rate_kmh > 3.0 else "normal", "unit": "Linear Advance Rate"},
                {"label": "Max Ember Spotting Distance", "value": f"{spotting_dist_km} km", "flag": "danger" if spotting_dist_km > 0.8 else "normal", "unit": "Airborne Firebrands"},
                {"label": "Mandatory Firebreak Width", "value": f"{firebreak_width_m} m", "flag": "normal", "unit": "Mineral Earth Clearance"},
                {"label": "Estimated Containment Duration", "value": f"{containment_hours} hrs", "flag": "normal", "unit": "With Full Aerial Support"}
            ],
            "status_headline": status,
            "severity_tag": severity,
            "ai_inference": f"Under {wind_kmh} km/h wind and {fuel_pct}% fuel moisture, wildfire propagates at {spread_rate_kmh} km/h with embers traveling up to {spotting_dist_km} km ahead of front."
        }

    elif classified_class == "VOLCANIC_ANOMALY":
        # param1: Thermal power (MW), param2: Plume Height (km)
        power_mw = param1
        plume_km = param2

        ash_dispersion_km = int(plume_km * 28)
        maritime_exclusion_nm = int(max(10, min(50, (power_mw / 10.0) * 1.8)))
        so2_conc_ppm = round((power_mw / 25.0) * 1.4, 1)

        return {
            "simulation_type": "VOLCANIC_PLUME_AND_THERMAL_DISPERSION",
            "param1_label": "Thermal Radiative Power",
            "param1_value": f"{power_mw} MW",
            "param2_label": "Ash Plume Height",
            "param2_value": f"{plume_km} km",
            "metrics": [
                {"label": "Ash Cloud Dispersion Radius", "value": f"{ash_dispersion_km} km", "flag": "danger" if ash_dispersion_km > 150 else "normal", "unit": "Aviation Hazard Envelope"},
                {"label": "Maritime Exclusion Cordon", "value": f"{maritime_exclusion_nm} NM", "flag": "normal", "unit": "Naval Interdiction Radius"},
                {"label": "Peak Caldera SO₂ Density", "value": f"{so2_conc_ppm} ppm", "flag": "danger" if so2_conc_ppm > 8.0 else "normal", "unit": "Toxic Gas Concentration"},
                {"label": "NOTAM Flight Level Closure", "value": f"FL {int(plume_km * 33)}", "flag": "normal", "unit": "Civil Aviation Route Restriction"}
            ],
            "status_headline": "ACTIVE MAGMATIC DEGASSING & PYROCLASTIC VENTING",
            "severity_tag": "WARNING" if power_mw > 100 else "SAFE",
            "ai_inference": f"Caldera thermal bloom of {power_mw} MW ejecting plume to {plume_km} km generates a {ash_dispersion_km} km ash cloud. Aviation NOTAM and maritime cordon of {maritime_exclusion_nm} nautical miles enforced."
        }

    else: # SEISMIC_EARTHQUAKE
        # param1: Magnitude (Mw), param2: Focal depth (km)
        mag_mw = param1
        depth_km = param2

        pga_g = round(max(0.04, min(1.2, ((10**(0.5 * mag_mw)) / (depth_km**0.8)) * 0.05)), 2)
        mmi = min(10.0, round(mag_mw * 1.1 + max(0.0, 15 - depth_km) * 0.08, 1))
        collapse_prob_pct = int(max(2, min(95, (pga_g / 0.45) * 55)))
        usar_teams_needed = int(max(2, min(45, (collapse_prob_pct / 5.0))))

        return {
            "simulation_type": "SEISMIC_ATTENUATION_AND_STRUCTURAL_FRAGILITY",
            "param1_label": "Moment Magnitude (Mw)",
            "param1_value": f"Mw {mag_mw:.1f}",
            "param2_label": "Hypocentral Focal Depth",
            "param2_value": f"{depth_km:.1f} km",
            "metrics": [
                {"label": "Peak Ground Acceleration (PGA)", "value": f"{pga_g}g", "flag": "danger" if pga_g > 0.25 else "normal", "unit": "Spectral Ground Motion"},
                {"label": "Modified Mercalli Intensity", "value": f"MMI {mmi}", "flag": "danger" if mmi > 7.0 else "normal", "unit": "Subjective Shake Scale"},
                {"label": "Unreinforced Masonry Collapse Risk", "value": f"{collapse_prob_pct}%", "flag": "danger" if collapse_prob_pct > 30 else "normal", "unit": "Structural Vulnerability"},
                {"label": "NDRF USAR Squads Required", "value": f"{usar_teams_needed} Squads", "flag": "danger" if usar_teams_needed > 15 else "normal", "unit": "Heavy Extrication Teams"}
            ],
            "status_headline": f"Mw {mag_mw:.1f} CRUSTAL RUPTURE @ {depth_km:.1f} KM DEPTH",
            "severity_tag": "HIGH_DANGER" if pga_g > 0.25 else "WARNING",
            "ai_inference": f"Rupture at {depth_km} km depth produces estimated {pga_g}g peak acceleration, creating high collapse risk for unreinforced masonry buildings. Golden Hour search teams mobilized."
        }
