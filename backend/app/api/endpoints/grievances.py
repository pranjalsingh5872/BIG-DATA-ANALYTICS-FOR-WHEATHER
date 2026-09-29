from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.models.event import Grievance, WeatherEvent, AuditLog
from backend.app.schemas.event_schema import GrievanceCreate, GrievanceResponse, GrievanceAppealRequest
from backend.app.services.grievance_verifier import verify_grievance_authenticity

IST = timezone(timedelta(hours=5, minutes=30))

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

    # Mandatory Photo Evidence Verification
    if not payload.evidence_photo_url or not payload.evidence_photo_url.strip():
        raise HTTPException(
            status_code=400,
            detail="Mandatory ground photograph evidence is required to submit a grievance or dispute."
        )

    # Execute 55-45 Citizen-to-Satellite Authenticity Engine
    ver_res = verify_grievance_authenticity(
        event_lat=event.latitude,
        event_lng=event.longitude,
        event_category=event.category,
        grievance_type=payload.grievance_type,
        description=payload.description,
        complainant_email=payload.contact_email,
        evidence_photo_url=payload.evidence_photo_url,
        complainant_lat=payload.complainant_lat,
        complainant_lng=payload.complainant_lng
    )

    grv = Grievance(
        event_id=payload.event_id,
        complainant_name=payload.complainant_name,
        contact_email=payload.contact_email,
        grievance_type=payload.grievance_type,
        description=payload.description,
        evidence_photo_url=payload.evidence_photo_url,
        authenticity_score=ver_res["authenticity_score"],
        is_fake=ver_res["is_fake"],
        status=ver_res["status"],
        flagged_reason=ver_res["flagged_reason"],
        verification_breakdown=ver_res["verification_breakdown"],
        satellite_concurrence=ver_res["satellite_concurrence"],
        vision_concurrence=ver_res["vision_concurrence"],
        created_at=datetime.now(IST)
    )
    db.add(grv)
    db.commit()
    db.refresh(grv)

    # Audit trail logging
    audit = AuditLog(
        event_id=grv.event_id,
        operator_name="55-45 AI Fraud Engine",
        action="GRIEVANCE_EVALUATED",
        previous_status=None,
        new_status=grv.status,
        reason=(
            f"Authenticity score: {grv.authenticity_score}% (Citizen: {ver_res['vision_concurrence']}%, "
            f"Satellite: {ver_res['satellite_concurrence']}%). Status: {grv.status}."
        ),
        timestamp=datetime.now(IST)
    )
    db.add(audit)
    db.commit()

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

    # Anti-Fraud Verification Lock: If flagged fake (< 40%) and not formally appealed, lock from operator review
    if grv.status == "FLAGGED_FAKE" and not grv.is_appealed:
        raise HTTPException(
            status_code=403,
            detail=(
                f"LOCKED: This dispute is flagged as FAKE (Authenticity: {grv.authenticity_score}% < 40%). "
                "It is locked from operator verification until the complainant files a formal appeal."
            )
        )

    grv.status = payload.status
    grv.resolution_note = payload.resolution_note
    grv.resolved_at = datetime.now(IST)

    # Log to audit trail
    audit = AuditLog(
        event_id=grv.event_id,
        operator_name=payload.operator_name,
        action="GRIEVANCE_RESOLVED",
        previous_status=None,
        new_status=payload.status,
        reason=f"Grievance [{grv.grievance_type}] resolved: {payload.resolution_note}",
        timestamp=datetime.now(IST)
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "grievance_id": grv.id, "resolution": payload.resolution_note}

@router.post("/{grievance_id}/appeal", response_model=GrievanceResponse)
def appeal_grievance(grievance_id: str, payload: GrievanceAppealRequest, db: Session = Depends(get_db)):
    grv = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grv:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")

    if not payload.appeal_note or not payload.appeal_note.strip():
        raise HTTPException(status_code=400, detail="Formal appeal justification statement is required.")

    grv.is_appealed = True
    grv.appeal_note = payload.appeal_note
    grv.status = "APPEALED_PENDING_REVIEW"

    audit = AuditLog(
        event_id=grv.event_id,
        operator_name=grv.complainant_name,
        action="GRIEVANCE_APPEALED",
        previous_status="FLAGGED_FAKE",
        new_status="APPEALED_PENDING_REVIEW",
        reason=f"Complainant filed appeal on flagged fake dispute: {payload.appeal_note}",
        timestamp=datetime.now(IST)
    )
    db.add(audit)
    db.commit()
    db.refresh(grv)
    return grv
