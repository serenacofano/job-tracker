from typing import Optional

from pydantic import BaseModel, ConfigDict
from app.models.job import JobQualification, JobType
from app.schemas.skill import SkillResponse

class JobCreate(BaseModel):
    role: str
    type: JobType
    qualification: JobQualification
    skill_ids: list[int]
    company_id: int

class JobUpdate(BaseModel):
    role: Optional[str] = None
    type: Optional[JobType] = None
    qualification: Optional[JobQualification] = None
    skill_ids: Optional[list[int]] = None
    company_id: Optional[int] = None

class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    type: JobType
    qualification: JobQualification
    skills: list[SkillResponse]
    company_id: int