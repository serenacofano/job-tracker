from pydantic import BaseModel, ConfigDict
from app.models.skill import Category

class SkillCreate(BaseModel):
    name: str
    category: Category
    
class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    category: Category