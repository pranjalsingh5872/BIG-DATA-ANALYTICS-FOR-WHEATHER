from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.event import WeatherEvent, AuditLog
from backend.app.services.pdf_generator import generate_incident_brief_pdf

router = APIRouter()

@router.get("/pdf/{event_id}")
def download_incident_brief_pdf(event_id: str, db: Session = Depends(get_db)):
    event = db.query(WeatherEvent).filter(WeatherEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Weather event not found")

    audits = db.query(AuditLog).filter(AuditLog.event_id == event_id).order_by(AuditLog.timestamp).all()
    pdf_bytes = generate_incident_brief_pdf(event, audits)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Incident_Brief_{event.id}.pdf"
        }
    )
