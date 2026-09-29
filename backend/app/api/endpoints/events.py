from typing import Optional, List
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from backend.app.core.database import get_db
from backend.app.models.event import WeatherEvent, AuditLog
from backend.app.schemas.event_schema import WeatherEventResponse
from backend.app.services.h3_spatial import aggregate_events_by_h3, get_h3_boundary_coords
import json

router = APIRouter()
IST = timezone(timedelta(hours=5, minutes=30))

@router.get("/", response_model=List[WeatherEventResponse])
def get_events(
    category: Optional[str] = None,
    severity: Optional[str] = None,
    state: Optional[str] = None,
    city: Optional[str] = None,
    verification_status: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    cutoff_24h = datetime.now(IST) - timedelta(hours=24)
    # Purge ended / dismissed / low-impact events older than 24 hours to preserve strict real-time window
    try:
        db.query(WeatherEvent).filter(
            WeatherEvent.observed_at < cutoff_24h,
            or_(
                WeatherEvent.operator_decision.in_(["REJECTED", "DISMISSED", "RESOLVED"]),
                WeatherEvent.verification_status == "REJECTED",
                WeatherEvent.severity.in_(["Low", "Moderate"])
            )
        ).delete(synchronize_session=False)
        db.commit()
    except Exception:
        db.rollback()

    query = db.query(WeatherEvent)

    # Restrict to active 24-hour operational window unless explicit historical filter requested
    if not start_date:
        query = query.filter(WeatherEvent.observed_at >= cutoff_24h)
    else:
        try:
            dt_start = datetime.fromisoformat(start_date)
            query = query.filter(WeatherEvent.observed_at >= dt_start)
        except Exception:
            pass

    if end_date:
        try:
            dt_end = datetime.fromisoformat(end_date)
            query = query.filter(WeatherEvent.observed_at <= dt_end)
        except Exception:
            pass

    if category and category != "All":
        query = query.filter(WeatherEvent.category == category)
    if severity and severity != "All":
        query = query.filter(WeatherEvent.severity == severity)
    if state and state != "All":
        query = query.filter(WeatherEvent.state == state)
    if city and city != "All":
        query = query.filter(WeatherEvent.city == city)
    if verification_status and verification_status != "All":
        query = query.filter(WeatherEvent.verification_status == verification_status)
    if source and source != "All":
        query = query.filter(WeatherEvent.source == source)
    if search:
        s = f"%{search}%"
        query = query.filter(or_(
            WeatherEvent.title.ilike(s),
            WeatherEvent.description.ilike(s),
            WeatherEvent.city.ilike(s),
            WeatherEvent.state.ilike(s)
        ))

    return query.order_by(desc(WeatherEvent.observed_at)).offset(offset).limit(limit).all()

@router.get("/clusters/h3")
def get_h3_clusters(db: Session = Depends(get_db)):
    """Return aggregated H3 hexagonal polygons for tactical map visualization."""
    events = db.query(WeatherEvent).all()
    clusters = aggregate_events_by_h3(events)
    return {
        "total_clusters": len(clusters),
        "clusters": clusters
    }

import urllib.request

INDIAN_CITIES_REF = [
    {"city": "New Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090},
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567},
    {"city": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lon": 79.0882},
    {"city": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946},
    {"city": "Mysuru", "state": "Karnataka", "lat": 12.2958, "lon": 76.6394},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707},
    {"city": "Coimbatore", "state": "Tamil Nadu", "lat": 11.0168, "lon": 76.9558},
    {"city": "Madurai", "state": "Tamil Nadu", "lat": 9.9252, "lon": 78.1198},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639},
    {"city": "Siliguri", "state": "West Bengal", "lat": 26.7271, "lon": 88.3953},
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867},
    {"city": "Warangal", "state": "Telangana", "lat": 17.9689, "lon": 79.5941},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714},
    {"city": "Surat", "state": "Gujarat", "lat": 21.1702, "lon": 72.8311},
    {"city": "Vadodara", "state": "Gujarat", "lat": 22.3072, "lon": 73.1812},
    {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873},
    {"city": "Jodhpur", "state": "Rajasthan", "lat": 26.2389, "lon": 73.0243},
    {"city": "Udaipur", "state": "Rajasthan", "lat": 24.5854, "lon": 73.7125},
    {"city": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lon": 80.9462},
    {"city": "Kanpur", "state": "Uttar Pradesh", "lat": 26.4499, "lon": 80.3319},
    {"city": "Varanasi", "state": "Uttar Pradesh", "lat": 25.3176, "lon": 82.9739},
    {"city": "Agra", "state": "Uttar Pradesh", "lat": 27.1767, "lon": 78.0081},
    {"city": "Prayagraj", "state": "Uttar Pradesh", "lat": 25.4358, "lon": 81.8463},
    {"city": "Patna", "state": "Bihar", "lat": 25.5941, "lon": 85.1376},
    {"city": "Gaya", "state": "Bihar", "lat": 24.7914, "lon": 85.0002},
    {"city": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lon": 77.4126},
    {"city": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lon": 75.8577},
    {"city": "Jabalpur", "state": "Madhya Pradesh", "lat": 23.1815, "lon": 79.9864},
    {"city": "Bhubaneswar", "state": "Odisha", "lat": 20.2961, "lon": 85.8245},
    {"city": "Cuttack", "state": "Odisha", "lat": 20.4625, "lon": 85.8828},
    {"city": "Puri", "state": "Odisha", "lat": 19.8135, "lon": 85.8312},
    {"city": "Guwahati", "state": "Assam", "lat": 26.1445, "lon": 91.7362},
    {"city": "Dibrugarh", "state": "Assam", "lat": 27.4728, "lon": 94.9120},
    {"city": "Chandigarh", "state": "Punjab", "lat": 30.7333, "lon": 76.7794},
    {"city": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lon": 75.8573},
    {"city": "Amritsar", "state": "Punjab", "lat": 31.6340, "lon": 74.8723},
    {"city": "Dehradun", "state": "Uttarakhand", "lat": 30.3165, "lon": 78.0322},
    {"city": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lon": 77.1734},
    {"city": "Srinagar", "state": "Jammu & Kashmir", "lat": 34.0837, "lon": 74.7973},
    {"city": "Jammu", "state": "Jammu & Kashmir", "lat": 32.7266, "lon": 74.8570},
    {"city": "Ranchi", "state": "Jharkhand", "lat": 23.3441, "lon": 85.3096},
    {"city": "Jamshedpur", "state": "Jharkhand", "lat": 22.8046, "lon": 86.2029},
    {"city": "Raipur", "state": "Chhattisgarh", "lat": 21.2514, "lon": 81.6296},
    {"city": "Thiruvananthapuram", "state": "Kerala", "lat": 8.5241, "lon": 76.9366},
    {"city": "Kochi", "state": "Kerala", "lat": 9.9312, "lon": 76.2673},
    {"city": "Kozhikode", "state": "Kerala", "lat": 11.2588, "lon": 75.7804},
    {"city": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lon": 83.2185},
    {"city": "Vijayawada", "state": "Andhra Pradesh", "lat": 16.5062, "lon": 80.6480},
    {"city": "Panaji", "state": "Goa", "lat": 15.4909, "lon": 73.8278},
    {"city": "Shillong", "state": "Meghalaya", "lat": 25.5788, "lon": 91.8933},
    {"city": "Imphal", "state": "Manipur", "lat": 24.8170, "lon": 93.9368},
    {"city": "Agartala", "state": "Tripura", "lat": 23.8315, "lon": 91.2868},
    {"city": "Aizawl", "state": "Mizoram", "lat": 23.7271, "lon": 92.7176},
    {"city": "Kohima", "state": "Nagaland", "lat": 25.6751, "lon": 94.1086},
    {"city": "Gangtok", "state": "Sikkim", "lat": 27.3389, "lon": 88.6065},
    {"city": "Itanagar", "state": "Arunachal Pradesh", "lat": 27.0844, "lon": 93.6053},
    {"city": "Port Blair", "state": "Andaman & Nicobar Islands", "lat": 11.6234, "lon": 92.7265}
]

@router.get("/geo/reverse")
def reverse_geocode(lat: float, lon: float):
    """Reverse geocode latitude and longitude to City and State with multiple fallbacks."""
    # 1. BigDataCloud API
    try:
        url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en"
        req = urllib.request.Request(url, headers={"User-Agent": "IMD-Disaster-Ops/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            city = data.get("city") or data.get("locality") or data.get("principalSubdivision")
            state = data.get("principalSubdivision")
            country = data.get("countryName", "India")
            if city and state:
                return {"city": city, "state": state, "country": country, "latitude": lat, "longitude": lon}
    except Exception:
        pass

    # 2. Nominatim OpenStreetMap
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=12&addressdetails=1"
        req = urllib.request.Request(url, headers={"User-Agent": "IMD-Disaster-Platform/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            addr = data.get("address", {})
            city = addr.get("city") or addr.get("town") or addr.get("state_district") or addr.get("county") or addr.get("village")
            state = addr.get("state")
            country = addr.get("country", "India")
            if city and state:
                return {"city": city, "state": state, "country": country, "latitude": lat, "longitude": lon}
    except Exception:
        pass

    # 3. High-precision nearest Indian spatial reference centroid fallback
    nearest = min(INDIAN_CITIES_REF, key=lambda c: (c["lat"] - lat) ** 2 + (c["lon"] - lon) ** 2)
    return {
        "city": nearest["city"],
        "state": nearest["state"],
        "country": "India",
        "latitude": lat,
        "longitude": lon,
        "fallback": True
    }

@router.get("/geo/detect-ip")
def detect_location_by_ip():
    """Auto-detect client approximate coordinates, city, and state via network IP when GPS is unavailable."""
    # 1. ipwho.is
    try:
        req = urllib.request.Request("https://ipwho.is/", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            if data.get("success", False):
                return {
                    "latitude": data.get("latitude", 28.6139),
                    "longitude": data.get("longitude", 77.2090),
                    "city": data.get("city", "New Delhi"),
                    "state": data.get("region", "Delhi"),
                    "country": data.get("country", "India")
                }
    except Exception:
        pass

    # 2. ip-api.com
    try:
        req = urllib.request.Request("http://ip-api.com/json/", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode())
            if data.get("status") == "success":
                return {
                    "latitude": data.get("lat", 28.6139),
                    "longitude": data.get("lon", 77.2090),
                    "city": data.get("city", "New Delhi"),
                    "state": data.get("regionName", "Delhi"),
                    "country": data.get("country", "India")
                }
    except Exception:
        pass

    return {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "city": "New Delhi",
        "state": "Delhi",
        "country": "India",
        "default": True
    }

@router.get("/{event_id}")
def get_event_detail(event_id: str, db: Session = Depends(get_db)):
    event = db.query(WeatherEvent).filter(WeatherEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Weather event not found")
    
    audits = db.query(AuditLog).filter(AuditLog.event_id == event_id).order_by(AuditLog.timestamp).all()
    boundary = get_h3_boundary_coords(event.h3_index)

    return {
        "event": event,
        "boundary_coords": boundary,
        "audits": audits,
        "explainability": json.loads(event.vision_check_result) if event.vision_check_result else None
    }
