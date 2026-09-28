from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WeatherEvent(Base):
    __tablename__ = "weather_events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(64), nullable=False, index=True)  # Rainfall, Flooding, Thunderstorm, Heatwave, Fog, etc.
    severity = Column(String(32), nullable=False, default="Moderate", index=True)  # Low, Moderate, High, Critical
    
    # Geospatial & H3
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    h3_index = Column(String(32), nullable=False, index=True)
    city = Column(String(128), nullable=False, index=True)
    state = Column(String(128), nullable=False, index=True)
    
    # Provenance & Source
    source = Column(String(64), nullable=False, default="Citizen Report", index=True)  # Twitter, Citizen Report, IMD AWS, Open-Meteo
    source_author = Column(String(128), nullable=True)
    source_credibility = Column(Float, default=0.5)  # 0.0 to 1.0
    external_reference = Column(String(512), nullable=True)
    
    # Media & Multimodal Authenticity
    media_url = Column(Text, nullable=True)
    media_type = Column(String(32), default="none")  # image, video, none
    is_media_authentic = Column(Boolean, default=True)
    vision_check_result = Column(Text, nullable=True)  # JSON explainability
    
    # AI Truth & Corroboration
    trust_score = Column(Float, default=50.0)  # 0 to 100%
    nlp_confidence = Column(Float, default=0.8)
    radar_corroborated = Column(Boolean, default=False)
    radar_station_name = Column(String(255), nullable=True)
    radar_recorded_value = Column(Float, nullable=True)  # mm rain or km/h wind
    
    # Workflow & Moderation
    verification_status = Column(String(32), default="PENDING_REVIEW", index=True)  # VERIFIED, PENDING_REVIEW, REJECTED, QUARANTINED
    operator_decision = Column(String(32), default="UNREVIEWED")  # UNREVIEWED, VERIFIED, REJECTED, ESCALATED
    operator_notes = Column(Text, nullable=True)
    duplicate_of_id = Column(String(64), nullable=True)
    
    # Timestamps
    observed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    ingested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    audits = relationship("AuditLog", back_populates="event", cascade="all, delete-orphan")
    grievances = relationship("Grievance", back_populates="event", cascade="all, delete-orphan")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String(64), ForeignKey("weather_events.id"), nullable=False, index=True)
    operator_name = Column(String(128), default="Chief Operator")
    action = Column(String(64), nullable=False)  # VERIFIED, REJECTED, ESCALATED, DISPUTE_RESOLVED
    previous_status = Column(String(32), nullable=True)
    new_status = Column(String(32), nullable=False)
    reason = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    event = relationship("WeatherEvent", back_populates="audits")


class AlertBroadcast(Base):
    __tablename__ = "alert_broadcasts"

    id = Column(String(64), primary_key=True)
    event_id = Column(String(64), ForeignKey("weather_events.id"), nullable=False, index=True)
    headline = Column(String(512), nullable=False)
    urgency = Column(String(32), default="Immediate")
    severity = Column(String(32), default="Severe")
    certainty = Column(String(32), default="Observed")
    areas = Column(Text, nullable=False)  # JSON string
    instructions = Column(Text, nullable=False)
    target_channels = Column(Text, nullable=False)  # JSON string
    dispatched_by = Column(String(128), default="Senior Disaster Operations Chief")
    sent_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    event_id = Column(String(64), ForeignKey("weather_events.id"), nullable=False, index=True)
    complainant_name = Column(String(128), nullable=False)
    contact_email = Column(String(128), nullable=False)
    grievance_type = Column(String(64), nullable=False)  # False Alarm, Missed Disaster, Severity Mismatch, Fake Media
    description = Column(Text, nullable=False)
    status = Column(String(32), default="OPEN", index=True)  # OPEN, FLAGGED_FAKE, IN_REVIEW, RESOLVED, DISMISSED
    resolution_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    # 55-45 AI Verification & Fraud Detection Fields
    evidence_photo_url = Column(Text, nullable=True)
    authenticity_score = Column(Float, default=0.0)
    is_fake = Column(Boolean, default=False)
    flagged_reason = Column(Text, nullable=True)
    verification_breakdown = Column(Text, nullable=True)
    satellite_concurrence = Column(Float, default=0.0)
    vision_concurrence = Column(Float, default=0.0)
    appeal_note = Column(Text, nullable=True)
    is_appealed = Column(Boolean, default=False)

    event = relationship("WeatherEvent", back_populates="grievances")
