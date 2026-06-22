from typing import Optional

from pydantic import BaseModel, ConfigDict
from app.models.job import JobQualification, JobType

class JobCreate(BaseModel):
    role: str
    type: JobType
    qualification: JobQualification
    tech_requirements: str
    soft_skills: str
    company_id: int

class JobUpdate(BaseModel):
    role: Optional[str] = None
    type: Optional[JobType] = None
    qualification: Optional[JobQualification] = None
    tech_requirements: Optional[str] = None
    soft_skills: Optional[str] = None
    company_id: Optional[int] = None

class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    type: JobType
    qualification: JobQualification
    tech_requirements: str
    soft_skills: str
    company_id: int