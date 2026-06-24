from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillResponse
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=list[SkillResponse])
def list_skills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Skill).all()

@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill(data: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    skill = Skill(**data.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/{skill_id}", status_code=204)
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
