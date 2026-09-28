from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class WeatherEventBase(BaseModel):
    title: str
    description: str
    category: str
    severity: str = "Moderate"
    latitude: float
    longitude: float
    city: str
    state: str
    source: str = "Citizen Report"
    source_author: Optional[str] = None
    media_url: Optional[str] = None
    media_type: str = "none"
    observed_at: Optional[datetime] = None

class WeatherEventCreate(WeatherEventBase):
    pass

class WeatherEventResponse(WeatherEventBase):
    id: str
    h3_index: str
    source_credibility: float
    external_reference: Optional[str] = None
    is_media_authentic: bool
    vision_check_result: Optional[str] = None
    trust_score: float
    nlp_confidence: float
    radar_corroborated: bool
    radar_station_name: Optional[str] = None
    radar_recorded_value: Optional[float] = None
    verification_status: str
    operator_decision: str
    operator_notes: Optional[str] = None
    duplicate_of_id: Optional[str] = None
    observed_at: datetime
    ingested_at: datetime

    class Config:
        from_attributes = True

class OperatorReviewRequest(BaseModel):
    decision: str = Field(..., description="VERIFIED, REJECTED, or ESCALATED")
    reason: str = Field(..., min_length=5, description="Reason for the decision")
    operator_name: str = "Lead Operator"
    notes: Optional[str] = None

class GrievanceCreate(BaseModel):
    event_id: str
    complainant_name: str
    contact_email: str
    grievance_type: str
    description: str

class GrievanceResponse(BaseModel):
    id: str
    event_id: str
    complainant_name: str
    contact_email: str
    grievance_type: str
    description: str
    status: str
    resolution_note: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CapAlertBroadcastRequest(BaseModel):
    event_id: str
    headline: str
    urgency: str = "Immediate"  # Immediate, Expected, Future
    severity: str = "Severe"    # Extreme, Severe, Moderate, Minor
    certainty: str = "Observed" # Observed, Likely, Possible
    areas: List[str]
    instructions: str
    target_channels: List[str] = ["SMS_CELL_BROADCAST", "CAP_RSS", "WHATSAPP_EMERGENCY"]
