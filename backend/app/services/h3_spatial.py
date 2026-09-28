import h3
from typing import List, Dict, Any

DEFAULT_RES = 7

def lat_lng_to_h3(lat: float, lng: float, resolution: int = DEFAULT_RES) -> str:
    """Convert coordinates to H3 hex index."""
    try:
        # In H3 v4+, h3.latlng_to_cell is used, in v3 h3.geo_to_h3
        if hasattr(h3, "latlng_to_cell"):
            return h3.latlng_to_cell(lat, lng, resolution)
        elif hasattr(h3, "geo_to_h3"):
            return h3.geo_to_h3(lat, lng, resolution)
        return f"h3_{lat:.2f}_{lng:.2f}"
    except Exception:
        return f"h3_{lat:.2f}_{lng:.2f}"

def get_h3_boundary_coords(h3_index: str) -> List[List[float]]:
    """Return polygon boundary coordinates [ [lat, lng], ... ] for Leaflet."""
    try:
        if hasattr(h3, "cell_to_boundary"):
            coords = h3.cell_to_boundary(h3_index)
            return [[float(lat), float(lng)] for lat, lng in coords]
        elif hasattr(h3, "h3_to_geo_boundary"):
            coords = h3.h3_to_geo_boundary(h3_index)
            return [[float(lat), float(lng)] for lat, lng in coords]
        return []
    except Exception:
        return []

def aggregate_events_by_h3(events: List[Any]) -> List[Dict[str, Any]]:
    """Group events into spatial clusters for national heatmaps."""
    clusters: Dict[str, Dict[str, Any]] = {}
    for ev in events:
        h3_idx = ev.h3_index or lat_lng_to_h3(ev.latitude, ev.longitude)
        if h3_idx not in clusters:
            boundary = get_h3_boundary_coords(h3_idx)
            clusters[h3_idx] = {
                "h3_index": h3_idx,
                "count": 0,
                "critical_count": 0,
                "categories": {},
                "avg_trust": 0.0,
                "total_trust": 0.0,
                "centroid": [ev.latitude, ev.longitude],
                "boundary": boundary,
                "state": ev.state,
                "city": ev.city
            }
        c = clusters[h3_idx]
        c["count"] += 1
        if ev.severity == "Critical":
            c["critical_count"] += 1
        c["categories"][ev.category] = c["categories"].get(ev.category, 0) + 1
        c["total_trust"] += ev.trust_score

    for c in clusters.values():
        c["avg_trust"] = round(c["total_trust"] / c["count"], 1) if c["count"] > 0 else 0
        del c["total_trust"]
    return list(clusters.values())
