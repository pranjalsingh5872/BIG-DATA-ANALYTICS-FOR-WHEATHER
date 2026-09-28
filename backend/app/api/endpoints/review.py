from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.event import WeatherEvent, AuditLog
from backend.app.schemas.event_schema import WeatherEventResponse, OperatorReviewRequest

router = APIRouter()

@router.get("/queue", response_model=List[WeatherEventResponse])
def get_review_queue(db: Session = Depends(get_db)):
    """Return reports requiring operator attention."""
    return db.query(WeatherEvent).filter(
        WeatherEvent.verification_status.in_(["PENDING_REVIEW", "QUARANTINED"]),
        WeatherEvent.operator_decision == "UNREVIEWED"
    ).order_by(desc(WeatherEvent.observed_at)).all()

@router.post("/seed-pending")
def seed_pending_review_events(db: Session = Depends(get_db)):
    """Inject fresh sample unreviewed citizen/social reports for operator verification testing."""
    import uuid
    from backend.app.services.h3_spatial import lat_lng_to_h3

    samples = [
        {
            "title": "Severe Flash Flooding & Submerged Tracks near Dadar",
            "description": "Heavy downpour exceeding 80mm in 2 hours. Rail tracks waterlogged up to 1.5 ft near Dadar central junction.",
            "category": "Flooding",
            "severity": "Critical",
            "latitude": 19.0178,
            "longitude": 72.8478,
            "city": "Mumbai",
            "state": "Maharashtra",
            "source": "Citizen Report",
            "source_author": "Rohan Deshmukh",
            "trust_score": 64.0,
            "radar_station_name": "Colaba Doppler Radar",
            "radar_recorded_value": 78.4,
            "radar_corroborated": True
        },
        {
            "title": "Gale-Force Thunderstorm Gusts & Uprooted Trees near Cuttack Ring Road",
            "description": "Severe squall with wind speeds crossing 75 km/h. Multiple fallen trees blocking traffic towards Link Road.",
            "category": "Thunderstorm",
            "severity": "High",
            "latitude": 20.4625,
            "longitude": 85.8828,
            "city": "Cuttack",
            "state": "Odisha",
            "source": "Citizen Report",
            "source_author": "Debabrata Mohanty",
            "trust_score": 58.0,
            "radar_station_name": "Paradip Doppler Radar",
            "radar_recorded_value": 68.0,
            "radar_corroborated": True
        },
        {
            "title": "Dense Winter Smog & Visibility Dropped Below 50m along Ring Road",
            "description": "Thick fog and PM2.5 particulate inversion causing near-zero visibility on AIIMS flyover and DND flyway.",
            "category": "Fog",
            "severity": "Moderate",
            "latitude": 28.5672,
            "longitude": 77.2100,
            "city": "New Delhi",
            "state": "Delhi",
            "source": "Twitter",
            "source_author": "@DelhiTrafficWatch",
            "trust_score": 52.0,
            "radar_station_name": "Safdarjung Met Obs",
            "radar_recorded_value": 45.0,
            "radar_corroborated": False
        },
        {
            "title": "Extreme Heatwave Anomaly & Power Grid Overload Alert",
            "description": "Ambient afternoon temperature reached 46.2°C with high wet-bulb index. Severe dehydration warnings active.",
            "category": "Heatwave",
            "severity": "Critical",
            "latitude": 26.9124,
            "longitude": 75.7873,
            "city": "Jaipur",
            "state": "Rajasthan",
            "source": "Citizen Report",
            "source_author": "Vikram Singh",
            "trust_score": 62.0,
            "radar_station_name": "Jaipur Met Radar",
            "radar_recorded_value": 45.8,
            "radar_corroborated": True
        }
    ]

    added = []
    for s in samples:
        evt_id = f"EVT-REV-{str(uuid.uuid4())[:6].upper()}"
        h3 = lat_lng_to_h3(s["latitude"], s["longitude"])
        evt = WeatherEvent(
            id=evt_id,
            title=s["title"],
            description=s["description"],
            category=s["category"],
            severity=s["severity"],
            latitude=s["latitude"],
            longitude=s["longitude"],
            h3_index=h3,
            city=s["city"],
            state=s["state"],
            source=s["source"],
            source_author=s["source_author"],
            source_credibility=0.6,
            media_type="none",
            is_media_authentic=True,
            trust_score=s["trust_score"],
            nlp_confidence=0.85,
            radar_corroborated=s["radar_corroborated"],
            radar_station_name=s["radar_station_name"],
            radar_recorded_value=s["radar_recorded_value"],
            verification_status="PENDING_REVIEW",
            operator_decision="UNREVIEWED",
            observed_at=datetime.now(timezone.utc),
            ingested_at=datetime.now(timezone.utc)
        )
        db.add(evt)
        added.append(evt_id)

    db.commit()
    return {"status": "success", "count": len(added), "event_ids": added}

@router.post("/{event_id}")
def apply_operator_decision(
    event_id: str,
    payload: OperatorReviewRequest,
    db: Session = Depends(get_db)
):
    event = db.query(WeatherEvent).filter(WeatherEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Weather event not found")

    decision_map = {
        "VERIFIED": "VERIFIED",
        "REJECTED": "REJECTED",
        "QUARANTINED": "QUARANTINED",
        "ESCALATED": "PENDING_REVIEW"
    }

    if payload.decision not in decision_map:
        raise HTTPException(status_code=400, detail="Decision must be VERIFIED, REJECTED, QUARANTINED, or ESCALATED")

    prev_status = event.verification_status
    new_status = decision_map[payload.decision]

    event.operator_decision = payload.decision
    event.verification_status = new_status
    event.operator_notes = f"{payload.reason}\nNotes: {payload.notes}" if payload.notes else payload.reason
    if payload.decision == "VERIFIED":
        event.trust_score = max(event.trust_score, 92.0)
    elif payload.decision == "REJECTED":
        event.trust_score = min(event.trust_score, 10.0)

    # Log immutable audit
    audit = AuditLog(
        event_id=event.id,
        operator_name=payload.operator_name,
        action=f"OPERATOR_{payload.decision}",
        previous_status=prev_status,
        new_status=new_status,
        reason=payload.reason,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit)
    db.commit()
    db.refresh(event)

    return {
        "status": "success",
        "event_id": event.id,
        "new_verification_status": new_status,
        "operator_decision": event.operator_decision,
        "reason": payload.reason
    }

