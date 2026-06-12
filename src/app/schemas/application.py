from typing import Optional

from pydantic import BaseModel, ConfigDict
from datetime import date
from app.models.application import ApplicationStatus

class ApplicationCreate(BaseModel):
    job_id: int
    status: ApplicationStatus
    date_applied: date
    cv_url: Optional[str] = None
    cover_letter_url: Optional[str] = None


class ApplicationUpdate(BaseModel):
    job_id: Optional[int] = None
    status: Optional[ApplicationStatus] = None
    date_applied: Optional[date] = None
    cv_url: Optional[str] = None
    cover_letter_url: Optional[str] = None

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_id: int
    status: ApplicationStatus
    date_applied: date
    cv_url: Optional[str] = None
    cover_letter_url: Optional[str] = None
