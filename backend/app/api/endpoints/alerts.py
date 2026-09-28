from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
import json
from backend.app.models.event import WeatherEvent, AuditLog, AlertBroadcast
from backend.app.schemas.event_schema import CapAlertBroadcastRequest

router = APIRouter()

@router.post("/broadcast-cap")
def broadcast_cap_alert(payload: CapAlertBroadcastRequest, db: Session = Depends(get_db)):
    event = db.query(WeatherEvent).filter(WeatherEvent.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Weather event not found")

    alert_id = f"CAP-IN-IMD-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    broadcast_record = {
        "identifier": alert_id,
        "sender": "HQ-IMD-NATIONAL-ALERT-DESK",
        "sent_utc": datetime.now(timezone.utc).isoformat(),
        "status": "Actual",
        "msg_type": "Alert",
        "scope": "Public",
        "event_id": event.id,
        "headline": payload.headline,
        "urgency": payload.urgency,
        "severity": payload.severity,
        "certainty": payload.certainty,
        "areas": payload.areas,
        "instructions": payload.instructions,
        "target_channels": payload.target_channels,
        "dispatched_by": "Senior Disaster Operations Chief"
    }
    db_alert = AlertBroadcast(
        id=alert_id,
        event_id=event.id,
        headline=payload.headline,
        urgency=payload.urgency,
        severity=payload.severity,
        certainty=payload.certainty,
        areas=json.dumps(payload.areas),
        instructions=payload.instructions,
        target_channels=json.dumps(payload.target_channels),
        dispatched_by="Senior Disaster Operations Chief",
        sent_at=datetime.now(timezone.utc)
    )
    db.add(db_alert)

    # Log to event audit
    audit = AuditLog(
        event_id=event.id,
        operator_name="CAP Alert Engine",
        action="CAP_ALERT_BROADCAST",
        previous_status=event.verification_status,
        new_status=event.verification_status,
        reason=f"Emergency CAP alert broadcasted across {', '.join(payload.target_channels)} for areas: {', '.join(payload.areas)}",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit)
    db.commit()

    return {
        "status": "DISPATCHED",
        "alert": broadcast_record
    }

@router.get("/history")
def get_alert_history(db: Session = Depends(get_db)):
    alerts = db.query(AlertBroadcast).order_by(AlertBroadcast.sent_at.desc()).all()
    history = []
    for alert in alerts:
        history.append({
            "identifier": alert.id,
            "sender": "HQ-IMD-NATIONAL-ALERT-DESK",
            "sent_utc": alert.sent_at.isoformat(),
            "status": "Actual",
            "msg_type": "Alert",
            "scope": "Public",
            "event_id": alert.event_id,
            "headline": alert.headline,
            "urgency": alert.urgency,
            "severity": alert.severity,
            "certainty": alert.certainty,
            "areas": json.loads(alert.areas),
            "instructions": alert.instructions,
            "target_channels": json.loads(alert.target_channels),
            "dispatched_by": alert.dispatched_by
        })
    return history
