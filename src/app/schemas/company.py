from typing import Optional

from pydantic import BaseModel, ConfigDict

class CompanyCreate(BaseModel):
    name: str
    type: str
    size: str
    location: str
    website: Optional[str] = None
    notes: Optional[str] = None

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    notes: Optional[str] = None

class CompanyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: str
    size: str
    location: str
    website: Optional[str] = None
    notes: Optional[str] = None
