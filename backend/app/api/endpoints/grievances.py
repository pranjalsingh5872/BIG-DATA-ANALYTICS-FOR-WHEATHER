from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.event import Grievance, WeatherEvent, AuditLog
from backend.app.schemas.event_schema import GrievanceCreate, GrievanceResponse

router = APIRouter()

class GrievanceResolveRequest(BaseModel):
    resolution_note: str
    status: str = "RESOLVED"  # RESOLVED or DISMISSED
    operator_name: str = "Grievance Officer"

@router.post("/", response_model=GrievanceResponse)
def submit_grievance(payload: GrievanceCreate, db: Session = Depends(get_db)):
    event = db.query(WeatherEvent).filter(WeatherEvent.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Referenced weather event not found")

    grv = Grievance(
        event_id=payload.event_id,
        complainant_name=payload.complainant_name,
        contact_email=payload.contact_email,
        grievance_type=payload.grievance_type,
        description=payload.description,
        status="OPEN",
        created_at=datetime.now(timezone.utc)
    )
    db.add(grv)
    db.commit()
    db.refresh(grv)
    return grv

@router.get("/", response_model=List[GrievanceResponse])
def get_grievances(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Grievance)
    if status and status != "All":
        query = query.filter(Grievance.status == status)
    return query.order_by(desc(Grievance.created_at)).all()

@router.put("/{grievance_id}/resolve")
def resolve_grievance(grievance_id: str, payload: GrievanceResolveRequest, db: Session = Depends(get_db)):
    grv = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grv:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")

    grv.status = payload.status
    grv.resolution_note = payload.resolution_note
    grv.resolved_at = datetime.now(timezone.utc)

    # Log to audit trail
    audit = AuditLog(
        event_id=grv.event_id,
        operator_name=payload.operator_name,
        action="GRIEVANCE_RESOLVED",
        previous_status=None,
        new_status=payload.status,
        reason=f"Grievance [{grv.grievance_type}] resolved: {payload.resolution_note}",
        timestamp=datetime.now(timezone.utc)
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "grievance_id": grv.id, "resolution": payload.resolution_note}
