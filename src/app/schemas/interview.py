from typing import Optional
from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models.interview import InterviewType, InterviewerRole, InterviewOutcome


class InterviewCreate(BaseModel):
    application_id: int
    type: InterviewType
    interviewer_role: InterviewerRole
    date: date
    questions: Optional[str] = None
    outcome: InterviewOutcome
    feeling: Optional[int] = Field(default=None, ge=1, le=5)


class InterviewUpdate(BaseModel):
    application_id: Optional[int] = None
    type: Optional[InterviewType] = None
    interviewer_role: Optional[InterviewerRole] = None
    date: Optional[date] = None
    questions: Optional[str] = None
    outcome: Optional[InterviewOutcome] = None
    feeling: Optional[int] = Field(default=None, ge=1, le=5)


class InterviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    type: InterviewType
    interviewer_role: InterviewerRole
    date: date
    questions: Optional[str] = None
    outcome: InterviewOutcome
    feeling: Optional[int] = None