from typing import Optional

from pydantic import BaseModel, ConfigDict

class JobCreate(BaseModel):
    role: str
    type: str
    qualification: str
    tech_requirements: str
    soft_skills: str
    company_id: int

class JobUpdate(BaseModel):
    role: Optional[str] = None
    type: Optional[str] = None
    qualification: Optional[str] = None
    tech_requirements: Optional[str] = None
    soft_skills: Optional[str] = None
    company_id: Optional[int] = None

class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    type: str
    qualification: str
    tech_requirements: str
    soft_skills: str
    company_id: int