import hashlib
from typing import List, Optional, Tuple, Any
from backend.app.services.ai_verifier import haversine_distance_km

def get_simhash_features(text: str) -> int:
    """Generate a 64-bit SimHash representation for text."""
    words = text.lower().split()
    v = [0] * 64
    for word in words:
        h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
        for i in range(64):
            bit = (h >> i) & 1
            if bit == 1:
                v[i] += 1
            else:
                v[i] -= 1
    fingerprint = 0
    for i in range(64):
        if v[i] >= 0:
            fingerprint |= (1 << i)
    return fingerprint

def hamming_distance(hash1: int, hash2: int) -> int:
    """Compute Hamming distance between two 64-bit integers."""
    x = hash1 ^ hash2
    return bin(x).count('1')

def check_duplicate(
    new_title: str,
    new_desc: str,
    new_lat: float,
    new_lng: float,
    existing_events: List[Any],
    max_dist_km: float = 15.0,
    max_hamming: int = 5
) -> Tuple[bool, Optional[str]]:
    """
    Checks if an incoming weather report is a duplicate or near-duplicate
    of existing events based on spatial proximity (<15km) and semantic similarity.
    """
    new_hash = get_simhash_features(f"{new_title} {new_desc}")
    for ev in existing_events:
        dist = haversine_distance_km(new_lat, new_lng, ev.latitude, ev.longitude)
        if dist <= max_dist_km:
            ev_hash = get_simhash_features(f"{ev.title} {ev.description}")
            if hamming_distance(new_hash, ev_hash) <= max_hamming:
                return True, ev.id
    return False, None
